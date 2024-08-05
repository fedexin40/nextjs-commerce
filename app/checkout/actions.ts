'use server';

import { checkoutAddPromoCode, getCart, updateDeliveryMethod } from 'lib/saleor';
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
    if (Number(cart?.cost.totalAmount.amount) >= 1500) {
      try {
        await checkoutAddPromoCode({ checkoutId });
      } catch (error: any) {
        console.log(error.message);
      }
    }
  } catch (error: any) {
    return error.message;
  }
  redirect(cart?.checkoutUrlPayment || '');
}
