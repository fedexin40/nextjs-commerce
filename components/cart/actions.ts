'use server';

import { TAGS } from 'lib/constants';
import {
  Me,
  addToCart,
  checkoutUser,
  createCart,
  customerCheckoutAttach,
  getCart,
  removeFromCart,
  updateCart,
} from 'lib/saleor';
import { revalidateTag } from 'next/cache';

export const addItem = async (variantId: string | undefined): Promise<String | undefined> => {
  const user = await Me();
  const userEmail = user.email;
  if (!userEmail) {
    return 'Por favor inicia sesion primero';
  }

  let cartId = await checkoutUser();
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  if (!cartId || !cart) {
    cart = await createCart(userEmail);
    cartId = cart.id;
    await customerCheckoutAttach({ checkoutId: cartId, customerId: user.id });
    revalidateTag(TAGS.checkoutUser);
  }

  if (!variantId) {
    return 'Missing product variant ID';
  }

  try {
    await addToCart(cartId, [{ merchandiseId: variantId, quantity: 1 }]);
  } catch (error: any) {
    const field: string = error.message;
    let error_message: string = 'Hubo un error al añadir el producto';
    switch (field) {
      case 'INSUFFICIENT_STOCK':
        error_message = 'Perdon, nos quedamos sin productos';
    }
    return error_message;
  }
};

export const removeItem = async (lineId: string): Promise<String | undefined> => {
  const cartId = await checkoutUser();

  if (!cartId) {
    return 'Missing cart ID';
  }
  try {
    await removeFromCart(cartId, [lineId]);
  } catch (e) {
    return 'Error removing item from cart';
  }
};

export const updateItemQuantity = async ({
  lineId,
  variantId,
  quantity,
}: {
  lineId: string;
  variantId: string;
  quantity: number;
}): Promise<String | undefined> => {
  const cartId = await checkoutUser();

  if (!cartId) {
    return 'Missing cart ID';
  }
  try {
    await updateCart(cartId, [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity,
      },
    ]);
  } catch (e) {
    console.log(e);
    return 'Error updating item quantity';
  }
};
