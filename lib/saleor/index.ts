'use server';

import { getServerAuthClient } from 'app/login';
import { TAGS } from 'lib/constants';
import { TransactionEventTypeEnum } from 'lib/saleor/generated/graphql';
import {
  Cart,
  Category,
  Collection,
  CurrentPerson,
  Page,
  Product,
  ProductsByPage,
  Token,
  authenticationUrl,
  countryAreaChoices,
  order,
  orderLines,
} from 'lib/types';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  AccountRegisterDocument,
  AccountSetDefaultAddressBillingDocument,
  AccountSetDefaultAddressShippingDocument,
  AccountUpdateDocument,
  AddressCreateDocument,
  AddressUpdateDocument,
  AddressValidationDocument,
  CheckoutAddLineDocument,
  CheckoutAddPromoCodeDocument,
  CheckoutBillingAddressUpdateDocument,
  CheckoutCompleteDocument,
  CheckoutCustomerAttachDocument,
  CheckoutDeleteLineDocument,
  CheckoutShippingAddressUpdateDocument,
  CheckoutUpdateLineDocument,
  ConfirmAccountDocument,
  CountryCode,
  CreateCheckoutDocument,
  DeliveryMethodUpdateDocument,
  ExternalAuthenticationUrlDocument,
  ExternalObtainAccessTokensDocument,
  GetCategoriesDocument,
  GetCategoryBySlugDocument,
  GetCategoryProductsBySlugDocument,
  GetCheckoutByIdDocument,
  GetCollectionBySlugDocument,
  GetCollectionProductsBySlugDocument,
  GetCollectionsDocument,
  GetMeDocument,
  GetMenuBySlugDocument,
  GetOrderByIdDocument,
  GetPageBySlugDocument,
  GetPagesDocument,
  GetProductBySlugDocument,
  GetShippingMethodsDocument,
  OrderDirection,
  PaymentGatewayInitializeDocument,
  ProductOrderField,
  SearchProductsDocument,
  TransactionInitializeDocument,
  TypedDocumentString,
} from './generated/graphql';
import { verifySignature } from './jwks';
import { saleorCheckoutToVercelCart, saleorProductToVercelProduct } from './mappers';
import { invariant } from './utils';

const endpoint = process.env.SALEOR_INSTANCE_URL;
invariant(endpoint, `Missing SALEOR_INSTANCE_URL!`);

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

type GraphQlError = {
  message: string;
};
type GraphQlErrorRespone<T> = { data: T } | { errors: readonly GraphQlError[] };

export async function saleorFetch<Result, Variables>({
  query,
  variables,
  headers,
  cache,
  tags,
  withAuth,
}: {
  query: TypedDocumentString<Result, Variables>;
  variables: Variables;
  headers?: HeadersInit;
  cache?: RequestCache;
  tags?: NextFetchRequestConfig['tags'];
  withAuth?: boolean;
}): Promise<Result> {
  invariant(endpoint, `Missing SALEOR_INSTANCE_URL!`);

  const options = cache ? { cache, next: { tags } } : { next: { revalidate: 120, tags } };

  const input = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({
      query: query.toString(),
      ...(variables && { variables }),
    }),
    ...options,
  };
  const result = withAuth
    ? await getServerAuthClient().fetchWithAuth(endpoint, input)
    : await fetch(endpoint, input);

  const body = (await result.json()) as GraphQlErrorRespone<Result>;

  if ('errors' in body) {
    throw body.errors[0];
  }

  return body.data;
}

export async function getCollections(): Promise<Collection[]> {
  const saleorCollections = await saleorFetch({
    query: GetCollectionsDocument,
    variables: {},
    tags: [TAGS.collections],
  });

  return (
    saleorCollections.collections?.edges
      .map((edge) => {
        return {
          handle: edge.node.slug,
          title: edge.node.name,
          description: edge.node.description as string,
          seo: {
            title: edge.node.seoTitle || edge.node.name,
            description: edge.node.seoDescription || '',
          },
          updatedAt: edge.node.products?.edges?.[0]?.node.updatedAt || '',
          path: `/Colecciones/${edge.node.slug}`,
        };
      })
      .filter((el) => !el.handle.startsWith(`hidden-`)) ?? []
  );
}

