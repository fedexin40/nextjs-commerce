'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMemo } from 'react';
import CheckoutForm from './checkoutForm';

export const StripeComponent = ({
  clientSecret,
  publishableKey,
  returnUrl,
  content_ids,
  value,
  checkoutId,
}: {
  clientSecret: string;
  publishableKey: string;
  returnUrl: string;
  content_ids: string[];
  value: string;
  checkoutId: string;
}) => {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);

  return (
    <>
      <div className="block">
        <Elements
          options={{
            locale: 'es-419',
            clientSecret,
            appearance: { theme: 'flat', variables: { fontLineHeight: '16px' } },
          }}
          stripe={stripePromise}
        >
          <CheckoutForm
            returnUrl={returnUrl}
            content_ids={content_ids}
            value={value}
            clientSecret={clientSecret}
            checkoutId={checkoutId}
          />
        </Elements>
      </div>
    </>
  );
};
