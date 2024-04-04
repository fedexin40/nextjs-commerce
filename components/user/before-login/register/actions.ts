'use server';

import { registerAccount } from 'lib/saleor';

export async function accountRegister({ email, password }: { email: string; password: string }) {
  const SHOP_PUBLIC_URL = process.env.SHOP_PUBLIC_URL;
  const redirectUrl = new URL('account-confirm/', SHOP_PUBLIC_URL).toString();
  console.log(email);
  console.log(password);
  console.log(redirectUrl);
  try {
    await registerAccount(email, password, redirectUrl);
  } catch (error: any) {
    return error.toString();
  }
}
