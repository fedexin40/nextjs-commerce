'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMemo } from 'react';
import CheckoutForm from './checkoutForm';

export const StripeComponent = ({
  clientSecret,
  publishableKey,
  returnUrl,
}: {
  clientSecret: string;
  publishableKey: string;
  returnUrl: string;
}) => {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);

  return (
    <>
      <div className="hidden dark:block">
        <Elements
          options={{
            clientSecret,
            appearance: { theme: 'night', variables: { fontLineHeight: '16px' } },
          }}
          stripe={stripePromise}
        >
          <CheckoutForm returnUrl={returnUrl} />
        </Elements>
      </div>
      <div className="block dark:hidden">
        <Elements
          options={{
            clientSecret,
            appearance: { theme: 'stripe', variables: { fontLineHeight: '16px' } },
          }}
          stripe={stripePromise}
        >
          <CheckoutForm returnUrl={returnUrl} />
        </Elements>
      </div>
    </>
  );
};
