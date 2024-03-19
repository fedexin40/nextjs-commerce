'use server';

import { externalAuthenticationUrl } from 'lib/saleor';
import { redirect } from 'next/navigation';

const shopUrl = process.env.SHOP_PUBLIC_URL;

export const externalAuthenticationGoogle = async (): Promise<string> => {
  const callbackUrl = new URL('api/login/external/google', shopUrl).toString();
  const authenticationUrl = await externalAuthenticationUrl(
    callbackUrl,
    'mirumee.authentication.openidconnect.google',
  );
  const url = JSON.parse(authenticationUrl.url);
  redirect(url.authorizationUrl);
};

export const externalAuthenticationFacebook = async (): Promise<string> => {
  const callbackUrl = new URL('api/login/external/facebook', shopUrl).toString();
  const authenticationUrl = await externalAuthenticationUrl(
    callbackUrl,
    'mirumee.authentication.openidconnect.facebook',
  );
  const url = JSON.parse(authenticationUrl.url);
  redirect(url.authorizationUrl);
};
