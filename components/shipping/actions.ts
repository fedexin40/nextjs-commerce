'use server';

import { getShippingMethods, shippingAddressCheckoutUpdate } from 'lib/saleor';
import { CountryCode } from 'lib/saleor/generated/graphql';

export async function shippingAddressUpdate({
  checkoutId,
  streetAddress1,
  streetAddress2,
  city,
  postalCode,
  countryArea,
  firstName,
  lastName,
  phone,
}: {
  checkoutId: string;
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  postalCode: string;
  countryArea: string;
  firstName: string;
  lastName: string;
  phone: string;
}) {
  const input = {
    checkoutId: checkoutId,
    streetAddress1: streetAddress1,
    streetAddress2: streetAddress2,
    city: city,
    postalCode: postalCode,
    countryArea: countryArea,
    country: CountryCode.Mx,
    firstName: firstName,
    lastName: lastName,
    phone: phone,
  };
  try {
    await shippingAddressCheckoutUpdate(input);
  } catch (error: any) {
    return error.message;
  }
}

export async function shippingMethodsAction({ checkoutId }: { checkoutId: string }) {
  // Retry the shippingMethods
  try {
    const methodsShipping = await getShippingMethods(checkoutId || '');
    return methodsShipping;
  } catch (error: any) {
    return error.message;
  }
}
