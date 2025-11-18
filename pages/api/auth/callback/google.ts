import { ExternalProvider, SaleorExternalAuth } from '@fedexin40/auth-sdk';
import { createSaleorExternalAuthHandler } from '@fedexin40/auth-sdk/next';
import { invariant } from 'lib/saleor/utils';

const endpoint = process.env.SALEOR_INSTANCE_URL;
invariant(endpoint, `Missing SALEOR_INSTANCE_URL!`);

const externalAuth = new SaleorExternalAuth(endpoint, ExternalProvider.OpenIDConnect);

export default createSaleorExternalAuthHandler(externalAuth);
