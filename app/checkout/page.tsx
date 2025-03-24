import Shipping from 'components/shipping/page';
import AddressInput from 'components/user-details/address-form';
import { countryArea, getCart, Me } from 'lib/saleor';
import { permanentRedirect } from 'next/navigation';
import Button from './next-button';

export default async function Checkout({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
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
  const cartTotal = cart?.cost.totalAmount.amount;

  return (
    <div className="flex flex-col tracking-wider dark:bg-zinc-700 md:flex-row">
      <div className="mx-10 mb-16	pt-16 md:mb-24 md:basis-[52%] lg:mb-40 lg:px-10">
        <div className="font-medium uppercase dark:text-[#c9aa9e]">Detalles de entrega</div>
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
          <h1 className="pb-10">Por favor seleccione una paquetería de la lista de abajo</h1>
          <Shipping checkoutTotal={cartTotal} checkoutId={checkout || ''} user={me} />
          <div className="mt-16 block w-full place-self-center dark:bg-[#c9aa9e] md:hidden">
            <Button checkoutId={checkout || ''} user={me} />
          </div>
        </div>
      </div>
    </div>
  );
}
