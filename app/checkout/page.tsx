import AddressInput from 'components/user/after-login/user-details/address-input';
import { Me, countryArea, getCart } from 'lib/saleor';
import Cart from './cart';

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

  return (
    <div className="flex flex-col md:flex-row">
      <div className="mb-24 ml-10 pt-16 md:w-1/2 lg:mb-40 lg:ml-32">
        <div className="font-medium tracking-wider dark:text-[#c9aa9e]">Detalles de entrega</div>
        <div className="flex flex-col pr-10 pt-5">
          <AddressInput user={me} countryAreaChoices={states} />
          <div className="flex flex-row gap-3 pt-5">
            <input type="checkbox" />
            <div className="text-xs tracking-wider">
              Enviarme novedades y ofertas por correo electronico
            </div>
          </div>
          <div className="pt-5 text-xs tracking-wider">Tiempo de entrega: 4 a 7 dias habiles</div>
          <div className="pt-5 text-xs tracking-wider">Terminos y condiciones</div>
        </div>
      </div>
      <div className="border-t-2 border-zinc-300 bg-[#f1f1f1] pt-16 dark:border-t-0 dark:border-[#c9aa9e] dark:dark:bg-zinc-700 md:ml-10 md:w-1/2 md:border-l-2">
        <div className="px-5">
          <Cart cart={cart} />
        </div>
      </div>
    </div>
  );
}
