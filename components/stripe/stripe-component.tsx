'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMemo } from 'react';
import CheckoutForm from './checkoutForm';

export const StripeComponent = ({
  clientSecret,
  publishableKey,
  returnUrl,
  checkoutId,
  email,
  name,
  phone,
}: {
  clientSecret: string;
  publishableKey: string;
  returnUrl: string;
  checkoutId: string;
  email: string | undefined | null;
  name: string;
  phone: string;
}) => {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);

  return (
    <>
      <div className="block">
        <Elements
          options={{
            locale: 'es-419',
            clientSecret,
            appearance: { theme: 'stripe' },
          }}
          stripe={stripePromise}
        >
          <CheckoutForm
            returnUrl={returnUrl}
            clientSecret={clientSecret}
            checkoutId={checkoutId}
            email={email}
            name={name}
            phone={phone}
          />
        </Elements>
      </div>
    </>
  );
};
