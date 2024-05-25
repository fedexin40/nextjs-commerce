import { StripeComponent } from 'components/stripe/stripe-component';
import { getCart, transactionInitialize } from 'lib/saleor';
import { Suspense } from 'react';

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
    <div className="flex w-full flex-row place-content-center">
      <Suspense>
        <div className="w-full place-content-center text-base md:w-1/2">
          <div className="flex flex-row space-x-3 bg-[#f0dccc] p-5 dark:text-black lg:text-lg">
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
      </Suspense>
    </div>
  );
}
