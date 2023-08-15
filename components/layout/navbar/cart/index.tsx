import { createCart, getCart, getUsercart, tokenRefresh, tokenVerify } from 'lib/saleor';
import { cookies } from 'next/headers';
import CartButton from './button';

export default async function Cart() {
  let cartId;
  let cart;
  let isTokenOk;
  let Bearer;
  let cartIdUpdated = false;
  let accessToken = cookies().get('accessToken')?.value;
  let refresToken = cookies().get('refreshToken')?.value;

  if (accessToken && refresToken) {
    try {
      isTokenOk = await tokenVerify(accessToken);
    } catch {}
    if (isTokenOk === true) {
      Bearer = `Bearer ${accessToken}`;
    } else {
      accessToken = await tokenRefresh(refresToken);
      Bearer = `Bearer ${accessToken}`;
    }
    let header = { Authorization: Bearer };
    cartId = await getUsercart(header);

    if (cartId) {
      cart = await getCart(cartId, header);
      if (cartId !== cookies().get('cartId')?.value) {
        cartIdUpdated = true;
      }
    }
    // If the `cartId` from the cookie is not set or the cart is empty
    // (old carts becomes `null` when you checkout), then get a new `cartId`
    //  and re-fetch the cart.
    if (!cartId || !cart) {
      cart = await createCart(header);
      cartIdUpdated = true;
    }
  } else {
    cartId = cookies().get('cartId')?.value;
    if (cartId) {
      cart = await getCart(cartId);
    }
    // If the `cartId` from the cookie is not set or the cart is empty
    // (old carts becomes `null` when you checkout), then get a new `cartId`
    //  and re-fetch the cart.
    if (!cartId || !cart) {
      cart = await createCart();
      cartIdUpdated = true;
    }
  }

  return <CartButton cart={cart} cartIdUpdated={cartIdUpdated} />;
}
