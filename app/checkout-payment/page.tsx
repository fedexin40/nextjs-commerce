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
    <div className="flex w-full flex-row text-sm tracking-wider">
      <Suspense>
        <div className="hidden w-1/2 flex-col gap-y-8 pt-8 md:flex">
          <div>
            <div className="text-base font-medium">!! Gracias por comprar con nosotros !!</div>
          </div>
          <div className="flex flex-col gap-y-3 px-7">
            <div className="flex flex-row gap-x-2">
              <div className="h-2 w-2 place-self-center bg-[#c9aa9e]" />
              <div>Numero de pedido:</div>
              <div className="font-semibold text-[#c9aa9e]">{cart?.token}</div>
            </div>
            <div className="flex flex-row gap-x-2">
              <div className="h-2 w-2 place-self-center bg-[#c9aa9e]" />
              <div>Fecha:</div>
              <div className="font-semibold text-[#c9aa9e]">{cart?.updatedAt.split('T')[0]}</div>
            </div>
            <div className="flex flex-row gap-x-2">
              <div className="h-2 w-2 place-self-center bg-[#c9aa9e]" />
              <div>Total:</div>
              <div className="font-semibold text-[#c9aa9e]">${cart?.cost.totalAmount.amount}</div>
            </div>
            <div className="flex flex-row gap-x-2">
              <div className="h-2 w-2 place-self-center bg-[#c9aa9e]" />
              <div>Tiempo de entrega:</div>
              <div className="font-semibold text-[#c9aa9e]">4 a 7 dias habiles</div>
            </div>
          </div>
        </div>
      </Suspense>
      <Suspense>
        <div className="w-full place-content-center text-base md:w-1/2">
          <div className="flex flex-row space-x-3 bg-[#f0dccc] p-5 dark:text-black lg:text-lg">
            <span>Proyecto 705:</span>
            <span>${cart?.cost.totalAmount.amount}</span>
          </div>
          <div className="border-2 px-5 py-3 pb-20 shadow-lg">
            <Suspense>
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
