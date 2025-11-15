import { ExternalProvider, SaleorExternalAuth } from '@saleor/auth-sdk';
import { createSaleorExternalAuthHandler } from '@saleor/auth-sdk/next';
import { invariant } from 'lib/saleor/utils';

const endpoint = process.env.SALEOR_INSTANCE_URL;
invariant(endpoint, `Missing SALEOR_INSTANCE_URL!`);

const externalAuth = new SaleorExternalAuth(endpoint, ExternalProvider.OpenIDConnect);

export default createSaleorExternalAuthHandler(externalAuth);
