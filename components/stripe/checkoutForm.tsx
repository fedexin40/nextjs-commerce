// Copied from https://stripe.com/docs/payments/quickstart
/* eslint-disable */
// @ts-nocheck
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';

export default function CheckoutForm({ returnUrl }: { returnUrl: string }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: returnUrl,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message);
    } else {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs',
  };

  return (
    <div className="stripe">
      <form className="payment-form" onSubmit={handleSubmit}>
        <PaymentElement className="payment-element" options={paymentElementOptions} />
        <button
          className="mt-10 h-[45px] w-1/2 bg-[#c9aa9e] px-5 shadow-lg lg:w-1/3 lg:py-1"
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          <div className="whitespace-nowrap p-0">
            {isLoading ? (
              <div className="flex cursor-not-allowed items-center justify-center space-x-6">
                <div className="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.3s] dark:bg-white"></div>
                <div className="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.15s] dark:bg-white"></div>
                <div className="h-4 w-4 animate-bounce rounded-full bg-white dark:bg-white"></div>
              </div>
            ) : (
              'Pagar ahora'
            )}
          </div>
        </button>
        {/* Show any error or success messages */}
        {message && <div className="payment-message pt-5">{message}</div>}
      </form>
    </div>
  );
}
