/* eslint-disable */
// @ts-nocheck
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { refreshUser } from 'actions/user';
import { useState } from 'react';

export default function CheckoutForm({
  returnUrl,
  content_ids,
  value,
  clientSecret,
  checkoutId,
}: {
  returnUrl: string;
  content_ids: string[];
  value: string;
  clientSecret: string;
  checkoutId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!stripe || !elements) return;

    setIsLoading(true);

    // 1) Fuerza validación del PaymentElement (campos requeridos / incompletos)
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setMessage(submitError.message || 'Completa tu método de pago.');
      setIsLoading(false);
      return;
    }

    // Extrae PI id desde client_secret: "pi_..._secret_..."
    const paymentIntentId = clientSecret.split('_secret_')[0];

    // 3) PON LOCK ANTES del confirmPayment para cubrir redirect/3DS
    try {
      await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkoutId,
        }),
      });
    } catch (error) {
      console.log(error);
      // Si no puedes lockear, mejor no sigas (para evitar dobles pagos sin control)
      setMessage('No se pudo bloquear el checkout para evitar doble pago. Intenta de nuevo.');
      setIsLoading(false);
      return;
    }

    // 2) Evita redirección automática cuando no es necesaria
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
      redirect: 'if_required',
    });

    // Si hay error inmediato, lo muestras aquí y NO hay redirect
    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message);
      } else {
        setMessage('Ocurrió un error inesperado.');
      }
      setIsLoading(false);
      return;
    }

    // Si no hubo error inmediato y no requirió redirect, el pago puede estar "processing" o "succeeded".
    // (Opcional) Aquí podrías mostrar un mensaje o refrescar datos.
    setIsLoading(false);
    refreshUser();
  };

  const paymentElementOptions = {
    layout: {
      type: 'accordion',
      defaultCollapsed: true,
      radios: false,
      spacedAccordionItems: true,
    },
  };

  return (
    <div className="stripe">
      <form className="payment-form" onSubmit={handleSubmit}>
        <PaymentElement className="payment-element" options={paymentElementOptions} />

        <button
          className="mt-10 h-[60px] w-full items-center justify-center bg-[#e4c0b2] px-5 md:w-1/2 lg:w-1/3 lg:py-1"
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          <div className="whitespace-nowrap p-0 text-[15.5px] tracking-[1.4px] lg:text-[16.3px]">
            {isLoading ? (
              <div className="flex cursor-not-allowed items-center justify-center space-x-6">
                <div className="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
                <div className="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
                <div className="h-4 w-4 animate-bounce rounded-full bg-white" />
              </div>
            ) : (
              'Pagar ahora'
            )}
          </div>
        </button>

        {message && <div className="payment-message pt-5">{message}</div>}
      </form>
    </div>
  );
}
