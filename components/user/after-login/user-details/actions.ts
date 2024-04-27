'use server';

import { TAGS } from 'lib/constants';
import { accountUpdate, addressCreate, addressUpdate } from 'lib/saleor';
import { CountryCode } from 'lib/saleor/generated/graphql';
import { revalidateTag } from 'next/cache';

export async function updateAddress({
  id,
  streetAddress1,
  streetAddress2,
  city,
  postalCode,
  countryArea,
  firstName,
  lastName,
}: {
  id: string;
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  postalCode: string;
  countryArea: string;
  firstName: string;
  lastName: string;
}) {
  try {
    await addressUpdate({
      id: id,
      streetAddress1: streetAddress1,
      streetAddress2: streetAddress2,
      postalCode: postalCode,
      countryArea: countryArea,
      city: city,
      country: CountryCode.Mx,
    });
  } catch (error: any) {
    const field: string = error.message;
    switch (field) {
      case 'postalCode':
        return 'El codigo postal no es correcto';
    }
    return 'Algo salio mal pero no sabemos que es';
  }
  await accountUpdate({ firstName, lastName });
  revalidateTag(TAGS.userAddress);
}

export async function createAddress({
  streetAddress1,
  streetAddress2,
  city,
  postalCode,
  countryArea,
  firstName,
  lastName,
}: {
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  postalCode: string;
  countryArea: string;
  firstName: string;
  lastName: string;
}) {
  try {
    await addressCreate({
      streetAddress1: streetAddress1,
      streetAddress2: streetAddress2,
      postalCode: postalCode,
      city: city,
      countryArea: countryArea,
      country: CountryCode.Mx,
    });
  } catch (error: any) {
    const field: string = error.message;
    switch (field) {
      case 'postalCode':
        return 'El codigo postal no es correcto';
    }
    return 'Algo salio mal pero no sabemos que es';
  }
  await accountUpdate({ firstName, lastName });
  revalidateTag(TAGS.userAddress);
}
