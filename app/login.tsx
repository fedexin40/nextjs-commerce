import { createSaleorAuthClient } from '@fedexin40/auth-sdk';
import { getNextServerCookiesStorage } from '@fedexin40/auth-sdk/next/server';

const saleorApiUrl = process.env.SALEOR_INSTANCE_URL || '';

export const getServerAuthClient = () => {
  const nextServerCookiesStorage = getNextServerCookiesStorage();
  return createSaleorAuthClient({
    saleorApiUrl,
    refreshTokenStorage: nextServerCookiesStorage,
    accessTokenStorage: nextServerCookiesStorage,
  });
};
