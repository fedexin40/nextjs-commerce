import { UpdateMetadata } from '#/components/FacebookPixel';
import Price from '#/components/price';
import { DEFAULT_OPTION } from '#/lib/constants';
import { createUrl } from '#/lib/utils';
import Paypal from 'components/paypal/page';
import { StripeComponent } from 'components/stripe/stripe-component';
import { getCart, transactionInitialize } from 'lib/saleor';
import type { Cart as CartType } from 'lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';
import { CartMobile } from './cart';

type MerchandiseSearchParams = {
  [key: string]: string;
};

function Cart({
  cart,
  shippingAmount,
  totalAmount,
}: {
  cart: CartType | null;
  shippingAmount: number;
  totalAmount: number;
}) {
  // TODO: Below logic is becuase shippingAmount is not reloaded. It is like it were cached
  // but I could not find where
  const subTotal = shippingAmount > 0 ? (totalAmount - shippingAmount) / 1.16 : totalAmount / 1.16;

  return (
    <>
      <div className="flex flex-col justify-between overflow-hidden">
        <ul className="flex-grow py-4">
          {cart.lines.map((item, i) => {
            const merchandiseSearchParams = {} as MerchandiseSearchParams;

            item.merchandise.selectedOptions.forEach(({ name, value }) => {
              if (value !== DEFAULT_OPTION) {
                merchandiseSearchParams[name.toLowerCase()] = value;
              }
            });

            const merchandiseUrl = createUrl(
              `/Colecciones/${item.merchandise.product.featureCollection?.slug}/${item.merchandise.product.handle}`,
              new URLSearchParams(merchandiseSearchParams),
            );

            return (
              <li key={i} className="flex w-full flex-col border-b border-neutral-300">
                <div className="relative flex w-full flex-row justify-between px-1 py-4">
                  <Link href={merchandiseUrl} className="z-30 flex flex-row space-x-4">
                    <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300">
                      <Image
                        className="h-full w-full object-cover"
                        width={64}
                        height={64}
                        alt={
                          item.merchandise.product.featuredImage.altText ||
                          item.merchandise.product.title
                        }
                        src={item.merchandise.product.featuredImage.url}
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      {item.merchandise.title !== DEFAULT_OPTION ? (
                        <p className="text-[13px] tracking-widest lg:text-[14.3px]">
                          {item.merchandise.title}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                  <div className="flex h-16 flex-col justify-between">
                    <Price
                      className="flex justify-end space-y-2 text-right"
                      amountMax={item.cost.totalAmount.amount}
                      currencyCode={item.cost.totalAmount.currencyCode}
                    />
                    <div className="ml-auto flex h-9 flex-row items-center">
                      <div className="flex flex-row">
                        <span className="pr-2">Piezas:</span>
                        <p className="w-6 text-center">
                          <span className="w-full">{item.quantity}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col pt-10 text-neutral-500">
          <div className="mb-2 flex items-center justify-between border-[#acacac] pb-1 capitalize text-black">
            <p>Subtotal</p>
            <Price
              className="text-black"
              amountMax={subTotal.toFixed(2).toString()}
              currencyCode="MXN"
            />
          </div>
          <div className="mb-2 flex items-center justify-between border-t-2 border-[#acacac] pb-1 pt-5 uppercase text-black">
            <p>Iva (16%)</p>
            <Price
              className="text-black"
              amountMax={(totalAmount - (subTotal + shippingAmount)).toFixed(2).toString()}
              currencyCode="MXN"
            />
          </div>
          <div className="mb-2 flex items-center justify-between border-t-2 border-[#acacac] pb-1 pt-5 capitalize text-black">
            <p>Envío</p>
            <Price
              className="text-black"
              amountMax={shippingAmount.toString()}
              currencyCode="MXN"
            />
          </div>
          <div className="mb-2 flex items-center justify-between border-t-2 border-[#acacac] pb-1 pt-5 capitalize text-black">
            <p>Total</p>
            <Price
              className="text-black"
              amountMax={totalAmount.toFixed(2).toString()}
              currencyCode="MXN"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default async function CheckoutPayment(props: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  let checkout;
  if (searchParams) {
    checkout = searchParams['checkout'] || '';
  }

  const cart = await getCart(checkout || '');
  if (!cart) {
    permanentRedirect('/');
  }
  const checkoutPayment = new URL('cart/processing', process.env.SHOP_PUBLIC_URL || '');
  checkoutPayment.searchParams.append('checkout', cart.id);
  const userEmail = cart?.userEmail;
  const firstName = cart?.firstName;
  const lastName = cart?.lastName;
  const stripe_secret_key = process.env.STRIPE_SECRET_KEY;
  const stripe = require('stripe')(stripe_secret_key);
  let user = await stripe.customers.search({
    query: `email:"${userEmail}"`,
  });
  let userId;
  /*
  Create the customer in Stripe
  */
  if (user.data.length <= 0) {
    user = await stripe.customers.create({
      name: firstName + ' ' + lastName,
      email: userEmail,
    });
    userId = user.id;
  } else {
    userId = user.data[0].id;
  }
  // I believe it is impossible to get until here without
  // a cart, so it is ok just to pass, I am doing the below to make
  // happy typescript
  if (!cart) {
    return;
  }

  // TODO: Below logic is becuase shippingAmount is not updated when setting the free voucher discount in the cart
  // It is like it were cached, and it fails randomly but I could not find why
  const shippingAmount =
    Number(cart.cost.subtotalAmount.amount) >= 1000
      ? 0.0
      : Number(cart.cost.totalShippingAmount.amount);
  const totalAmount =
    Number(cart.cost.subtotalAmount.amount) >= 1000
      ? Number(cart.cost.subtotalAmount.amount)
      : Number(cart.cost.subtotalAmount.amount) + shippingAmount;

  const transaction = await transactionInitialize({
    paymentGateway: 'app.saleor.stripe',
    checkoutId: cart.id,
    data: { customer: userId },
  });
  const stripeData = transaction.transactionInitialize?.data as
    | undefined
    | {
        paymentIntent: {
          client_secret: string;
        };
        publishableKey: string;
      };
  if (transaction.transactionInitialize?.errors.length || !stripeData) {
    return (
      <div className="text-red-500">
        <p>Failed to initialize Stripe transaction</p>
        <pre>{JSON.stringify(transaction, null, 2)}</pre>
      </div>
    );
  }

  // Used for facebook pixel
  const content_ids = cart.lines.map((x) => x.merchandise.product.handle);
  const value = totalAmount.toFixed(2).toString();
  return (
    <>
      <UpdateMetadata cart={cart} />
      <div className="flex flex-col text-[16.5px] tracking-[1.4px] md:flex-row lg:text-[14.3px]">
        <div className="mx-10 mb-16 flex flex-col pt-6 md:mb-24 md:basis-[52%] md:pt-16 lg:mb-40 lg:px-10">
          <div className="md:hidden">
            <CartMobile>
              <Cart cart={cart} shippingAmount={shippingAmount} totalAmount={totalAmount} />
            </CartMobile>
          </div>
          <div className="relative mb-5 h-[50px] w-[180px] hover:cursor-pointer">
            <Link href="https://stripe.com/mx/newsroom/information">
              <Image className="object-contain" src={'/stripe.png'} alt="" fill />
            </Link>
          </div>
          <div className="flex flex-row space-x-3 bg-[#e4c0b2] p-5">
            <span className="capitalize">Proyecto 705:</span>
            <span className="uppercase">${value}</span>
          </div>
          <div className="border-2 border-[#acacac] px-5 py-3 pb-20">
            <StripeComponent
              clientSecret={stripeData.paymentIntent.client_secret}
              publishableKey={stripeData.publishableKey}
              returnUrl={checkoutPayment.toString()}
              content_ids={content_ids}
              value={value}
              checkoutId={cart.id}
            />
          </div>
          <div className="z-40">
            <Paypal TotalAmount={value} checkoutID={cart.id} />
          </div>
        </div>
        <div className="hidden border-[#acacac] bg-[#d4d4d4] px-10 py-16 md:flex md:basis-[48%] md:border-l-2 lg:px-10">
          <div className="w-full">
            <Cart cart={cart} shippingAmount={shippingAmount} totalAmount={totalAmount} />
          </div>
        </div>
      </div>
    </>
  );
}
