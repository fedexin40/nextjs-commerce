'use client';

import CartIcon from 'components/icons/cart';
import type { Cart } from 'lib/types';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import CartModal from './modal';

export default function CartButton({
  cart,
  cartIdUpdated
}: {
  cart: Cart;
  cartIdUpdated: boolean;
}) {
  const [, setCookie] = useCookies(['cartId']);
  const [cartIsOpen, setCartIsOpen] = useState(false);

  // Temporary hack to update the `cartId` cookie when it changes since we cannot update it
  // on the server-side (yet).
  useEffect(() => {
    if (cartIdUpdated) {
      setCookie('cartId', cart.id, {
        path: '/',
        sameSite: 'strict',
        maxAge: 5256000,
        secure: process.env.NODE_ENV === 'production'
      });
    }
    return;
  }, [setCookie, cartIdUpdated, cart.id]);

  return (
    <>
      <CartModal isOpen={cartIsOpen} onClose={() => setCartIsOpen(false)} cart={cart} />

      <button
        className="mx-2 cursor-pointer rounded-full bg-yellow-500 p-2 text-white shadow-sm transition hover:bg-yellow-800"
        aria-label="Open cart"
        onClick={() => {
          setCartIsOpen(true);
        }}
        data-testid="open-cart"
      >
        <CartIcon quantity={cart.totalQuantity} />
      </button>
    </>
  );
}