export async function getPage(handle: string): Promise<Page> {
  const saleorPage = await saleorFetch({
    query: GetPageBySlugDocument,
    variables: {
      slug: handle,
    },
  });

  if (!saleorPage.page) {
    throw new Error(`Page not found: ${handle}`);
  }

  return {
    id: saleorPage.page.id,
    title: saleorPage.page.title,
    handle: saleorPage.page.slug,
    body: saleorPage.page.content || '',
    bodySummary: saleorPage.page.seoDescription || '',
    seo: {
      title: saleorPage.page.seoTitle || saleorPage.page.title,
      description: saleorPage.page.seoDescription || '',
    },
    createdAt: saleorPage.page.created,
    updatedAt: saleorPage.page.created,
  };
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const saleorProduct = await saleorFetch({
    query: GetProductBySlugDocument,
    variables: {
      slug: handle,
    },
    tags: [TAGS.products],
  });

  if (!saleorProduct.product) {
    throw new Error(`Product not found: ${handle}`);
  }

  return saleorProductToVercelProduct(saleorProduct.product);
}

const _getCollection = async (handle: string) =>
  (
    await saleorFetch({
      query: GetCollectionBySlugDocument,
      variables: {
        slug: handle,
      },
      tags: [TAGS.collections],
    })
  ).collection;
const _getCategory = async (handle: string) =>
  (
    await saleorFetch({
      query: GetCategoryBySlugDocument,
      variables: {
        slug: handle,
      },
      tags: [TAGS.collections],
    })
  ).category;

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const saleorCollection = (await _getCollection(handle)) || (await _getCategory(handle));

  if (!saleorCollection) {
    throw new Error(`Collection not found: ${handle}`);
  }

  return {
    handle: saleorCollection.slug,
    title: saleorCollection.name,
    description: saleorCollection.description as string,
    seo: {
      title: saleorCollection.seoTitle || saleorCollection.name,
      description: saleorCollection.seoDescription || '',
    },
    updatedAt: saleorCollection.products?.edges?.[0]?.node.updatedAt || '',
    path: `/search/${saleorCollection.slug}`,
  };
}

const _getCollectionProducts = async ({
  collection,
  reverse,
  sortKey,
  cursor,
  first,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: ProductOrderField;
  cursor?: string;
  first?: number;
}) =>
  (
    await saleorFetch({
      query: GetCollectionProductsBySlugDocument,
      variables: {
        slug: collection,
        after: cursor || '',
        first: first || 100,
        sortBy:
          sortKey === ProductOrderField.Rank
            ? ProductOrderField.Rating
            : sortKey || ProductOrderField.Rating,
        sortDirection: reverse ? OrderDirection.Desc : OrderDirection.Asc,
      },
      tags: [TAGS.collections, TAGS.products],
    })
  ).collection;
const _getCategoryProducts = async ({
  category,
  reverse,
  sortKey,
  cursor,
  first,
}: {
  category: string;
  reverse?: boolean;
  sortKey?: ProductOrderField;
  cursor?: string;
  first?: number;
}) =>
  (
    await saleorFetch({
      query: GetCategoryProductsBySlugDocument,
      variables: {
        slug: category,
        after: cursor || '',
        first: first || 100,
        sortBy:
          sortKey === ProductOrderField.Rank
            ? ProductOrderField.Rating
            : sortKey || ProductOrderField.Rating,
        sortDirection: reverse ? OrderDirection.Desc : OrderDirection.Asc,
      },
      tags: [TAGS.collections, TAGS.products],
    })
  ).category;

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
  cursor,
  first,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: ProductOrderField;
  cursor?: string;
  first?: number;
}): Promise<ProductsByPage> {
  if (typeof reverse === 'undefined' && typeof sortKey === 'undefined') {
    reverse = true;
    sortKey = ProductOrderField.Name;
  }

  const saleorCollectionProducts =
    (await _getCollectionProducts({
      collection,
      reverse,
      sortKey,
      cursor,
      first,
    })) ||
    (await _getCategoryProducts({
      category: collection,
      reverse,
      sortKey,
      cursor,
      first,
    }));

  if (!saleorCollectionProducts) {
    throw new Error(`Collection not found: ${collection}`);
  }

  const products =
    saleorCollectionProducts.products?.edges.map((product) =>
      saleorProductToVercelProduct(product.node),
    ) || [];
  return {
    totalCount: saleorCollectionProducts.products?.totalCount || 1,
    products: products,
    endCursor: saleorCollectionProducts.products?.pageInfo.endCursor || '',
    startCursor: saleorCollectionProducts.products?.pageInfo.startCursor || '',
    hasNextPage: saleorCollectionProducts.products?.pageInfo.hasNextPage || false,
  };
}

