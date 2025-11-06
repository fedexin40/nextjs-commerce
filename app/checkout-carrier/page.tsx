import { deliveryMethodUpdate } from 'actions/checkout';
import ShippingMethods from 'components/shipping/shipping';
import { getCart, getShippingMethods } from 'lib/saleor';
import { shippingMethod } from 'lib/types';
import { cookies } from 'next/headers';
import { permanentRedirect, redirect } from 'next/navigation';

export default async function Checkout(props: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  let checkout;

  if (searchParams) {
    checkout = searchParams['checkout'] || '';
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

  const shippingMethods: shippingMethod[] = await getShippingMethods(checkout);
  shippingMethods.sort((y: any, x: any) => y.price - x.price);

  if (Number(cart.cost.totalAmount.amount) >= 1500) {
    deliveryMethodUpdate({
      checkoutId: checkout,
      deliveryMethodId: shippingMethods[0]?.id || '',
      carrierName: shippingMethods[0]?.name || '',
      shippingCost: shippingMethods[0]?.price || 0,
    });
    redirect(cart.checkoutUrlPayment);
  }

  return (
    <div className="flex w-full flex-row justify-center bg-white text-[13.5px] tracking-[1.4px] md:bg-[#d4d4d4] lg:text-[14.3px]">
      <div className="l:basis-2/4 basis-full bg-white px-10 py-10 md:basis-2/3 md:px-14 md:py-16">
        <div className="font-medium uppercase">Elige una paquetería</div>
        <div className="flex flex-col pt-5">
          <ShippingMethods ShippingMethods={shippingMethods} checkoutid={checkout} />
        </div>
      </div>
    </div>
  );
}
