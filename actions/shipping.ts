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
  // Get the shippingMethods
  let methodsShipping;
  let index = 0;
  // No tengo idea exactamente por que
  // pero me parece tiene algo que ver con el timeout de los webhooks
  // Y con que skydropx esta bien menso, a veces envia datos otras veces no
  // Entonces lo que hago solo es repetir la misma llamada tres veces si la primera vez
  // shippingmethods esta vacio
  while (index < 3) {
    methodsShipping = await getShippingMethods(checkoutId || '');
    if (methodsShipping.length > 0) {
      break;
    }
    index++;
  }
  return methodsShipping;
}