export async function getPagesByMenu(handle: string): Promise<Page[]> {
  const handleToSlug: Record<string, string> = {
    'next-js-frontend-footer-menu': 'footer',
    'next-js-frontend-header-menu': 'navbar',
  };

  const result = await saleorFetch({
    query: GetMenuBySlugDocument,
    variables: {
      slug: handleToSlug[handle] || handle,
    },
  });

  if (!result.menu?.items) {
    throw new Error(`Menu not found: ${handle}`);
  }

  const pages = result.menu?.items?.map((page) => {
    return {
      id: page.page?.id || '',
      title: page.page?.title || '',
      handle: '',
      body: '',
      bodySummary: '',
      createdAt: '',
      updatedAt: '',
      slug: page.page?.slug || '',
    };
  });

  return pages;
}

export async function getProducts({
  query,
  reverse,
  sortKey,
  cursor,
  first,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: ProductOrderField;
  cursor?: string;
  first?: number;
}): Promise<ProductsByPage> {
  const saleorProducts = await saleorFetch({
    query: SearchProductsDocument,
    variables: {
      after: cursor || '',
      first: first || 100,
      search: query || '',
      sortBy: query
        ? sortKey || ProductOrderField.Rank
        : sortKey === ProductOrderField.Rank
        ? ProductOrderField.Rating
        : sortKey || ProductOrderField.Rating,
      sortDirection: reverse ? OrderDirection.Desc : OrderDirection.Asc,
    },
    tags: [TAGS.products],
  });

  return {
    totalCount: saleorProducts.products?.totalCount || 1,
    products:
      saleorProducts.products?.edges.map((product) => saleorProductToVercelProduct(product.node)) ||
      [],
    endCursor: saleorProducts.products?.pageInfo.endCursor || '',
    startCursor: saleorProducts.products?.pageInfo.startCursor || '',
    hasNextPage: saleorProducts.products?.pageInfo.hasNextPage || false,
  };
}

export async function getPages(): Promise<Page[]> {
  const saleorPages = await saleorFetch({
    query: GetPagesDocument,
    variables: {},
  });

  return (
    saleorPages.pages?.edges.map((page) => {
      return {
        id: page.node.id,
        title: page.node.title,
        handle: page.node.slug,
        body: page.node.content || '',
        bodySummary: page.node.seoDescription || '',
        seo: {
          title: page.node.seoTitle || page.node.title,
          description: page.node.seoDescription || '',
        },
        createdAt: page.node.created,
        updatedAt: page.node.created,
      };
    }) || []
  );
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const saleorCheckout = await saleorFetch({
    query: GetCheckoutByIdDocument,
    variables: {
      id: cartId,
    },
    withAuth: true,
    cache: 'no-store',
  });
  if (!saleorCheckout.checkout) {
    return null;
  }
  return saleorCheckoutToVercelCart(saleorCheckout.checkout);
}

