'use server';

import { Cart } from '#/lib/types';
import { TAGS } from 'lib/constants';
import { refresh } from 'next/cache';

import {
  Me,
  addPromoCode,
  addToCart,
  createCart,
  customerCheckoutAttach,
  getCart,
  getLastCheckout,
  removeFromCart,
  removePromoCode,
  updateCart,
} from 'lib/saleor';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

const firstShopping = async (cart: Cart) => {
  try {
    if (cart.voucherCode == 'first-shopping' && Number(cart.cost.subtotalAmount.amount) > 5000) {
      await removePromoCode({ checkoutId: cart.id, promoCode: 'first-shopping' });
    } else if (
      cart.voucherCode != 'first-shopping' &&
      Number(cart.cost.subtotalAmount.amount) < 5000
    ) {
      await addPromoCode({ checkoutId: cart.id, promoCode: 'first-shopping' });
    }
  } catch (e) {
    console.log(e);
  }
};

export const addItem = async (variantId: string | undefined): Promise<String | undefined> => {
  const user = await Me();
  let checkout;
  let cart;

  checkout = await getLastCheckout();
  if (!checkout) {
    if (user?.id) {
      cart = await createCart(user.email);
      checkout = cart.id;
      await customerCheckoutAttach({ checkoutId: checkout, customerId: user.id });
      revalidateTag(TAGS.user, 'max');
    } else {
      const cookieStore = await cookies();
      const guest_checkout_contact = cookieStore.get('guest_checkout_email')?.value || '';
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest_checkout_contact);
      if (guest_checkout_contact && isValidEmail) {
        checkout = (await createCart(guest_checkout_contact)).id;
      } else {
        checkout = (await createCart()).id;
      }
      cookieStore.set({
        name: 'saleorCheckout',
        value: checkout,
        httpOnly: true,
        maxAge: 864000,
      });
    }
  }

  if (!checkout) {
    return 'Occurió un error inesperado, favor de intentar mas tarde';
  }

  if (!variantId) {
    return 'Missing product variant ID';
  }

  try {
    const newCart = await addToCart(checkout, [{ merchandiseId: variantId, quantity: 1 }]);
    firstShopping(newCart);
    refresh();
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
  const checkout = await getLastCheckout();
  const cart = await getCart(checkout || '');

  if (!cart?.id) {
    return 'Missing cart ID';
  }
  try {
    const newCart = await removeFromCart(cart.id, [lineId]);
    firstShopping(newCart);
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
  const cart = await lastCheckout();

  if (!cart) {
    return 'Missing cart';
  }
  try {
    const newCart = await updateCart(cart.id, [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity,
      },
    ]);
    firstShopping(newCart);
  } catch (e) {
    console.log(e);
    return 'Error updating item quantity';
  }
};

export const lastCheckout = async () => {
  const checkout = await getLastCheckout();
  if (checkout) {
    return await getCart(checkout);
  }
  return null;
};

export async function setGuestCheckoutEmail({ email }: { email: string }) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'guest_checkout_email',
    value: email,
    httpOnly: true,
    maxAge: 864000,
  });
}

export async function setGuestFirstName({ firstName }: { firstName: string }) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'guest_checkout_first_name',
    value: firstName,
    httpOnly: true,
    maxAge: 864000,
  });
}

export async function setGuestSecondName({ secondName }: { secondName: string }) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'guest_checkout_second_name',
    value: secondName,
    httpOnly: true,
    maxAge: 864000,
  });
}

export async function getGuestCheckoutEmail() {
  const cookieStore = await cookies();
  return cookieStore.get('guest_checkout_email')?.value;
}

export async function getGuestFirstName() {
  const cookieStore = await cookies();
  return cookieStore.get('guest_checkout_first_name')?.value;
}

export async function getGuestSecondName() {
  const cookieStore = await cookies();
  return cookieStore.get('guest_checkout_second_name')?.value;
}
