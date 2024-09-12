'use server';

import { getServerAuthClient } from 'app/login';
import { TAGS } from 'lib/constants';
import { Me, accountUpdate, addressCreate, addressUpdate, registerAccount } from 'lib/saleor';
import { CountryCode } from 'lib/saleor/generated/graphql';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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
          return 'El código postal no es correcto';
      }
      switch (field) {
        case 'countryArea':
          return 'Debes seleccionar un estado';
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

export async function Logout() {
  await getServerAuthClient().signOut();
  cookies().delete('cartId');
  cookies().delete('token');
  cookies().delete('refreshToken');
  redirect('/');
}

export async function accountRegister({ email, password }: { email: string; password: string }) {
  const SHOP_PUBLIC_URL = process.env.SHOP_PUBLIC_URL;
  const redirectUrl = new URL('account-confirm/', SHOP_PUBLIC_URL).toString();
  try {
    await registerAccount(email, password, redirectUrl);
  } catch (error: any) {
    return error.toString();
  }
}

export async function Login({ email, password }: { email: string; password: string }) {
  const { data } = await getServerAuthClient().signIn({ email, password }, { cache: 'no-store' });
  return data;
}