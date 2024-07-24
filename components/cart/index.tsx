import { lastCheckout } from './actions';
import CartModal from './modal';

export default async function Cart() {
  const cart = await lastCheckout();

  return <CartModal cart={cart} />;
}