export async function createCart(email: string): Promise<Cart> {
  const saleorCheckout = await saleorFetch({
    query: CreateCheckoutDocument,
    variables: {
      input: {
        channel: 'proyecto705',
        lines: [],
        email: email,
      },
    },
    cache: 'no-store',
  });

  if (!saleorCheckout.checkoutCreate?.checkout) {
    console.error(saleorCheckout.checkoutCreate?.errors);
    throw new Error(`Couldn't create checkout.`);
  }

  return saleorCheckoutToVercelCart(saleorCheckout.checkoutCreate.checkout);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const saleorCheckout = await saleorFetch({
    query: CheckoutAddLineDocument,
    variables: {
      checkoutId: cartId,
      lines: lines.map(({ merchandiseId, quantity }) => ({ variantId: merchandiseId, quantity })),
    },
    withAuth: true,
    cache: 'no-store',
  });

  if (!saleorCheckout.checkoutLinesAdd?.checkout) {
    console.log(saleorCheckout.checkoutLinesAdd?.errors);
    throw new Error(saleorCheckout.checkoutLinesAdd?.errors[0]?.code || '');
  }

  return saleorCheckoutToVercelCart(saleorCheckout.checkoutLinesAdd.checkout);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const saleorCheckout = await saleorFetch({
    query: CheckoutUpdateLineDocument,
    variables: {
      checkoutId: cartId,
      lines: lines.map(({ id, quantity }) => ({ lineId: id, quantity })),
    },
    cache: 'no-store',
  });

  if (!saleorCheckout.checkoutLinesUpdate?.checkout) {
    console.error(saleorCheckout.checkoutLinesUpdate?.errors);
    throw new Error(`Couldn't update lines in checkout.`);
  }

  return saleorCheckoutToVercelCart(saleorCheckout.checkoutLinesUpdate.checkout);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const saleorCheckout = await saleorFetch({
    query: CheckoutDeleteLineDocument,
    variables: {
      checkoutId: cartId,
      lineIds,
    },
    cache: 'no-store',
  });

  if (!saleorCheckout.checkoutLinesDelete?.checkout) {
    console.error(saleorCheckout.checkoutLinesDelete?.errors);
    throw new Error(`Couldn't remove lines from checkout.`);
  }

  return saleorCheckoutToVercelCart(saleorCheckout.checkoutLinesDelete.checkout);
}

export async function getCategories(): Promise<Category[]> {
  const SaleorCategories = await saleorFetch({
    query: GetCategoriesDocument,
    variables: {},
  });

  return (
    SaleorCategories.categories?.edges.map((category) => {
      const saleorUrl = new URL(baseUrl!);
      saleorUrl.pathname = '/Colecciones/' + category.node.slug;
      return {
        slug: category.node.slug,
        name: category.node.name,
        parent: {
          level: category.node.parent?.level,
        },
        url: saleorUrl.toString(),
      };
    }) || []
  );
}

export async function externalAuthenticationUrl(
  callback: string,
  plugin: string,
): Promise<authenticationUrl> {
  const input = `{"redirectUri": "${callback}" }`;
  const url = await saleorFetch({
    query: ExternalAuthenticationUrlDocument,
    variables: {
      input: input,
      pluginId: plugin,
    },
    cache: 'no-store',
  });
  if (url.externalAuthenticationUrl?.errors[0]) {
    throw url.externalAuthenticationUrl.errors[0]?.code;
  }
  return {
    url: url.externalAuthenticationUrl?.authenticationData || '',
  };
}

export async function externalObtainAccessTokens(
  code: string,
  state: string,
  pluginId: string,
): Promise<Token> {
  const input = `{"state": "${state}", "code": "${code}" }`;
  const token = await saleorFetch({
    query: ExternalObtainAccessTokensDocument,
    variables: {
      pluginId: pluginId,
      input: input,
    },
    cache: 'no-store',
  });
  if (token.externalObtainAccessTokens?.errors[0]) {
    throw token.externalObtainAccessTokens.errors[0]?.code;
  }
  return {
    token: token.externalObtainAccessTokens?.token || '',
    tokenRefresh: token.externalObtainAccessTokens?.refreshToken || '',
  };
}

export async function confirmAccount(email: string, token: string) {
  const confirmAccount = await saleorFetch({
    query: ConfirmAccountDocument,
    variables: {
      email: email,
      token: token,
    },
  });

  if (confirmAccount.confirmAccount?.errors[0]) {
    throw new Error(confirmAccount.confirmAccount.errors[0]?.message || '');
  }
}

export async function registerAccount(email: string, password: string, redirectUrl: string) {
  const saleorAccount = await saleorFetch({
    query: AccountRegisterDocument,
    variables: {
      email: email,
      password: password,
      redirectUrl: redirectUrl,
    },
  });

  if (saleorAccount.accountRegister?.errors[0]) {
    throw new Error(saleorAccount.accountRegister.errors[0]?.message || '');
  }
}

export async function countryArea(): Promise<countryAreaChoices> {
  const states = await saleorFetch({
    query: AddressValidationDocument,
    variables: {},
  });
  return states.addressValidationRules?.countryAreaChoices;
}

