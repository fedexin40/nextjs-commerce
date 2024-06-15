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
    <div className="flex flex-col tracking-wider md:flex-row">
      <div className="mb-24 ml-10 pr-10 pt-16 md:w-1/2 lg:mb-40 lg:ml-32">
        <div className="flex flex-row space-x-3 bg-[#f0dccc] p-5 dark:text-black lg:text-sm">
          <span>Proyecto 705:</span>
          <span>${cart?.cost.totalAmount.amount}</span>
        </div>
        <div className="border-2 px-5 py-3 pb-20 shadow-lg">
          <Suspense fallback={<div>Loading</div>}>
            <StripeComponent
              clientSecret={stripeData.paymentIntent.client_secret}
              publishableKey={stripeData.publishableKey}
              returnUrl={checkoutPayment}
            />
          </Suspense>
        </div>
      </div>
      <div className="hidden border-[#acacac] bg-[#d4d4d4] py-16 dark:border-t-0 dark:border-[#c9aa9e] dark:dark:bg-zinc-700 md:ml-10 md:block md:w-1/2 md:border-l-2">
        <div className="px-5">
          <Cart cart={cart} />
        </div>
      </div>
    </div>
  );
}
