'use server';

import { getServerAuthClient } from 'app/login';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function Logout() {
  await getServerAuthClient().signOut();
  cookies().delete('cartId');
  cookies().delete('token');
  cookies().delete('refreshToken');
  redirect('/');
}
