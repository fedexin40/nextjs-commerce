import Address from 'components/user/after-login/user-details/address';
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
        <div className="font-semibold tracking-wider">Detalles de entrega</div>
        <div className="pr-10 pt-5">
          <Address user={me} countryAreaChoices={states} black />
        </div>
      </div>
      <div className="border-t-2 border-zinc-300 bg-zinc-200 pt-16 md:ml-10 md:w-1/2 md:border-l-2">
        <div className="px-5">
          <Cart cart={cart} />
        </div>
      </div>
    </div>
  );
}
