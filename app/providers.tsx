'use client';

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { createSaleorAuthClient } from '@saleor/auth-sdk';
import { SaleorAuthProvider, useAuthChange } from '@saleor/auth-sdk/react';

const saleorApiUrl = process.env.SALEOR_INSTANCE_URL || '';

// Saleor Client
const saleorAuthClient = createSaleorAuthClient({ saleorApiUrl });

// Apollo Client
const httpLink = createHttpLink({
  uri: saleorApiUrl,
  fetch: saleorAuthClient.fetchWithAuth
});

export const apolloClient = new ApolloClient({
  ssrMode: true,
  link: httpLink,
  cache: new InMemoryCache()
});

export default function Provider({ children }: { children: any }) {
  useAuthChange({
    saleorApiUrl,
    onSignedOut: () => apolloClient.resetStore(),
    onSignedIn: () => {
      apolloClient.refetchQueries({ include: 'all' });
    }
  });

  return (
    <SaleorAuthProvider client={saleorAuthClient}>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </SaleorAuthProvider>
  );
}
