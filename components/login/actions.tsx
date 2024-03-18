'use server';

import { externalAuthenticationUrl } from 'lib/saleor';
import { redirect } from 'next/navigation';

export const externalAuthentication = async (pluginID: string, input: string): Promise<string> => {
  const authenticationUrl = await externalAuthenticationUrl(input, pluginID);
  const url = JSON.parse(authenticationUrl.url);
  redirect(url.authorizationUrl);
};
