import AddressInput from 'components/user-details/address-form';
import { countryArea, getCart, Me } from 'lib/saleor';
import { cookies } from 'next/headers';
import { permanentRedirect } from 'next/navigation';

export default async function Checkout(props: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  let checkout;
  const states = await countryArea();
  const me = await Me();
  const cookieStore = await cookies();

  if (searchParams) {
    checkout = searchParams['checkout'] || '';
  }

  if (!checkout) {
    checkout = cookieStore.get('saleorCartId')?.value;
  }

  if (!checkout) {
    permanentRedirect('/');
  }

  const guestEmail = cookieStore.get('guest_checkout_email')?.value;
  const guestFirstName = cookieStore.get('guest_checkout_first_name')?.value;
  const guestSecondName = cookieStore.get('guest_checkout_second_name')?.value;

  const cart = await getCart(checkout);
  if (!cart) {
    permanentRedirect('/');
  }
  if (cart.lines.every((x) => x.merchandise.product.isShippingRequired == false)) {
    permanentRedirect(cart?.checkoutUrlPayment || '');
  }

  return (
    <div className="flex w-full flex-row justify-center bg-white text-[13.5px] tracking-[1.4px] md:bg-[#d4d4d4] lg:text-[14.3px]">
      <div className="l:basis-2/4 basis-full bg-white px-10 py-10 md:basis-2/3 md:px-14 md:py-16">
        <div className="font-medium uppercase">Detalles de entrega</div>
        <div className="flex flex-col pt-5">
          <AddressInput
            cart={cart}
            user={me}
            countryAreaChoices={states}
            cacheValues={{
              guestEmail: guestEmail || '',
              guestFirstName: guestFirstName || '',
              guestSecondName: guestSecondName || '',
            }}
          />
        </div>
      </div>
    </div>
  );
}
