import { completeCheckout, gatewayPayment, getCheckoutFromCookiesOrRedirect } from 'lib/saleor';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

export default async function CartPaymentPage({
  searchParams,
}: {
  // these params are provided by Stripe https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements#web-submit-payment
  searchParams: { payment_intent?: string; payment_intent_client_secret?: string };
}) {
  if (!searchParams.payment_intent || !searchParams.payment_intent_client_secret) {
    redirect('/');
  }

  let order;
  const checkoutId = await getCheckoutFromCookiesOrRedirect();
  const paymentGateway = await gatewayPayment(checkoutId);

  const stripeData = paymentGateway.paymentGatewayInitialize?.gatewayConfigs?.find(
    (gateway: { id: any }) => gateway.id === 'app.saleor.stripe',
  )?.data as undefined | { publishableKey: string };

  if (
    !stripeData?.publishableKey ||
    paymentGateway.paymentGatewayInitialize?.errors.length ||
    paymentGateway.paymentGatewayInitialize?.gatewayConfigs?.some(
      (gateway) => gateway.errors?.length,
    )
  ) {
    redirect('/');
  }

  const stripe = new Stripe(stripeData.publishableKey, { apiVersion: '2024-04-10' });

  const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent, {
    client_secret: searchParams.payment_intent_client_secret,
  });

  if (paymentIntent.status === 'processing') {
    // @todo refresh
    return <p>Payment processing. We&apos;ll update you when payment is received.</p>;
  }
  if (paymentIntent.status === 'requires_payment_method') {
    redirect('/');
  }
  if (paymentIntent.status === 'succeeded') {
    try {
      order = await completeCheckout(checkoutId);
    } catch (error: any) {
      console.log(error);
      return <>{error.message}</>;
    }
    const orderId = order.checkoutComplete?.order?.id;
    redirect(`/cart/success/${orderId}`);
  }
}
