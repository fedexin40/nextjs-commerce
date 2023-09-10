import 'server-only';

import { Cart, Collection, Menu, Page, Product, Token } from 'lib/types';
import {
  AccountRegisterDocument,
  CheckoutAddLineDocument,
  CheckoutDeleteLineDocument,
  CheckoutUpdateLineDocument,
  ConfirmAccountDocument,
  CreateCheckoutDocument,
  ExternalAuthenticationUrlDocument,
  ExternalObtainAccessTokensDocument,
  GetCategoriesDocument,
  GetCategoryBySlugDocument,
  GetCategoryProductsBySlugDocument,
  GetCheckoutByIdDocument,
  GetCollectionBySlugDocument,
  GetCollectionProductsBySlugDocument,
  GetCollectionsDocument,
  GetMenuBySlugDocument,
  GetPageBySlugDocument,
  GetPagesDocument,
  GetProductBySlugDocument,
  GetUserCheckoutDocument,
  MenuItemFragment,
  OrderDirection,
  ProductOrderField,
  SearchProductsDocument,
  TokenCreateDocument,
  TokenRefreshDocument,
  TokenVerifyDocument,
  TypedDocumentString
} from './generated/graphql';
import { saleorCheckoutToVercelCart, saleorProductToVercelProduct } from './mappers';
import { invariant } from './utils';

const endpoint = process.env.SALEOR_INSTANCE_URL;
invariant(endpoint, `Missing SALEOR_INSTANCE_URL!`);

type GraphQlError = {
  message: string;
};
type GraphQlErrorRespone<T> = { data: T } | { errors: readonly GraphQlError[] };

export async function saleorFetch<Result, Variables>({
  query,
  variables,
  headers,
  cache = 'force-cache'
}: {
  query: TypedDocumentString<Result, Variables>;
  variables: Variables;
  headers?: HeadersInit;
  cache?: RequestCache;
}): Promise<Result> {
  invariant(endpoint, `Missing SALEOR_INSTANCE_URL!`);

  const result = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify({
      query: query.toString(),
      ...(variables && { variables })
    }),
    cache: cache
  });

  const body = (await result.json()) as GraphQlErrorRespone<Result>;
  if ('errors' in body) {
    throw body.errors[0];
  }

  return body.data;
}

export async function externalObtainAccessTokens(code: string, state: string): Promise<any> {
  const input = `{"state": "${state}", "code": "${code}" }`;
  const token = await saleorFetch({
    query: ExternalObtainAccessTokensDocument,
    variables: {
      input: input
    },
    cache: 'no-store'
  });
  if (token.externalObtainAccessTokens?.errors[0]) {
    throw token.externalObtainAccessTokens.errors[0]?.code;
  }
  return {
    token: token.externalObtainAccessTokens?.token || '',
    tokenRefresh: token.externalObtainAccessTokens?.refreshToken || ''
  };
}

export async function externalAuthenticationUrl(callback: string): Promise<any> {
  const input = `{"redirectUri": "${callback}" }`;
  const url = await saleorFetch({
    query: ExternalAuthenticationUrlDocument,
    variables: {
      input: input
    },
    cache: 'no-store'
  });
  if (url.externalAuthenticationUrl?.errors[0]) {
    throw url.externalAuthenticationUrl.errors[0]?.code;
  }
  return {
    url: url.externalAuthenticationUrl?.authenticationData || ''
  };
}

export async function tokenRefresh(refreshToken: string): Promise<any> {
  const tokenrefresh = await saleorFetch({
    query: TokenRefreshDocument,
    variables: {
      refreshToken: refreshToken
    },
    cache: 'no-store'
  });
  if (tokenrefresh.tokenRefresh?.errors[0]) {
    throw tokenrefresh.tokenRefresh.errors[0]?.code;
  }
  return {
    token: tokenrefresh.tokenRefresh?.token || ''
  };
}

export async function tokenVerify(token: string): Promise<any> {
  const tokenverify = await saleorFetch({
    query: TokenVerifyDocument,
    variables: {
      token: token
    },
    cache: 'no-store'
  });
  if (tokenverify.tokenVerify?.errors[0]) {
    throw tokenverify.tokenVerify.errors[0]?.code;
  }
  if (tokenverify.tokenVerify?.isValid) {
    return true;
  } else {
    return false;
  }
}

export async function getUsercart(headers?: HeadersInit): Promise<any> {
  const checkout = await saleorFetch({
    query: GetUserCheckoutDocument,
    variables: {},
    headers: headers,
    cache: 'no-store'
  });
  if (checkout.me?.checkouts?.edges[0]?.node?.id) {
    return checkout.me?.checkouts?.edges[0]?.node?.id;
  }
  return false;
}

