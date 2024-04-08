import { createSaleorAuthClient } from '@saleor/auth-sdk';
import { getNextServerCookiesStorage } from '@saleor/auth-sdk/next/server';

const saleorApiUrl = process.env.SALEOR_INSTANCE_URL || '';

export const getServerAuthClient = () => {
  const nextServerCookiesStorage = getNextServerCookiesStorage();
  return createSaleorAuthClient({
    saleorApiUrl,
    refreshTokenStorage: nextServerCookiesStorage,
    accessTokenStorage: nextServerCookiesStorage,
  });
};
