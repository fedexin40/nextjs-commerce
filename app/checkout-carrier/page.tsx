import { sendMetaCapiEvent } from '#/actions/facebook';
import { InitiateCheckout } from '#/components/FacebookPixel';
import { deliveryMethodUpdate } from 'actions/checkout';
import ShippingMethods from 'components/shipping/shipping';
import { getCart, getShippingMethods } from 'lib/saleor';
import { shippingMethod } from 'lib/types';
import { cookies } from 'next/headers';
import { permanentRedirect, redirect } from 'next/navigation';

export function generateEventId(): string {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export default async function Checkout(props: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  let checkout;
  let fbclid: string | undefined;

  if (searchParams) {
    checkout = searchParams['checkout'] || '';
    fbclid = searchParams['fbclid'] || undefined;
  }

  if (!checkout) {
    const cookieStore = await cookies();
    checkout = cookieStore.get('saleorCartId')?.value;
  }

  if (!checkout) {
    permanentRedirect('/');
  }

  const cart = await getCart(checkout);
  if (!cart) {
    permanentRedirect('/');
  }
  if (cart.lines.every((x) => x.merchandise.product.isShippingRequired == false)) {
    permanentRedirect(cart?.checkoutUrlPayment || '');
  }

  let shippingMethods: shippingMethod[] = [];
  let startTime = new Date();
  const targetTime = new Date(startTime.getTime() + 30000);

  while (shippingMethods.length <= 0) {
    shippingMethods = await getShippingMethods(checkout);
    shippingMethods.sort((y: any, x: any) => y.price - x.price);
    if (startTime > targetTime) {
      break;
    }
    startTime = new Date();
  }
  if (shippingMethods.length <= 0) {
    return (
      <div className="flex w-full flex-row justify-center bg-white text-[13.5px] tracking-[1.4px] md:bg-[#d4d4d4] lg:text-[14.3px]">
        <div className="l:basis-2/4 basis-full bg-white px-10 py-10 md:basis-2/3 md:px-14 md:py-16">
          <div className="flex flex-col pt-5">Algo salio mal. ¿Podrías intentar mas tarde?</div>
        </div>
      </div>
    );
  }

  const date = Date.now();
  const current_timestamp = Math.floor(date / 1000);
  const event_id = `${generateEventId()}_'AddToCart'_${current_timestamp}`;

  function Pixel() {
    try {
      const products = cart?.lines.map((line) => ({
        handle: line.merchandise.product.handle,
        quantity: line.quantity,
      }));
      sendMetaCapiEvent({
        event_name: 'InitiateCheckout',
        fbclid: fbclid,
        value: cart?.cost.subtotalAmount.amount || '0.0',
        event_id: event_id,
        email: cart?.userEmail || undefined,
        phone: cart?.shippingAddress?.phone || undefined,
        current_timestamp: current_timestamp,
        current_timestamp_miliseconds: date,
        products: products || [],
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (Number(cart.cost.subtotalAmount.amount) >= 1000) {
    deliveryMethodUpdate({
      checkoutId: checkout,
      deliveryMethodId: shippingMethods[0]?.id || '',
      carrierName: shippingMethods[0]?.name || '',
      shippingCost: shippingMethods[0]?.price || 0,
    });
    Pixel();
    const cart = await getCart(checkout);
    redirect(cart?.checkoutUrlPayment || '');
  }

  return (
    <>
      <InitiateCheckout
        value={cart.cost.subtotalAmount.amount}
        email={cart.userEmail || undefined}
        phone={cart.shippingAddress?.phone || undefined}
        products={cart.lines.map((x) => ({
          quantity: x.quantity,
          handle: x.merchandise.product.handle,
        }))}
        fbclid={fbclid}
      />
      <div className="flex w-full flex-row justify-center bg-white text-[13.5px] tracking-[1.4px] md:bg-[#d4d4d4] lg:text-[14.3px]">
        <div className="l:basis-2/4 basis-full bg-white px-10 py-10 md:basis-2/3 md:px-14 md:py-16">
          <div className="font-medium uppercase">Elige una paquetería</div>
          <div className="flex flex-col pt-5">
            <ShippingMethods ShippingMethods={shippingMethods} checkoutid={checkout} />
          </div>
        </div>
      </div>
    </>
  );
}