export async function addressUpdate({
  id,
  streetAddress1,
  streetAddress2,
  postalCode,
  countryArea,
  city,
  country,
  phone,
}: {
  id: string;
  streetAddress1: string;
  streetAddress2: string;
  postalCode: string;
  countryArea: string;
  city: string;
  country: CountryCode;
  phone: string;
}) {
  const input = {
    streetAddress1: streetAddress1,
    streetAddress2: streetAddress2,
    postalCode: postalCode,
    countryArea: countryArea,
    city: city,
    country: country,
    phone: phone,
  };
  const errors = await saleorFetch({
    query: AddressUpdateDocument,
    variables: {
      id: id,
      input: input,
    },
    withAuth: true,
    cache: 'no-store',
  });
  if (errors.accountAddressUpdate?.errors[0]) {
    console.log(errors.accountAddressUpdate?.errors[0]);
    throw new Error(errors.accountAddressUpdate?.errors[0]?.field || '');
  }
}

export async function addressCreate({
  streetAddress1,
  streetAddress2,
  postalCode,
  countryArea,
  city,
  country,
  phone,
}: {
  streetAddress1: string;
  streetAddress2: string;
  postalCode: string;
  countryArea: string;
  city: string;
  country: CountryCode;
  phone: string;
}) {
  const input = {
    streetAddress1: streetAddress1,
    streetAddress2: streetAddress2,
    postalCode: postalCode,
    countryArea: countryArea,
    city: city,
    country: country,
    phone: phone,
  };
  const address = await saleorFetch({
    query: AddressCreateDocument,
    variables: { input: input },
    withAuth: true,
    cache: 'no-store',
  });
  if (address.accountAddressCreate?.errors[0]) {
    throw new Error(address.accountAddressCreate?.errors[0]?.field || '');
  }

  const addressId = address.accountAddressCreate?.address?.id;
  const errorsShipping = await saleorFetch({
    query: AccountSetDefaultAddressShippingDocument,
    variables: { id: addressId || '' },
    withAuth: true,
    cache: 'no-store',
  });
  if (errorsShipping.accountSetDefaultAddress?.errors[0]) {
    throw new Error(errorsShipping.accountSetDefaultAddress?.errors[0]?.message || '');
  }

  const errorsBilling = await saleorFetch({
    query: AccountSetDefaultAddressBillingDocument,
    variables: { id: addressId || '' },
    withAuth: true,
    cache: 'no-store',
  });
  if (errorsBilling.accountSetDefaultAddress?.errors[0]) {
    throw new Error(errorsShipping.accountSetDefaultAddress?.errors[0]?.message || '');
  }
}

