'use server';

import { TAGS } from 'lib/constants';
import { addressCreate, addressUpdate } from 'lib/saleor';
import { CountryCode } from 'lib/saleor/generated/graphql';
import { revalidateTag } from 'next/cache';

export async function updateAddress({
  id,
  streetAddress1,
  streetAddress2,
  city,
  postalCode,
  countryArea,
}: {
  id: string;
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  postalCode: string;
  countryArea: string;
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
    return 'Error inesperado';
  }
  revalidateTag(TAGS.userAddress);
}

export async function createAddress({
  streetAddress1,
  streetAddress2,
  city,
  postalCode,
  countryArea,
}: {
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  postalCode: string;
  countryArea: string;
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
    return 'Error inesperado';
  }
  revalidateTag(TAGS.userAddress);
}
