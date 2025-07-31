'use server';

import { getServerAuthClient } from 'app/login';
import { TAGS } from 'lib/constants';
import {
  Me,
  accountUpdate,
  addressCreate,
  addressUpdate,
  passwordReset,
  passwordSet,
  registerAccount,
  updateMetaData,
} from 'lib/saleor';
import { CountryCode } from 'lib/saleor/generated/graphql';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { permanentRedirect } from 'next/navigation';

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
  await (await getServerAuthClient()).signOut();
  const cookieStore = await cookies();

  // clear the session cookies
  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });
  permanentRedirect('/');
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
  const { data } = await (
    await getServerAuthClient()
  ).signIn({ email, password }, { cache: 'no-store' });
  return data;
}

export async function refreshUser() {
  revalidateTag(TAGS.user);
  permanentRedirect('cart/processing');
}

export async function SetupCookie({ name, value }: { name: string; value: string }) {
  const cookieStore = await cookies();
  cookieStore.set(name, value, { httpOnly: true, maxAge: 25920000 });
}

export async function updateExternalId({ id, value }: { id: string; value: string }) {
  await updateMetaData({
    id: id,
    key: 'f_external_id',
    value: value,
  });
  revalidateTag(TAGS.user);
}

export async function resetPassword({ email }: { email: string }) {
  const SHOP_PUBLIC_URL = process.env.SHOP_PUBLIC_URL;
  const url = new URL('password-reset/', SHOP_PUBLIC_URL).toString();
  try {
    await passwordReset(email, url);
  } catch (error: any) {
    return error.toString();
  }
}

export async function setPassword({
  email,
  password,
  token,
}: {
  email: string;
  password: string;
  token: string;
}) {
  try {
    await passwordSet(email, token, password);
  } catch (error: any) {
    return error.toString();
  }
}
