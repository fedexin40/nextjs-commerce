'use server';

import {
  billingAddressCheckoutUpdate,
  checkoutEmailUpdate,
  getShippingMethods,
  shippingAddressCheckoutUpdate,
} from 'lib/saleor';
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
    await billingAddressCheckoutUpdate(input);
  } catch (error: any) {
    return error.message;
  }
}

export async function shippingMethodsAction({ checkoutId }: { checkoutId: string }) {
  // Get the shippingMethods
  let methodsShipping;
  let index = 0;
  while (index < 3) {
    methodsShipping = await getShippingMethods(checkoutId || '');
    if (methodsShipping.length > 0) {
      return methodsShipping;
    }
    index++;
  }
  return methodsShipping;
}

export async function emailCheckoutUpdate({
  checkout,
  email,
}: {
  checkout: string;
  email: string;
}) {
  try {
    await checkoutEmailUpdate(email, checkout);
  } catch (error: any) {
    return error.message;
  }
}
