'use server';

import { TAGS } from 'lib/constants';
import {
  Me,
  addToCart,
  createCart,
  customerCheckoutAttach,
  getCart,
  removeFromCart,
  updateCart,
} from 'lib/saleor';
import { TransactionEventTypeEnum } from 'lib/saleor/generated/graphql';
import { revalidateTag } from 'next/cache';

TransactionEventTypeEnum;

export const addItem = async (variantId: string | undefined): Promise<String | undefined> => {
  const user = await Me();
  const userEmail = user.email;
  if (!userEmail) {
    return 'Por favor inicia sesion primero';
  }

  let cart = await lastCheckout();

  if (!cart) {
    cart = await createCart(userEmail);

    await customerCheckoutAttach({ checkoutId: cart.id, customerId: user.id });
    revalidateTag(TAGS.user);
  }
  const cartId = cart.id;

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
  const cart = await lastCheckout();

  if (!cart?.id) {
    return 'Missing cart ID';
  }
  try {
    await removeFromCart(cart.id, [lineId]);
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
    await updateCart(cart.id, [
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

export const lastCheckout = async () => {
  let cart;
  const cartId = (await Me()).lastCheckout;

  if (cartId) {
    cart = await getCart(cartId);
  }

  // Below functions is in charge of finding whether the lastCheckout
  // is waiting for a payment to be completed or not
  // Let's say for example, the user selected a STP payment method, so the
  // the checkout is in waiting status
  // I could not find other way to find this except for checking the number of
  // CHARGE_ACTION_REQUIRED events.
  // If there are two CHARGE_ACTION_REQUIRED events on the same transaction then
  // the checkout is waiting for the payment to be completed
  if (cart) {
    for (
      var index_transaction = 0;
      index_transaction < (cart.transactions?.length || 0);
      index_transaction++
    ) {
      if (!cart.transactions) {
        continue;
      }
      let charge_action_required_count: number;
      charge_action_required_count = 0;
      for (
        var index_event = 0;
        index_event < (cart.transactions[index_transaction]?.events.length || 0);
        index_event++
      )
        if (
          cart.transactions[index_transaction]?.events[index_event]?.type ==
          TransactionEventTypeEnum.ChargeActionRequired
        ) {
          charge_action_required_count += 1;
          // The number of charge_action_required_count events on the same
          // transaction is equal to 2 this means that the checkout is waiting for payment
          if (charge_action_required_count == 2) {
            return null;
          }
        }
    }
    return cart;
  }
  return null;
};
