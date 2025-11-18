import { createSaleorAuthClient } from '@fedexin40/auth-sdk';
import { getNextServerCookiesStorageAsync } from '@fedexin40/auth-sdk/next/server';

const saleorApiUrl = process.env.SALEOR_INSTANCE_URL || '';

export const getServerAuthClient = async () => {
  const nextServerCookiesStorage = await getNextServerCookiesStorageAsync();
  return createSaleorAuthClient({
    saleorApiUrl,
    refreshTokenStorage: nextServerCookiesStorage,
    accessTokenStorage: nextServerCookiesStorage,
  });
};
