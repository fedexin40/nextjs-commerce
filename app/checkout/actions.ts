'use server';
import { billingAddressCheckoutUpdate } from 'lib/saleor';
import { CountryCode } from 'lib/saleor/generated/graphql';
import { redirect } from 'next/navigation';

export async function addressBillingCheckoutUpdate({
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
