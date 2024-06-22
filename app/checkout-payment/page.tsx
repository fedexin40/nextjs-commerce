import { StripeComponent } from 'components/stripe/stripe-component';
import { getCart, transactionInitialize } from 'lib/saleor';
import { Suspense } from 'react';
import Cart from './cart';

export default async function CheckoutPayment({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  let checkout;
  if (searchParams) {
    checkout = searchParams['checkout'] || '';
  }

  const cart = await getCart(checkout || '');
  const checkoutPayment = new URL('cart/payment', process.env.SHOP_PUBLIC_URL || '').toString();

  // I believe it is impossible to get until here without
  // a cart, so it is ok just to pass, I am doing the below to make
  // happy typescript
  if (!cart) {
    return;
  }
  const transaction = await transactionInitialize(cart.id);
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

  return (
    <div className="flex flex-col text-xs tracking-wider dark:bg-zinc-700 md:flex-row lg:text-sm">
      <div className="mx-10 mb-16	pt-16 md:mb-24 md:basis-[52%] lg:mb-40 lg:px-10">
        <div className="flex flex-row space-x-3 bg-[#e4c0b2] p-5 dark:text-black">
          <span className="text-sm uppercase">Proyecto 705:</span>
          <span className="text-sm uppercase">${cart?.cost.totalAmount.amount}</span>
        </div>
        <div className="border-2 px-5 py-3 pb-20">
          <Suspense fallback={<div>Loading</div>}>
            <StripeComponent
              clientSecret={stripeData.paymentIntent.client_secret}
              publishableKey={stripeData.publishableKey}
              returnUrl={checkoutPayment}
            />
          </Suspense>
        </div>
      </div>
      <div className="hidden border-[#acacac] bg-[#d4d4d4] px-10 py-16 dark:border-t-0 dark:border-[#c9aa9e] dark:bg-zinc-800 md:flex md:basis-[48%] md:border-l-2 lg:px-10">
        <div className="w-full">
          <Cart cart={cart} />
        </div>
      </div>
    </div>
  );
}