export async function tokencreate(email: string, password: string): Promise<Token> {
  const token = await saleorFetch({
    query: TokenCreateDocument,
    variables: {
      email: email,
      password: password
    }
  });
  if (token.tokenCreate?.errors[0]) {
    throw token.tokenCreate.errors[0]?.message;
  }
  const accessToken = token.tokenCreate?.token;
  const refreshToken = token.tokenCreate?.refreshToken;

  return {
    token: accessToken || '',
    refreshToken: refreshToken || ''
  };
}

export async function registeraccount(
  email: string,
  password: string,
  redirectUrl: string
): Promise<any> {
  const saleorAccount = await saleorFetch({
    query: AccountRegisterDocument,
    variables: {
      email: email,
      password: password,
      redirectUrl: redirectUrl
    }
  });

  if (saleorAccount.accountRegister?.errors[0]) {
    throw saleorAccount.accountRegister.errors[0]?.message;
  }
}

export async function confirmaccount(email: string, token: string): Promise<any> {
  const confirmAccount = await saleorFetch({
    query: ConfirmAccountDocument,
    variables: {
      email: email,
      token: token
    }
  });

  if (confirmAccount.confirmAccount?.errors) {
    throw confirmAccount.confirmAccount.errors[0]?.message;
  }
}

export async function getCollections(): Promise<Collection[]> {
  const saleorCollections = await saleorFetch({
    query: GetCollectionsDocument,
    variables: {}
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
            description: edge.node.seoDescription || ''
          },
          updatedAt: edge.node.products?.edges?.[0]?.node.updatedAt || '',
          path: `/search/${edge.node.slug}`
        };
      })
      .filter((el) => !el.handle.startsWith(`hidden-`)) ?? []
  );
}

export async function getPage(handle: string): Promise<Page> {
  const saleorPage = await saleorFetch({
    query: GetPageBySlugDocument,
    variables: {
      slug: handle
    }
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
      description: saleorPage.page.seoDescription || ''
    },
    createdAt: saleorPage.page.created,
    updatedAt: saleorPage.page.created
  };
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const saleorProduct = await saleorFetch({
    query: GetProductBySlugDocument,
    variables: {
      slug: handle
    }
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
        slug: handle
      }
    })
  ).collection;
const _getCategory = async (handle: string) =>
  (
    await saleorFetch({
      query: GetCategoryBySlugDocument,
      variables: {
        slug: handle
      }
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
      description: saleorCollection.seoDescription || ''
    },
    updatedAt: saleorCollection.products?.edges?.[0]?.node.updatedAt || '',
    path: `/search/${saleorCollection.slug}`
  };
}

export async function GetCategories(): Promise<any[]> {
  const saleorCategories = await saleorFetch({
    query: GetCategoriesDocument,
    variables: {}
  });

  return (
    saleorCategories.categories?.edges
      .map((edge) => {
        return {
          handle: edge.node.slug,
          title: edge.node.name,
          description: edge.node.description as string,
          seo: {
            title: edge.node.seoTitle || edge.node.name,
            description: edge.node.seoDescription || ''
          },
          path: `/search/${edge.node.slug}`
        };
      })
      .filter((el) => !el.handle.startsWith(`hidden-`)) ?? []
  );
}

const _getCollectionProducts = async ({
  slug,
  reverse,
  sortKey
}: {
  slug: string;
  reverse?: boolean;
  sortKey?: ProductOrderField;
}) =>
  (
    await saleorFetch({
      query: GetCollectionProductsBySlugDocument,
      variables: {
        slug: slug,
        sortBy: sortKey || ProductOrderField.Rank,
        sortDirection: reverse ? OrderDirection.Desc : OrderDirection.Asc
      }
    })
  ).collection;

const _getCategoryProducts = async ({
  slug,
  reverse,
  sortKey
}: {
  slug: string;
  reverse?: boolean;
  sortKey?: ProductOrderField;
}) =>
  (
    await saleorFetch({
      query: GetCategoryProductsBySlugDocument,
      variables: {
        slug: slug,
        sortBy: sortKey || ProductOrderField.Name,
        sortDirection: reverse ? OrderDirection.Desc : OrderDirection.Asc
      }
    })
  ).category;

export async function getMenu(handle: string): Promise<Menu[]> {
  const handleToSlug: Record<string, string> = {
    'next-js-frontend-footer-menu': 'footer',
    'next-js-frontend-header-menu': 'navbar'
  };

  const saleorMenu = await saleorFetch({
    query: GetMenuBySlugDocument,
    variables: {
      slug: handleToSlug[handle] || handle
    }
  });

  if (!saleorMenu.menu) {
    throw new Error(`Menu not found: ${handle}`);
  }

  const result = flattenMenuItems(saleorMenu.menu.items).filter(
    // unique by path
    (item1, idx, arr) => arr.findIndex((item2) => item2.path === item1.path) === idx
  );

  if (handle === 'next-js-frontend-header-menu') {
    // limit number of items in header to 3
    return result.slice(0, 3);
  }
  return result;
}

