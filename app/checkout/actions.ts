'use server';

import { getCart, updateDeliveryMethod } from 'lib/saleor';
import { redirect } from 'next/navigation';

export async function deliveryMethodUpdate({
  checkoutId,
  deliveryMethodId,
}: {
  checkoutId: string;
  deliveryMethodId: string;
}) {
  const cart = await getCart(checkoutId);
  try {
    await updateDeliveryMethod({ checkoutId, deliveryMethodId });
  } catch (error: any) {
    return error.message;
  }
  redirect(cart?.checkoutUrlPayment || '');
}