export async function Me(): Promise<CurrentPerson> {
  const CurrentPerson = await saleorFetch({
    query: GetMeDocument,
    variables: {},
    withAuth: true,
    cache: 'no-store',
    tags: [TAGS.user],
  });

  const orders: order[] = [];
  CurrentPerson.me?.orders?.edges.forEach((item) => {
    // Read all the lines in the order
    const items: orderLines[] = [];
    item.node.lines.forEach((itemLine) => {
      const line = {
        id: itemLine.id,
        productName: itemLine.productName,
        quantity: itemLine.quantity,
        amount: itemLine.totalPrice.gross.amount,
        urlImage: itemLine.thumbnail?.url || '',
      };
      items.push(line);
    });

    // Add the orders
    const order = {
      id: item.node.id,
      status: item.node.statusDisplay,
      number: item.node.number,
      date: item.node.updatedAt,
      total: item.node.total.gross.amount,
      subtotal: item.node.subtotal.net.amount,
      taxes: item.node.subtotal.tax.amount,
      lines: items,
      shippingMethodName: item.node.shippingMethodName || '',
      shippingPrice: item.node.shippingPrice.gross.amount,
      trackingNumber: item.node.fulfillments[0]?.trackingNumber,
      shippingAddress: {
        city: item.node.shippingAddress?.city,
        phone: item.node.shippingAddress?.phone,
        postalCode: item.node.shippingAddress?.postalCode,
        streetAddress1: item.node.shippingAddress?.streetAddress1,
        streetAddress2: item.node.shippingAddress?.streetAddress2,
      },
    };
    orders.push(order);
  });

  // When the checkout is waiting for payment
  // we can consider it as an order waiting for payment
  // that's why I am reading the checkouts
  // but filtering by transactions
  const checkouts: order[] = [];
  CurrentPerson.me?.checkouts?.edges.forEach((item) => {
    let is_checkout_waiting_payment;
    is_checkout_waiting_payment = false;
    // Read all the lines in the order
    const items: orderLines[] = [];
    if (!item.node.transactions) {
      return;
    }
    for (
      var index_transaction = 0;
      index_transaction < (item.node.transactions?.length || 0);
      index_transaction++
    ) {
      let charge_action_required_count: number;
      charge_action_required_count = 0;
      for (
        var index_event = 0;
        index_event < (item.node.transactions[index_transaction]?.events.length || 0);
        index_event++
      )
        if (
          item.node.transactions[index_transaction]?.events[index_event]?.type ==
          TransactionEventTypeEnum.ChargeActionRequired
        ) {
          charge_action_required_count += 1;
          // The number of charge_action_required_count events on the same
          // transaction is equal to 2 this means that the checkout is waiting for payment
          if (charge_action_required_count == 1) {
            is_checkout_waiting_payment = true;
          }
        }
    }
    if (is_checkout_waiting_payment == true) {
      item.node.lines.forEach((itemLine) => {
        const line = {
          id: itemLine.id,
          productName: itemLine.variant.product.name,
          quantity: itemLine.quantity,
          amount: itemLine.totalPrice.gross.amount,
          urlImage: itemLine.variant?.product.thumbnail?.url || '',
        };
        items.push(line);
        // Add the checkouts
        const checkout = {
          id: item.node.id,
          status: 'N/A',
          number: 'N/A',
          date: item.node.created,
          total: item.node.totalPrice.gross.amount,
          subtotal: item.node.totalPrice.net.amount,
          taxes: item.node.totalPrice.tax.amount,
          lines: items,
          shippingPrice: item.node.shippingPrice.gross.amount,
          shippingAddress: {
            city: item.node.shippingAddress?.city,
            phone: item.node.shippingAddress?.phone,
            postalCode: item.node.shippingAddress?.postalCode,
            streetAddress1: item.node.shippingAddress?.streetAddress1,
            streetAddress2: item.node.shippingAddress?.streetAddress2,
          },
        };
        checkouts.push(checkout);
      });
    }
  });

  const orders_and_checkouts = [...orders, ...checkouts];

  return {
    id: CurrentPerson.me?.id || '',
    email: CurrentPerson.me?.email || '',
    firstName: CurrentPerson.me?.firstName || '',
    lastName: CurrentPerson.me?.lastName || '',
    avatar: {
      alt: CurrentPerson.me?.avatar?.alt,
      url: CurrentPerson.me?.avatar?.url,
    },
    address: {
      id: CurrentPerson.me?.addresses[0]?.id || '',
      city: CurrentPerson.me?.addresses[0]?.city || '',
      countryArea: CurrentPerson.me?.addresses[0]?.countryArea || '',
      postalCode: CurrentPerson.me?.addresses[0]?.postalCode || '',
      streetAddress1: CurrentPerson.me?.addresses[0]?.streetAddress1 || '',
      streetAddress2: CurrentPerson.me?.addresses[0]?.streetAddress2 || '',
      phone: CurrentPerson.me?.addresses[0]?.phone || '',
    },
    orders: orders_and_checkouts,
    lastCheckout: CurrentPerson.me?.checkoutIds ? CurrentPerson.me?.checkoutIds[0] : '',
  };
}

