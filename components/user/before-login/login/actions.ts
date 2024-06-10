'use server';

import { getServerAuthClient } from 'app/login';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function Login({ email, password }: { email: string; password: string }) {
  const { data } = await getServerAuthClient().signIn({ email, password }, { cache: 'no-store' });
  return data;
}

export async function Logout() {
  await getServerAuthClient().signOut();
  cookies().delete('cartId');
  redirect('/');
}
