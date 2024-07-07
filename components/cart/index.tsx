import { checkoutUser, getCart } from 'lib/saleor';
import CartModal from './modal';

export default async function Cart() {
  const cartId = await checkoutUser();
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  return <CartModal cart={cart} />;
}
