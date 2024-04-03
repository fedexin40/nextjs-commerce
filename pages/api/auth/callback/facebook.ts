import { ExternalProvider, SaleorExternalAuth } from '@fedexin40/auth-sdk';
import { createSaleorExternalAuthHandler } from '@fedexin40/auth-sdk/next';

const externalAuth = new SaleorExternalAuth(
  'https://api.proyecto705.com/graphql/',
  ExternalProvider.OpenIDConnectFacebook,
);

export default createSaleorExternalAuthHandler(externalAuth);
