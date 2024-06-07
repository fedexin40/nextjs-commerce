'use server';

import { getServerAuthClient } from 'app/login';

export async function Login({ email, password }: { email: string; password: string }) {
  const { data } = await getServerAuthClient().signIn({ email, password }, { cache: 'no-store' });
  return data;
}

export async function Logout() {
  await getServerAuthClient().signOut();
}
