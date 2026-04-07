'use client';

import { FUNDING, PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { confirmPaypal } from 'actions/paypal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const paypal_client_id = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export default function Paypal({
  TotalAmount,
  checkoutID,
}: {
  TotalAmount: string;
  checkoutID: string;
}) {
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState<null | string>(null);
  const router = useRouter();

  const handlePaymentSuccess = async (details: any) => {
    setLoading(true);
    console.log('Payment Successful:', details);

    const captureId = details.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    const checkoutId = details.purchase_units?.[0]?.custom_id;
    if (!captureId) {
      console.log('Capture ID not found.');
      setLoading(false);
      return;
    }
    setLoading(false);
    confirmPaypal({ checkoutId: checkoutId });
    router.replace('/cart/processing');
  };

  return (
    <div className="relative flex">
      <div className="container mx-auto max-w-screen-lg">
        {/* PayPal Payment */}
        <div className="w-full pt-10 text-center"> Tambien puedes pagar con PayPal </div>
        <div className="mt-6 text-center">
          <PayPalScriptProvider
            options={{
              clientId: paypal_client_id || '',
              currency: 'MXN', // Adjust the currency code as needed
              locale: 'es_MX',
            }}
          >
            <PayPalButtons
              disabled={isLoading}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        currency_code: 'MXN',
                        value: Number(TotalAmount).toFixed(2),
                      },
                      custom_id: checkoutID,
                      soft_descriptor: 'Joyeria Proyecto 705',
                    },
                  ],
                  intent: 'CAPTURE',
                });
              }}
              //@ts-ignore
              onApprove={(data, actions) => {
                return actions.order?.capture().then(handlePaymentSuccess);
              }}
              onError={(err: any) => {
                console.log('Payment Error:', err);
                if (err) {
                  setMessage(err);
                  // Display an error message to the user
                }
              }}
              fundingSource={FUNDING.PAYPAL}
            />
            {/* Show any error or success messages */}
            {message && <div className="payment-message pt-5">{message}</div>}
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
}