export async function accountUpdate({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const input = {
    firstName: firstName,
    lastName: lastName,
  };
  const errors = await saleorFetch({
    query: AccountUpdateDocument,
    variables: { input: input },
    withAuth: true,
    cache: 'no-store',
    tags: [TAGS.user],
  });

  if (errors.accountUpdate?.errors[0]) {
    throw new Error(errors.accountUpdate?.errors[0]?.message || '');
  }
}

// TODO: Add the type for the return value
export async function transactionInitialize({
  checkoutId,
  userId,
}: {
  checkoutId: string;
  userId: string;
}) {
  const transaction = await saleorFetch({
    query: TransactionInitializeDocument,
    variables: {
      checkoutId: checkoutId,
      data: {
        automatic_payment_methods: {
          enabled: false,
        },
        customer: userId,
        payment_method_options: {
          card: {
            installments: {
              enabled: true,
            },
          },
        },
        payment_method_types: ['card', 'oxxo', 'customer_balance', 'link'],
      },
    },
    withAuth: true,
    cache: 'no-store',
  });
  if (transaction.transactionInitialize?.errors[0]) {
    throw new Error(transaction.transactionInitialize.errors[0].message || '');
  }
  return transaction;
}

// TODO: Add the type for the return value
export async function gatewayPayment(checkoutId: string) {
  const paymentGateway = await saleorFetch({
    query: PaymentGatewayInitializeDocument,
    variables: {
      checkoutId: checkoutId,
    },
  });
  return paymentGateway;
}

// TODO: Add the type for the return value
export async function completeCheckout({ checkoutId }: { checkoutId: string }) {
  const checkout = await saleorFetch({
    query: CheckoutCompleteDocument,
    variables: {
      checkoutId: checkoutId,
    },
  });
  if (checkout.checkoutComplete?.errors[0]) {
    throw new Error(checkout.checkoutComplete.errors[0].message || '');
  }
  return checkout;
}

export async function billingAddressCheckoutUpdate({
  checkoutId,
  streetAddress1,
  streetAddress2,
  postalCode,
  countryArea,
  city,
  country,
}: {
  checkoutId: string;
  streetAddress1: string;
  streetAddress2: string;
  postalCode: string;
  countryArea: string;
  city: string;
  country?: CountryCode;
}) {
  const billingAddress = {
    streetAddress1: streetAddress1,
    streetAddress2: streetAddress2,
    postalCode: postalCode,
    countryArea: countryArea,
    city: city,
    country: country || CountryCode.Mx,
  };
  const checkout = await saleorFetch({
    query: CheckoutBillingAddressUpdateDocument,
    variables: {
      checkoutId: checkoutId,
      billingAddress: billingAddress,
    },
  });
  if (checkout.checkoutBillingAddressUpdate?.errors[0]) {
    throw new Error(checkout.checkoutBillingAddressUpdate?.errors[0].message || '');
  }
}

export async function shippingAddressCheckoutUpdate({
  checkoutId,
  streetAddress1,
  streetAddress2,
  postalCode,
  countryArea,
  city,
  country,
  firstName,
  lastName,
  phone,
}: {
  checkoutId: string;
  streetAddress1: string;
  streetAddress2: string;
  postalCode: string;
  countryArea: string;
  city: string;
  country: CountryCode;
  firstName: string;
  lastName: string;
  phone: string;
}) {
  const shippingAddress = {
    streetAddress1: streetAddress1,
    streetAddress2: streetAddress2,
    postalCode: postalCode,
    countryArea: countryArea,
    city: city,
    country: country,
    firstName: firstName,
    lastName: lastName,
    phone: phone,
  };
  const checkout = await saleorFetch({
    query: CheckoutShippingAddressUpdateDocument,
    variables: {
      checkoutId: checkoutId,
      shippingAddress: shippingAddress,
    },
    withAuth: true,
    cache: 'no-store',
  });
  if (checkout.checkoutShippingAddressUpdate?.errors[0]) {
    throw new Error(
      `${checkout.checkoutShippingAddressUpdate?.errors[0].message} - ${checkout.checkoutShippingAddressUpdate?.errors[0].field}`,
    );
  }
}

export async function GetOrderById(id: string): Promise<order> {
  const orderbyID = await saleorFetch({
    query: GetOrderByIdDocument,
    variables: {
      id: id,
    },
  });
  const lines: orderLines[] = [];
  orderbyID.order?.lines.forEach((line) =>
    lines.push({
      id: line.id,
      productName: line.productName,
      quantity: line.quantity,
      amount: line.totalPrice.gross.amount,
      urlImage: line.thumbnail?.url || '',
    }),
  );
  return {
    status: orderbyID.order?.status || '',
    number: orderbyID.order?.number || '',
    date: orderbyID.order?.created || '',
    total: orderbyID.order?.total.gross.amount || 0,
    subtotal: orderbyID.order?.subtotal.net.amount || 0,
    taxes: orderbyID.order?.subtotal.tax.amount || 0,
    shippingMethodName: orderbyID.order?.shippingMethodName || '',
    shippingPrice: orderbyID.order?.shippingPrice.gross.amount || 0,
    lines: lines,
    id: orderbyID.order?.id || '',
    shippingAddress: {
      city: orderbyID.order?.shippingAddress?.city,
      phone: orderbyID.order?.shippingAddress?.phone,
      postalCode: orderbyID.order?.shippingAddress?.postalCode,
      streetAddress1: orderbyID.order?.shippingAddress?.streetAddress1,
      streetAddress2: orderbyID.order?.shippingAddress?.streetAddress2,
    },
  };
}

// eslint-disable-next-line no-unused-vars
export async function getProductRecommendations(productId: Product): Promise<Product[]> {
  // @todo
  // tags: [TAGS.products],
  return [];
}

export async function getCheckoutFromCookiesOrRedirect(): Promise<string> {
  const checkoutId = cookies().get('cartId')?.value;
  return checkoutId || '';
}

export async function getShippingMethods(checkoutId: string): Promise<any> {
  const checkout = await saleorFetch({
    query: GetShippingMethodsDocument,
    variables: {
      id: checkoutId,
    },
    cache: 'no-store',
    withAuth: true,
  });

  const shippingMethods = checkout.checkout?.shippingMethods.map((shippingMethod) => {
    return {
      id: shippingMethod.id,
      name: shippingMethod.name.split('.')[1] || '',
      serviceName: shippingMethod.name.split('.')[0] || '',
      price: shippingMethod.price.amount,
      currency: shippingMethod.price.currency,
      maximumDeliveryDays: shippingMethod.maximumDeliveryDays || 0,
    };
  });
  return shippingMethods;
}

export async function updateDeliveryMethod({
  checkoutId,
  deliveryMethodId,
}: {
  checkoutId: string;
  deliveryMethodId: string;
}) {
  const checkout = await saleorFetch({
    query: DeliveryMethodUpdateDocument,
    variables: {
      id: checkoutId,
      deliveryMethodId: deliveryMethodId,
    },
  });
  if (checkout.checkoutDeliveryMethodUpdate?.errors[0]) {
    throw new Error(checkout.checkoutDeliveryMethodUpdate?.errors[0]?.message || '');
  }
}

export async function customerCheckoutAttach({
  checkoutId,
  customerId,
}: {
  checkoutId: string;
  customerId: string;
}) {
  const checkout = await saleorFetch({
    query: CheckoutCustomerAttachDocument,
    variables: {
      id: checkoutId,
      customerId: customerId,
    },
    withAuth: true,
    cache: 'no-store',
  });
  if (checkout.checkoutCustomerAttach?.errors[0]) {
    throw new Error(checkout.checkoutCustomerAttach?.errors[0]?.message || '');
  }
}

export async function checkoutAddPromoCode({ checkoutId }: { checkoutId: string }) {
  const checkout = await saleorFetch({
    query: CheckoutAddPromoCodeDocument,
    variables: {
      id: checkoutId,
    },
    cache: 'no-store',
  });
  if (checkout.checkoutAddPromoCode?.errors[0]) {
    throw new Error(checkout.checkoutAddPromoCode?.errors[0]?.message || '');
  }
}

// eslint-disable-next-line no-unused-vars
export async function revalidate(req: NextRequest): Promise<Response> {
  const json = await verifySignature(req, endpoint!);
  console.log(json);
  if (!json || !('__typename' in json)) {
    return NextResponse.json({ status: 204 });
  }

  switch (json.__typename) {
    case 'CategoryCreated':
    case 'CategoryUpdated':
    case 'CategoryDeleted':
    case 'CollectionCreated':
    case 'CollectionUpdated':
    case 'CollectionDeleted':
      console.log(`revalidateTag(TAGS.collections)`);
      revalidateTag(TAGS.collections);
      break;
    case 'ProductVariantCreated':
    case 'ProductVariantUpdated':
    case 'ProductVariantDeleted':
    case 'ProductCreated':
    case 'ProductUpdated':
    case 'ProductDeleted':
      console.log(`revalidateTag(TAGS.products)`);
      revalidateTag(TAGS.products);
      break;
  }
  console.log('Done revalidating');
  return NextResponse.json({ status: 204 });
}