type MenuItemWithChildren = MenuItemFragment & {
  children?: null | undefined | MenuItemWithChildren[];
};
function flattenMenuItems(menuItems: null | undefined | MenuItemWithChildren[]): Menu[] {
  return (
    menuItems?.flatMap((item) => {
      // Remove empty categories and collections from menu
      if (item.category && !item.category.products?.totalCount) {
        return [];
      }
      if (item.collection && !item.collection.products?.totalCount) {
        return [];
      }

      const path =
        item.url ||
        (item.collection
          ? `/search/${item.collection.slug}`
          : item.category
          ? `/search/${item.category.slug}`
          : '');

      return [
        ...(path
          ? [
              {
                path: path,
                title: item.name
              }
            ]
          : []),
        ...flattenMenuItems(item.children)
      ];
    }) || []
  );
}

export async function getCollectionProducts({
  slug,
  reverse,
  sortKey
}: {
  slug: string;
  reverse?: boolean;
  sortKey?: ProductOrderField;
}): Promise<Product[]> {
  const saleorCollectionProducts =
    (await _getCollectionProducts({ slug, reverse, sortKey })) ||
    (await _getCategoryProducts({ slug, reverse, sortKey }));

  if (!saleorCollectionProducts) {
    throw new Error(`Collection not found: ${slug}`);
  }

  return (
    saleorCollectionProducts.products?.edges.map((product) =>
      saleorProductToVercelProduct(product.node)
    ) || []
  );
}

export async function getProducts({
  query,
  reverse,
  sortKey,
  first
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: ProductOrderField;
  first?: number;
}): Promise<Product[]> {
  const saleorProducts = await saleorFetch({
    query: SearchProductsDocument,
    variables: {
      search: query || '',
      sortBy: sortKey || (query ? ProductOrderField.Rank : ProductOrderField.Rating),
      sortDirection: reverse ? OrderDirection.Desc : OrderDirection.Asc,
      first: first ? first : 100
    }
  });
  return (
    saleorProducts.products?.edges.map((product) => saleorProductToVercelProduct(product.node)) ||
    []
  );
}

export async function getPages(): Promise<Page[]> {
  const saleorPages = await saleorFetch({
    query: GetPagesDocument,
    variables: {}
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
          description: page.node.seoDescription || ''
        },
        createdAt: page.node.created,
        updatedAt: page.node.created
      };
    }) || []
  );
}

export async function getCart(cartId: string, headers?: HeadersInit): Promise<Cart | null> {
  const saleorCheckout = await saleorFetch({
    query: GetCheckoutByIdDocument,
    variables: {
      id: cartId
    },
    headers: headers,
    cache: 'no-store'
  });

  if (!saleorCheckout.checkout) {
    return null;
  }

  return saleorCheckoutToVercelCart(saleorCheckout.checkout);
}

export async function createCart(headers?: HeadersInit): Promise<Cart> {
  const saleorCheckout = await saleorFetch({
    query: CreateCheckoutDocument,
    variables: {
      input: {
        channel: 'default-channel',
        lines: []
      }
    },
    headers: headers,
    cache: 'no-store'
  });

  if (!saleorCheckout.checkoutCreate?.checkout) {
    console.error(saleorCheckout.checkoutCreate?.errors);
    throw new Error(`Couldn't create checkout.`);
  }

  return saleorCheckoutToVercelCart(saleorCheckout.checkoutCreate.checkout);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const saleorCheckout = await saleorFetch({
    query: CheckoutAddLineDocument,
    variables: {
      checkoutId: cartId,
      lines: lines.map(({ merchandiseId, quantity }) => ({ variantId: merchandiseId, quantity }))
    },
    cache: 'no-store'
  });

  if (!saleorCheckout.checkoutLinesAdd?.checkout) {
    console.error(saleorCheckout.checkoutLinesAdd?.errors);
    throw new Error(`Couldn't add lines to checkout.`);
  }

  return saleorCheckoutToVercelCart(saleorCheckout.checkoutLinesAdd.checkout);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const saleorCheckout = await saleorFetch({
    query: CheckoutUpdateLineDocument,
    variables: {
      checkoutId: cartId,
      lines: lines.map(({ id, quantity }) => ({ lineId: id, quantity }))
    },
    cache: 'no-store'
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
      lineIds
    },
    cache: 'no-store'
  });

  if (!saleorCheckout.checkoutLinesDelete?.checkout) {
    console.error(saleorCheckout.checkoutLinesDelete?.errors);
    throw new Error(`Couldn't remove lines from checkout.`);
  }

  return saleorCheckoutToVercelCart(saleorCheckout.checkoutLinesDelete.checkout);
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  // @todo
  return [];
}
