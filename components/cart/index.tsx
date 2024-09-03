import { lastCheckout } from 'actions/cart';
import CartModal from './modal';

export default async function Cart() {
  const cart = await lastCheckout();

  return <CartModal cart={cart} />;
}
