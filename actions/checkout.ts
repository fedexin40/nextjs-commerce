'use server';

import {
  billingAddressCheckoutUpdate,
  checkoutAddPromoCode,
  getCart,
  updateDeliveryMethod,
} from 'lib/saleor';
import { CountryCode } from 'lib/saleor/generated/graphql';
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

export async function addressCheckoutUpdate({
  url,
  checkoutId,
  streetAddress1,
  streetAddress2,
  postalCode,
  countryArea,
  city,
}: {
  url: string;
  checkoutId: string;
  streetAddress1: string;
  streetAddress2: string;
  postalCode: string;
  countryArea: string;
  city: string;
}) {
  const input = {
    checkoutId: checkoutId,
    streetAddress1: streetAddress1,
    streetAddress2: streetAddress2,
    postalCode: postalCode,
    countryArea: countryArea,
    city: city,
    country: CountryCode.Mx,
  };

  try {
    await billingAddressCheckoutUpdate(input);
  } catch (error) {
    return error;
  }
  redirect(url);
}
