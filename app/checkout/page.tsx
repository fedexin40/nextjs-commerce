import { InitiateCheckout } from 'components/FacebookPixel';
import Shipping from 'components/shipping/page';
import AddressInput from 'components/user-details/address-form';
import { countryArea, getCart, Me } from 'lib/saleor';
import { permanentRedirect } from 'next/navigation';
import Button from './next-button';

export default async function Checkout(props: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  let checkout;
  const states = await countryArea();
  const me = await Me();

  if (searchParams) {
    checkout = searchParams['checkout'] || '';
  }

  const cart = await getCart(checkout || '');
  if (!cart) {
    permanentRedirect('/');
  }
  if (cart.lines.every((x) => x.merchandise.product.isShippingRequired == false)) {
    permanentRedirect(cart?.checkoutUrlPayment || '');
  }
  const cartTotal = cart?.cost.totalAmount.amount;
  // Used for facebook pixel
  const content_ids = cart.lines.map((x) => x.merchandise.product.handle);

  return (
    <div className="flex flex-col text-[13.5px] tracking-[1.4px] dark:bg-zinc-700 md:flex-row lg:text-[14.3px]">
      <div className="mx-10 mb-16	pt-16 md:mb-24 md:basis-[52%] lg:mb-40 lg:px-10">
        <div className="font-medium uppercase dark:text-[#c9aa9e]">Detalles de entrega</div>
        <div className="pt-2 md:hidden">
          En la parte de abajo podras encontrar las paqueterias disponibles una vez que ingreses tu
          direccion
        </div>
        <div className="flex flex-col pt-5">
          <AddressInput cart={cart} user={me} countryAreaChoices={states} />
          <div className="flex flex-row gap-3 pt-5">
            <input type="checkbox" />
            <div className="text-[10px] md:text-xs">
              Enviarme novedades y ofertas por correo electronico
            </div>
          </div>
          <div className="pt-5 text-[10px] md:text-xs">Tiempo de entrega: 2 a 7 dias habiles</div>
          <div className="pt-5 text-[10px] md:text-xs">Terminos y condiciones</div>
        </div>
        <div className="hidden pt-10 md:flex md:w-1/2 lg:w-1/3">
          <Button checkoutId={checkout || ''} user={me} />
        </div>
      </div>
      <div className="border-[#acacac] bg-[#d4d4d4] px-10 py-16 dark:border-t-0 dark:border-[#c9aa9e] dark:bg-zinc-800 md:basis-[48%] md:border-l-2 lg:px-10">
        <div className=" flex flex-col">
          <Shipping checkoutTotal={cartTotal} checkoutId={checkout || ''} user={me} />
          <div className="mt-16 block w-full place-self-center dark:bg-[#c9aa9e] md:hidden">
            <Button checkoutId={checkout || ''} user={me} />
          </div>
        </div>
      </div>
      <InitiateCheckout
        currency={'MXN'}
        content_ids={content_ids}
        content_type="product"
        value={cartTotal}
      />
    </div>
  );
}
