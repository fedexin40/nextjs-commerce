'use server';

import { TAGS } from 'lib/constants';
import { Me, accountUpdate, addressCreate, addressUpdate } from 'lib/saleor';
import { CountryCode } from 'lib/saleor/generated/graphql';
import { revalidateTag } from 'next/cache';

export async function updateAddress({
  streetAddress1,
  streetAddress2,
  city,
  postalCode,
  countryArea,
  firstName,
  lastName,
  phone,
}: {
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  postalCode: string;
  countryArea: string;
  firstName: string;
  lastName: string;
  phone: string;
}) {
  const user = await Me();
  if (user.address.id) {
    try {
      await addressUpdate({
        id: user.address.id,
        streetAddress1: streetAddress1,
        streetAddress2: streetAddress2,
        postalCode: postalCode,
        countryArea: countryArea,
        city: city,
        country: CountryCode.Mx,
        phone: phone,
      });
    } catch (error: any) {
      const field: string = error.message;
      switch (field) {
        case 'postalCode':
          return 'El codigo postal no es correcto';
      }
      return 'Algo salio mal pero no sabemos que es';
    }
  } else {
    try {
      await addressCreate({
        streetAddress1: streetAddress1,
        streetAddress2: streetAddress2,
        postalCode: postalCode,
        city: city,
        countryArea: countryArea,
        country: CountryCode.Mx,
        phone: phone,
      });
    } catch (error: any) {
      const field: string = error.message;
      switch (field) {
        case 'postalCode':
          return 'El codigo postal no es correcto';
      }
      return 'Algo salio mal pero no sabemos que es';
    }
  }
  await accountUpdate({ firstName, lastName });
  revalidateTag(TAGS.user);
}
