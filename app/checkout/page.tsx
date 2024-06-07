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
    <div className="flex flex-col tracking-wider md:flex-row">
      <div className="mb-24 ml-10 pt-16 md:w-1/2 lg:mb-40 lg:ml-32">
        <div className="font-medium dark:text-[#c9aa9e]">Detalles de entrega</div>
        <div className="flex flex-col pr-10 pt-5">
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
        <Button checkoutId={checkout || ''} />
      </div>
      <div className="border-[#acacac] bg-[#d4d4d4] py-16 dark:border-t-0 dark:border-[#c9aa9e] dark:dark:bg-zinc-700 md:ml-10 md:w-1/2 md:border-l-2">
        <div className="px-5">
          <Suspense fallback={<>Cargando</>}>
            <Shipping checkoutId={checkout || ''} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
