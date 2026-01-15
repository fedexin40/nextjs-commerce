import { UpdateMetadata } from '#/components/FacebookPixel';
import Paypal from 'components/paypal/page';
import { StripeComponent } from 'components/stripe/stripe-component';
import { getCart, transactionInitialize } from 'lib/saleor';
import Image from 'next/image';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';
import Cart from './cart';

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
  const value = cart.cost.totalAmount.amount;
  return (
    <>
      <UpdateMetadata cart={cart} />
      <div className="flex flex-col text-[13.5px] tracking-[1.4px] md:flex-row lg:text-[14.3px]">
        <div className="mx-10 mb-16 pt-16 md:mb-24 md:basis-[52%] lg:mb-40 lg:px-10">
          <div className="relative mb-5 h-[50px] w-[180px] hover:cursor-pointer">
            <Link href="https://stripe.com/mx/newsroom/information">
              <Image className="object-contain" src={'/stripe.png'} alt="" fill />
            </Link>
          </div>
          <div className="flex flex-row space-x-3 bg-[#e4c0b2] p-5">
            <span className="capitalize">Proyecto 705:</span>
            <span className="uppercase">${cart?.cost.totalAmount.amount}</span>
          </div>
          <div className="border-2 border-[#acacac] px-5 py-3 pb-20">
            <StripeComponent
              clientSecret={stripeData.paymentIntent.client_secret}
              publishableKey={stripeData.publishableKey}
              returnUrl={checkoutPayment.toString()}
              content_ids={content_ids}
              value={value}
            />
          </div>
          <Paypal TotalAmount={value} checkoutID={cart.id} />
        </div>
        <div className="hidden border-[#acacac] bg-[#d4d4d4] px-10 py-16 md:flex md:basis-[48%] md:border-l-2 lg:px-10">
          <div className="w-full">
            <Cart cart={cart} />
          </div>
        </div>
      </div>
    </>
  );
}
