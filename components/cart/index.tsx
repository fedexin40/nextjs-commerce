import { getCart, getLastCheckout } from 'lib/saleor';
import CartModal from './modal';

export default async function Cart() {
  let cart = null;
  const checkout = await getLastCheckout();
  if (checkout) {
    cart = await getCart(checkout || '');
  }

  return <CartModal cart={cart} />;
}
