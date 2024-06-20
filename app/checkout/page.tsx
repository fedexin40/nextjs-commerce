import Shipping from 'components/shipping/page';
import AddressInput from 'components/user/after-login/user-details/address-form';
import { Me, countryArea } from 'lib/saleor';
import { Suspense } from 'react';
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

  return (
    <div className="flex flex-col text-xs tracking-wider dark:bg-zinc-700 md:flex-row lg:text-sm">
      <div className="mx-10 mb-16	pt-16 md:mb-24 md:basis-[52%] lg:mb-40 lg:px-10">
        <div className="text-sm font-medium uppercase dark:text-[#c9aa9e]">Detalles de entrega</div>
        <div className="flex flex-col pt-5">
          <AddressInput user={me} countryAreaChoices={states} />
          <div className="flex flex-row gap-3 pt-5">
            <input type="checkbox" />
            <div className="text-xs tracking-wider">
              Enviarme novedades y ofertas por correo electronico
            </div>
          </div>
          <div className="pt-5 text-xs tracking-wider">Tiempo de entrega: 2 a 7 dias habiles</div>
          <div className="pt-5 text-xs tracking-wider">Terminos y condiciones</div>
        </div>
        <div className="hidden pt-10 md:flex md:w-1/2 lg:w-1/3">
          <Button checkoutId={checkout || ''} user={me} />
        </div>
      </div>
      <div className="border-[#acacac] bg-[#d4d4d4] px-10 py-16 dark:border-t-0 dark:border-[#c9aa9e] dark:bg-zinc-800 md:basis-[48%] md:border-l-2 lg:px-10">
        <div className=" flex flex-col">
          <Suspense fallback={<>Cargando</>}>
            <Shipping checkoutId={checkout || ''} user={me} />
          </Suspense>
          <div className="mt-16 block w-full place-self-center dark:bg-[#c9aa9e] md:hidden">
            <Button checkoutId={checkout || ''} user={me} />
          </div>
        </div>
      </div>
    </div>
  );
}
