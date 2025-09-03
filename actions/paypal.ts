'use server';

import { updateMetaData } from 'lib/saleor';

export async function confirmPaypal({ checkoutId }: { checkoutId: string }) {
  try {
    await updateMetaData({
      id: checkoutId,
      key: 'completed_with_paypal',
      value: 'yes',
    });
  } catch (error: any) {
    console.log(error);
  }
}
