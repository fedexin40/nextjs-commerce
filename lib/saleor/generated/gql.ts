/* eslint-disable */
import * as types from './graphql';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  'fragment Checkout on Checkout {\n  id\n  token\n  updatedAt\n  totalPrice {\n    gross {\n      currency\n      amount\n    }\n    net {\n      currency\n      amount\n    }\n    tax {\n      currency\n      amount\n    }\n  }\n  subtotalPrice {\n    gross {\n      currency\n      amount\n    }\n    net {\n      currency\n      amount\n    }\n    tax {\n      currency\n      amount\n    }\n  }\n  quantity\n  lines {\n    id\n    quantity\n    variant {\n      ...Variant\n      product {\n        ...ProductDetails\n      }\n    }\n  }\n  chargeStatus\n  authorizeStatus\n  shippingAddress {\n    city\n    countryArea\n    firstName\n    lastName\n    phone\n    postalCode\n    streetAddress1\n    streetAddress2\n  }\n}':
    types.CheckoutFragmentDoc,
  'fragment FeaturedProduct on Product {\n  id\n  slug\n  name\n  isAvailableForPurchase\n  description\n  seoTitle\n  seoDescription\n  pricing {\n    priceRange {\n      start {\n        gross {\n          currency\n          amount\n        }\n      }\n      stop {\n        gross {\n          currency\n          amount\n        }\n      }\n    }\n  }\n  media {\n    url(size: 1080)\n    type\n    alt\n  }\n  collections {\n    name\n  }\n  updatedAt\n  variants {\n    id\n    name\n    pricing {\n      price {\n        gross {\n          currency\n          amount\n        }\n      }\n    }\n  }\n}':
    types.FeaturedProductFragmentDoc,
  'fragment ProductDetails on Product {\n  id\n  slug\n  name\n  isAvailableForPurchase\n  description\n  seoTitle\n  seoDescription\n  category {\n    name\n    slug\n  }\n  pricing {\n    priceRange {\n      start {\n        gross {\n          currency\n          amount\n        }\n      }\n      stop {\n        gross {\n          currency\n          amount\n        }\n      }\n    }\n  }\n  media {\n    url(size: 1080)\n    type\n    alt\n  }\n  collections {\n    name\n  }\n  updatedAt\n  variants {\n    ...Variant\n  }\n}':
    types.ProductDetailsFragmentDoc,
  'fragment Variant on ProductVariant {\n  id\n  name\n  attributes {\n    attribute {\n      slug\n      name\n      choices(first: 100) {\n        edges {\n          node {\n            name\n          }\n        }\n      }\n    }\n    values {\n      name\n    }\n  }\n  pricing {\n    price {\n      gross {\n        currency\n        amount\n      }\n    }\n  }\n}':
    types.VariantFragmentDoc,
  'mutation AccountRegister($email: String!, $password: String!, $redirectUrl: String!) {\n  accountRegister(\n    input: {email: $email, channel: "proyecto705", password: $password, redirectUrl: $redirectUrl}\n  ) {\n    requiresConfirmation\n    errors {\n      code\n      field\n      message\n    }\n  }\n}':
    types.AccountRegisterDocument,
  'mutation accountSetDefaultAddressBilling($id: ID!) {\n  accountSetDefaultAddress(id: $id, type: BILLING) {\n    errors {\n      code\n      field\n      message\n    }\n  }\n}':
    types.AccountSetDefaultAddressBillingDocument,
  'mutation accountSetDefaultAddressShipping($id: ID!) {\n  accountSetDefaultAddress(id: $id, type: SHIPPING) {\n    errors {\n      code\n      field\n      message\n    }\n  }\n}':
    types.AccountSetDefaultAddressShippingDocument,
  'mutation AccountUpdate($input: AccountInput!) {\n  accountUpdate(input: $input) {\n    errors {\n      code\n      message\n      field\n    }\n  }\n}':
    types.AccountUpdateDocument,
  'mutation AddressCreate($input: AddressInput!) {\n  accountAddressCreate(input: $input) {\n    address {\n      id\n    }\n    errors {\n      code\n      message\n      field\n    }\n  }\n}':
    types.AddressCreateDocument,
  'mutation AddressUpdate($id: ID!, $input: AddressInput!) {\n  accountAddressUpdate(id: $id, input: $input) {\n    address {\n      id\n    }\n    errors {\n      code\n      message\n      field\n    }\n  }\n}':
    types.AddressUpdateDocument,
  'mutation CheckoutAddLine($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {\n  checkoutLinesAdd(id: $checkoutId, lines: $lines) {\n    errors {\n      code\n      message\n      field\n    }\n    checkout {\n      ...Checkout\n    }\n  }\n}':
    types.CheckoutAddLineDocument,
  'mutation checkoutBillingAddressUpdate($checkoutId: ID!, $billingAddress: AddressInput!) {\n  checkoutBillingAddressUpdate(\n    checkoutId: $checkoutId\n    billingAddress: $billingAddress\n  ) {\n    errors {\n      code\n      message\n    }\n  }\n}':
    types.CheckoutBillingAddressUpdateDocument,
  'mutation CheckoutComplete($checkoutId: ID!) {\n  checkoutComplete(id: $checkoutId) {\n    order {\n      id\n      errors {\n        field\n        message\n        code\n      }\n    }\n    errors {\n      field\n      message\n      code\n    }\n  }\n}':
    types.CheckoutCompleteDocument,
  'mutation CheckoutCustomerAttach($id: ID!, $customerId: ID!) {\n  checkoutCustomerAttach(id: $id, customerId: $customerId) {\n    errors {\n      message\n      code\n      field\n    }\n  }\n}':
    types.CheckoutCustomerAttachDocument,
  'mutation CheckoutDeleteLine($checkoutId: ID!, $lineIds: [ID!]!) {\n  checkoutLinesDelete(id: $checkoutId, linesIds: $lineIds) {\n    errors {\n      code\n      message\n      field\n    }\n    checkout {\n      ...Checkout\n    }\n  }\n}':
    types.CheckoutDeleteLineDocument,
  'mutation checkoutPostalCodeUpdate($checkoutId: ID!, $PostalCode: String!) {\n  checkoutShippingAddressUpdate(\n    checkoutId: $checkoutId\n    shippingAddress: {postalCode: $PostalCode, country: MX, countryArea: "Pue.", city: "Puebla", streetAddress1: "fds", streetAddress2: "fds"}\n  ) {\n    errors {\n      code\n      message\n      field\n    }\n  }\n}':
    types.CheckoutPostalCodeUpdateDocument,
  'mutation CheckoutAddPromoCode($id: ID!) {\n  checkoutAddPromoCode(promoCode: "free-shipping", id: $id) {\n    errors {\n      code\n      field\n      message\n    }\n    checkout {\n      giftCards {\n        code\n      }\n    }\n  }\n}':
    types.CheckoutAddPromoCodeDocument,
  'mutation checkoutShippingAddressUpdate($checkoutId: ID!, $shippingAddress: AddressInput!) {\n  checkoutShippingAddressUpdate(\n    checkoutId: $checkoutId\n    shippingAddress: $shippingAddress\n  ) {\n    errors {\n      code\n      message\n      field\n    }\n  }\n}':
    types.CheckoutShippingAddressUpdateDocument,
  'mutation CheckoutUpdateLine($checkoutId: ID!, $lines: [CheckoutLineUpdateInput!]!) {\n  checkoutLinesUpdate(id: $checkoutId, lines: $lines) {\n    errors {\n      code\n      message\n      field\n    }\n    checkout {\n      ...Checkout\n    }\n  }\n}':
    types.CheckoutUpdateLineDocument,
  'mutation ConfirmAccount($email: String!, $token: String!) {\n  confirmAccount(email: $email, token: $token) {\n    errors {\n      code\n      field\n      message\n    }\n  }\n}':
    types.ConfirmAccountDocument,
  'mutation CreateCheckout($input: CheckoutCreateInput!) {\n  checkoutCreate(input: $input) {\n    errors {\n      code\n      message\n      field\n    }\n    checkout {\n      ...Checkout\n    }\n  }\n}':
    types.CreateCheckoutDocument,
  'mutation DeliveryMethodUpdate($deliveryMethodId: ID!, $id: ID!) {\n  checkoutDeliveryMethodUpdate(deliveryMethodId: $deliveryMethodId, id: $id) {\n    errors {\n      code\n      message\n    }\n  }\n}':
    types.DeliveryMethodUpdateDocument,
  'mutation externalAuthenticationUrl($pluginId: String!, $input: JSONString!) {\n  externalAuthenticationUrl(pluginId: $pluginId, input: $input) {\n    errors {\n      code\n      message\n    }\n    authenticationData\n  }\n}':
    types.ExternalAuthenticationUrlDocument,
  'mutation externalObtainAccessTokens($pluginId: String!, $input: JSONString!) {\n  externalObtainAccessTokens(input: $input, pluginId: $pluginId) {\n    errors {\n      code\n      message\n    }\n    refreshToken\n    token\n  }\n}':
    types.ExternalObtainAccessTokensDocument,
  'mutation PaymentGatewayInitialize($checkoutId: ID!) {\n  paymentGatewayInitialize(\n    id: $checkoutId\n    amount: 0\n    paymentGateways: [{id: "app.saleor.stripe"}]\n  ) {\n    gatewayConfigs {\n      id\n      data\n      errors {\n        field\n        message\n        code\n      }\n    }\n    errors {\n      field\n      message\n      code\n    }\n  }\n}':
    types.PaymentGatewayInitializeDocument,
  'mutation TransactionInitialize($checkoutId: ID!, $data: JSON) {\n  transactionInitialize(\n    id: $checkoutId\n    paymentGateway: {id: "app.saleor.stripe", data: $data}\n  ) {\n    transaction {\n      id\n    }\n    transactionEvent {\n      id\n    }\n    data\n    errors {\n      field\n      message\n      code\n    }\n  }\n}':
    types.TransactionInitializeDocument,
  'query AddressValidation {\n  addressValidationRules(countryCode: MX) {\n    countryAreaChoices {\n      raw\n      verbose\n    }\n  }\n}':
    types.AddressValidationDocument,
  'query GetCategories {\n  categories(first: 100) {\n    edges {\n      node {\n        slug\n        name\n        parent {\n          level\n        }\n      }\n    }\n  }\n}':
    types.GetCategoriesDocument,
  'query GetCategoryBySlug($slug: String!) {\n  category(slug: $slug) {\n    id\n    name\n    slug\n    description\n    seoTitle\n    seoDescription\n    products(\n      channel: "proyecto705"\n      first: 1\n      sortBy: {field: LAST_MODIFIED_AT, direction: DESC}\n    ) {\n      edges {\n        node {\n          updatedAt\n        }\n      }\n    }\n  }\n}':
    types.GetCategoryBySlugDocument,
  'query GetCategoryProductsBySlug($slug: String!, $sortBy: ProductOrderField!, $sortDirection: OrderDirection!) {\n  category(slug: $slug) {\n    products(\n      channel: "proyecto705"\n      first: 100\n      sortBy: {field: $sortBy, direction: $sortDirection}\n    ) {\n      edges {\n        node {\n          id\n          slug\n          name\n          isAvailableForPurchase\n          description\n          seoTitle\n          seoDescription\n          category {\n            name\n            slug\n          }\n          pricing {\n            priceRange {\n              start {\n                gross {\n                  currency\n                  amount\n                }\n              }\n              stop {\n                gross {\n                  currency\n                  amount\n                }\n              }\n            }\n          }\n          media {\n            url(size: 2160)\n            type\n            alt\n          }\n          collections {\n            name\n          }\n          updatedAt\n          variants {\n            ...Variant\n          }\n        }\n      }\n    }\n  }\n}':
    types.GetCategoryProductsBySlugDocument,
  'query GetCheckoutById($id: ID!) {\n  checkout(id: $id) {\n    ...Checkout\n  }\n}':
    types.GetCheckoutByIdDocument,
  'query GetCollectionBySlug($slug: String!) {\n  collection(channel: "proyecto705", slug: $slug) {\n    id\n    name\n    slug\n    description\n    seoTitle\n    seoDescription\n    products(first: 1, sortBy: {field: LAST_MODIFIED_AT, direction: DESC}) {\n      edges {\n        node {\n          updatedAt\n        }\n      }\n    }\n  }\n}':
    types.GetCollectionBySlugDocument,
  'query GetCollectionProductsBySlug($slug: String!, $sortBy: ProductOrderField!, $sortDirection: OrderDirection!) {\n  collection(channel: "proyecto705", slug: $slug) {\n    products(first: 100, sortBy: {field: $sortBy, direction: $sortDirection}) {\n      edges {\n        node {\n          id\n          slug\n          name\n          isAvailableForPurchase\n          description\n          seoTitle\n          seoDescription\n          category {\n            name\n            slug\n          }\n          pricing {\n            priceRange {\n              start {\n                gross {\n                  currency\n                  amount\n                }\n              }\n              stop {\n                gross {\n                  currency\n                  amount\n                }\n              }\n            }\n          }\n          media {\n            url(size: 2160)\n            type\n            alt\n          }\n          collections {\n            name\n          }\n          updatedAt\n          variants {\n            ...Variant\n          }\n        }\n      }\n    }\n  }\n}':
    types.GetCollectionProductsBySlugDocument,
  'query GetCollections {\n  collections(channel: "proyecto705", first: 100) {\n    edges {\n      node {\n        id\n        name\n        slug\n        description\n        seoTitle\n        seoDescription\n        products(first: 1, sortBy: {field: LAST_MODIFIED_AT, direction: DESC}) {\n          edges {\n            node {\n              updatedAt\n            }\n          }\n        }\n      }\n    }\n  }\n}':
    types.GetCollectionsDocument,
  'query GetFeaturedProducts($first: Int!) {\n  products(first: $first, channel: "proyecto705") {\n    edges {\n      node {\n        ...FeaturedProduct\n      }\n    }\n  }\n}':
    types.GetFeaturedProductsDocument,
  'query GetMe {\n  me {\n    id\n    email\n    firstName\n    lastName\n    avatar {\n      url\n      alt\n    }\n    addresses {\n      id\n      city\n      cityArea\n      countryArea\n      postalCode\n      phone\n      streetAddress1\n      streetAddress2\n      country {\n        code\n        country\n      }\n    }\n    orders(first: 100) {\n      edges {\n        node {\n          id\n          created\n          number\n          statusDisplay\n          total {\n            gross {\n              amount\n            }\n          }\n          lines {\n            id\n            productName\n            quantity\n            totalPrice {\n              gross {\n                amount\n              }\n            }\n            thumbnail {\n              url\n            }\n          }\n        }\n      }\n    }\n    checkoutIds\n  }\n}':
    types.GetMeDocument,
  'fragment MenuItem on MenuItem {\n  id\n  name\n  url\n  collection {\n    slug\n    products(first: 0) {\n      totalCount\n    }\n  }\n  category {\n    slug\n    products(channel: "proyecto705", first: 0) {\n      totalCount\n    }\n  }\n  page {\n    slug\n    content\n  }\n}\n\nquery GetMenuBySlug($slug: String!) {\n  menu(slug: $slug, channel: "proyecto705") {\n    id\n    slug\n    name\n    items {\n      ...MenuItem\n      children {\n        ...MenuItem\n        children {\n          ...MenuItem\n          children {\n            ...MenuItem\n          }\n        }\n      }\n    }\n  }\n}':
    types.MenuItemFragmentDoc,
  'query GetOrderById($id: ID!) {\n  order(id: $id) {\n    id\n    number\n    created\n    origin\n    paymentStatus\n    status\n    statusDisplay\n    lines {\n      id\n      productName\n      quantity\n      quantityFulfilled\n      quantityToFulfill\n      totalPrice {\n        gross {\n          amount\n        }\n      }\n      thumbnail {\n        url\n      }\n    }\n    isPaid\n    isShippingRequired\n    total {\n      gross {\n        amount\n      }\n    }\n  }\n}':
    types.GetOrderByIdDocument,
  'query GetPageBySlug($slug: String!) {\n  page(slug: $slug) {\n    id\n    title\n    slug\n    content\n    seoTitle\n    seoDescription\n    created\n  }\n}':
    types.GetPageBySlugDocument,
  'query GetPages {\n  pages(first: 10) {\n    edges {\n      node {\n        id\n        title\n        slug\n        content\n        seoTitle\n        seoDescription\n        created\n      }\n    }\n  }\n}':
    types.GetPagesDocument,
  'query GetProductBySlug($slug: String!) {\n  product(channel: "proyecto705", slug: $slug) {\n    ...ProductDetails\n  }\n}':
    types.GetProductBySlugDocument,
  'query GetShippingMethods($id: ID!) {\n  checkout(id: $id) {\n    id\n    shippingMethods {\n      description\n      id\n      maximumDeliveryDays\n      name\n      price {\n        amount\n        currency\n      }\n    }\n  }\n}':
    types.GetShippingMethodsDocument,
  'query SearchProducts($search: String!, $sortBy: ProductOrderField!, $sortDirection: OrderDirection!) {\n  products(\n    first: 100\n    channel: "proyecto705"\n    sortBy: {field: $sortBy, direction: $sortDirection}\n    filter: {search: $search}\n  ) {\n    edges {\n      node {\n        id\n        slug\n        name\n        isAvailableForPurchase\n        description\n        seoTitle\n        seoDescription\n        category {\n          name\n          slug\n        }\n        pricing {\n          priceRange {\n            start {\n              gross {\n                currency\n                amount\n              }\n            }\n            stop {\n              gross {\n                currency\n                amount\n              }\n            }\n          }\n        }\n        media {\n          url(size: 2160)\n          type\n          alt\n        }\n        collections {\n          name\n        }\n        updatedAt\n        variants {\n          ...Variant\n        }\n      }\n    }\n  }\n}':
    types.SearchProductsDocument,
  'subscription WebhookSubscription {\n  event {\n    ... on CategoryCreated {\n      __typename\n      category {\n        id\n        slug\n      }\n    }\n    ... on CategoryDeleted {\n      __typename\n      category {\n        id\n        slug\n      }\n    }\n    ... on CategoryUpdated {\n      __typename\n      category {\n        id\n        slug\n      }\n    }\n    ... on CollectionUpdated {\n      __typename\n      collection {\n        id\n        slug\n      }\n    }\n    ... on CollectionDeleted {\n      __typename\n      collection {\n        id\n        slug\n      }\n    }\n    ... on CollectionCreated {\n      __typename\n      collection {\n        id\n        slug\n      }\n    }\n    ... on ProductCreated {\n      __typename\n      product {\n        id\n        slug\n      }\n    }\n    ... on ProductDeleted {\n      __typename\n      product {\n        id\n        slug\n      }\n    }\n    ... on ProductUpdated {\n      __typename\n      product {\n        id\n        slug\n      }\n    }\n    ... on ProductVariantCreated {\n      __typename\n      productVariant {\n        product {\n          id\n          slug\n        }\n      }\n    }\n    ... on ProductVariantDeleted {\n      __typename\n      productVariant {\n        product {\n          id\n          slug\n        }\n      }\n    }\n    ... on ProductVariantUpdated {\n      __typename\n      productVariant {\n        product {\n          id\n          slug\n        }\n      }\n    }\n  }\n}':
    types.WebhookSubscriptionDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment Checkout on Checkout {\n  id\n  token\n  updatedAt\n  totalPrice {\n    gross {\n      currency\n      amount\n    }\n    net {\n      currency\n      amount\n    }\n    tax {\n      currency\n      amount\n    }\n  }\n  subtotalPrice {\n    gross {\n      currency\n      amount\n    }\n    net {\n      currency\n      amount\n    }\n    tax {\n      currency\n      amount\n    }\n  }\n  quantity\n  lines {\n    id\n    quantity\n    variant {\n      ...Variant\n      product {\n        ...ProductDetails\n      }\n    }\n  }\n  chargeStatus\n  authorizeStatus\n  shippingAddress {\n    city\n    countryArea\n    firstName\n    lastName\n    phone\n    postalCode\n    streetAddress1\n    streetAddress2\n  }\n}',
): typeof import('./graphql').CheckoutFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment FeaturedProduct on Product {\n  id\n  slug\n  name\n  isAvailableForPurchase\n  description\n  seoTitle\n  seoDescription\n  pricing {\n    priceRange {\n      start {\n        gross {\n          currency\n          amount\n        }\n      }\n      stop {\n        gross {\n          currency\n          amount\n        }\n      }\n    }\n  }\n  media {\n    url(size: 1080)\n    type\n    alt\n  }\n  collections {\n    name\n  }\n  updatedAt\n  variants {\n    id\n    name\n    pricing {\n      price {\n        gross {\n          currency\n          amount\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').FeaturedProductFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment ProductDetails on Product {\n  id\n  slug\n  name\n  isAvailableForPurchase\n  description\n  seoTitle\n  seoDescription\n  category {\n    name\n    slug\n  }\n  pricing {\n    priceRange {\n      start {\n        gross {\n          currency\n          amount\n        }\n      }\n      stop {\n        gross {\n          currency\n          amount\n        }\n      }\n    }\n  }\n  media {\n    url(size: 1080)\n    type\n    alt\n  }\n  collections {\n    name\n  }\n  updatedAt\n  variants {\n    ...Variant\n  }\n}',
): typeof import('./graphql').ProductDetailsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment Variant on ProductVariant {\n  id\n  name\n  attributes {\n    attribute {\n      slug\n      name\n      choices(first: 100) {\n        edges {\n          node {\n            name\n          }\n        }\n      }\n    }\n    values {\n      name\n    }\n  }\n  pricing {\n    price {\n      gross {\n        currency\n        amount\n      }\n    }\n  }\n}',
): typeof import('./graphql').VariantFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation AccountRegister($email: String!, $password: String!, $redirectUrl: String!) {\n  accountRegister(\n    input: {email: $email, channel: "proyecto705", password: $password, redirectUrl: $redirectUrl}\n  ) {\n    requiresConfirmation\n    errors {\n      code\n      field\n      message\n    }\n  }\n}',
): typeof import('./graphql').AccountRegisterDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation accountSetDefaultAddressBilling($id: ID!) {\n  accountSetDefaultAddress(id: $id, type: BILLING) {\n    errors {\n      code\n      field\n      message\n    }\n  }\n}',
): typeof import('./graphql').AccountSetDefaultAddressBillingDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation accountSetDefaultAddressShipping($id: ID!) {\n  accountSetDefaultAddress(id: $id, type: SHIPPING) {\n    errors {\n      code\n      field\n      message\n    }\n  }\n}',
): typeof import('./graphql').AccountSetDefaultAddressShippingDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation AccountUpdate($input: AccountInput!) {\n  accountUpdate(input: $input) {\n    errors {\n      code\n      message\n      field\n    }\n  }\n}',
): typeof import('./graphql').AccountUpdateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation AddressCreate($input: AddressInput!) {\n  accountAddressCreate(input: $input) {\n    address {\n      id\n    }\n    errors {\n      code\n      message\n      field\n    }\n  }\n}',
): typeof import('./graphql').AddressCreateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation AddressUpdate($id: ID!, $input: AddressInput!) {\n  accountAddressUpdate(id: $id, input: $input) {\n    address {\n      id\n    }\n    errors {\n      code\n      message\n      field\n    }\n  }\n}',
): typeof import('./graphql').AddressUpdateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation CheckoutAddLine($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {\n  checkoutLinesAdd(id: $checkoutId, lines: $lines) {\n    errors {\n      code\n      message\n      field\n    }\n    checkout {\n      ...Checkout\n    }\n  }\n}',
): typeof import('./graphql').CheckoutAddLineDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation checkoutBillingAddressUpdate($checkoutId: ID!, $billingAddress: AddressInput!) {\n  checkoutBillingAddressUpdate(\n    checkoutId: $checkoutId\n    billingAddress: $billingAddress\n  ) {\n    errors {\n      code\n      message\n    }\n  }\n}',
): typeof import('./graphql').CheckoutBillingAddressUpdateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation CheckoutComplete($checkoutId: ID!) {\n  checkoutComplete(id: $checkoutId) {\n    order {\n      id\n      errors {\n        field\n        message\n        code\n      }\n    }\n    errors {\n      field\n      message\n      code\n    }\n  }\n}',
): typeof import('./graphql').CheckoutCompleteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation CheckoutCustomerAttach($id: ID!, $customerId: ID!) {\n  checkoutCustomerAttach(id: $id, customerId: $customerId) {\n    errors {\n      message\n      code\n      field\n    }\n  }\n}',
): typeof import('./graphql').CheckoutCustomerAttachDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation CheckoutDeleteLine($checkoutId: ID!, $lineIds: [ID!]!) {\n  checkoutLinesDelete(id: $checkoutId, linesIds: $lineIds) {\n    errors {\n      code\n      message\n      field\n    }\n    checkout {\n      ...Checkout\n    }\n  }\n}',
): typeof import('./graphql').CheckoutDeleteLineDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation checkoutPostalCodeUpdate($checkoutId: ID!, $PostalCode: String!) {\n  checkoutShippingAddressUpdate(\n    checkoutId: $checkoutId\n    shippingAddress: {postalCode: $PostalCode, country: MX, countryArea: "Pue.", city: "Puebla", streetAddress1: "fds", streetAddress2: "fds"}\n  ) {\n    errors {\n      code\n      message\n      field\n    }\n  }\n}',
): typeof import('./graphql').CheckoutPostalCodeUpdateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation CheckoutAddPromoCode($id: ID!) {\n  checkoutAddPromoCode(promoCode: "free-shipping", id: $id) {\n    errors {\n      code\n      field\n      message\n    }\n    checkout {\n      giftCards {\n        code\n      }\n    }\n  }\n}',
): typeof import('./graphql').CheckoutAddPromoCodeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation checkoutShippingAddressUpdate($checkoutId: ID!, $shippingAddress: AddressInput!) {\n  checkoutShippingAddressUpdate(\n    checkoutId: $checkoutId\n    shippingAddress: $shippingAddress\n  ) {\n    errors {\n      code\n      message\n      field\n    }\n  }\n}',
): typeof import('./graphql').CheckoutShippingAddressUpdateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation CheckoutUpdateLine($checkoutId: ID!, $lines: [CheckoutLineUpdateInput!]!) {\n  checkoutLinesUpdate(id: $checkoutId, lines: $lines) {\n    errors {\n      code\n      message\n      field\n    }\n    checkout {\n      ...Checkout\n    }\n  }\n}',
): typeof import('./graphql').CheckoutUpdateLineDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation ConfirmAccount($email: String!, $token: String!) {\n  confirmAccount(email: $email, token: $token) {\n    errors {\n      code\n      field\n      message\n    }\n  }\n}',
): typeof import('./graphql').ConfirmAccountDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation CreateCheckout($input: CheckoutCreateInput!) {\n  checkoutCreate(input: $input) {\n    errors {\n      code\n      message\n      field\n    }\n    checkout {\n      ...Checkout\n    }\n  }\n}',
): typeof import('./graphql').CreateCheckoutDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation DeliveryMethodUpdate($deliveryMethodId: ID!, $id: ID!) {\n  checkoutDeliveryMethodUpdate(deliveryMethodId: $deliveryMethodId, id: $id) {\n    errors {\n      code\n      message\n    }\n  }\n}',
): typeof import('./graphql').DeliveryMethodUpdateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation externalAuthenticationUrl($pluginId: String!, $input: JSONString!) {\n  externalAuthenticationUrl(pluginId: $pluginId, input: $input) {\n    errors {\n      code\n      message\n    }\n    authenticationData\n  }\n}',
): typeof import('./graphql').ExternalAuthenticationUrlDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation externalObtainAccessTokens($pluginId: String!, $input: JSONString!) {\n  externalObtainAccessTokens(input: $input, pluginId: $pluginId) {\n    errors {\n      code\n      message\n    }\n    refreshToken\n    token\n  }\n}',
): typeof import('./graphql').ExternalObtainAccessTokensDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation PaymentGatewayInitialize($checkoutId: ID!) {\n  paymentGatewayInitialize(\n    id: $checkoutId\n    amount: 0\n    paymentGateways: [{id: "app.saleor.stripe"}]\n  ) {\n    gatewayConfigs {\n      id\n      data\n      errors {\n        field\n        message\n        code\n      }\n    }\n    errors {\n      field\n      message\n      code\n    }\n  }\n}',
): typeof import('./graphql').PaymentGatewayInitializeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation TransactionInitialize($checkoutId: ID!, $data: JSON) {\n  transactionInitialize(\n    id: $checkoutId\n    paymentGateway: {id: "app.saleor.stripe", data: $data}\n  ) {\n    transaction {\n      id\n    }\n    transactionEvent {\n      id\n    }\n    data\n    errors {\n      field\n      message\n      code\n    }\n  }\n}',
): typeof import('./graphql').TransactionInitializeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query AddressValidation {\n  addressValidationRules(countryCode: MX) {\n    countryAreaChoices {\n      raw\n      verbose\n    }\n  }\n}',
): typeof import('./graphql').AddressValidationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetCategories {\n  categories(first: 100) {\n    edges {\n      node {\n        slug\n        name\n        parent {\n          level\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').GetCategoriesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetCategoryBySlug($slug: String!) {\n  category(slug: $slug) {\n    id\n    name\n    slug\n    description\n    seoTitle\n    seoDescription\n    products(\n      channel: "proyecto705"\n      first: 1\n      sortBy: {field: LAST_MODIFIED_AT, direction: DESC}\n    ) {\n      edges {\n        node {\n          updatedAt\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').GetCategoryBySlugDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetCategoryProductsBySlug($slug: String!, $sortBy: ProductOrderField!, $sortDirection: OrderDirection!) {\n  category(slug: $slug) {\n    products(\n      channel: "proyecto705"\n      first: 100\n      sortBy: {field: $sortBy, direction: $sortDirection}\n    ) {\n      edges {\n        node {\n          id\n          slug\n          name\n          isAvailableForPurchase\n          description\n          seoTitle\n          seoDescription\n          category {\n            name\n            slug\n          }\n          pricing {\n            priceRange {\n              start {\n                gross {\n                  currency\n                  amount\n                }\n              }\n              stop {\n                gross {\n                  currency\n                  amount\n                }\n              }\n            }\n          }\n          media {\n            url(size: 2160)\n            type\n            alt\n          }\n          collections {\n            name\n          }\n          updatedAt\n          variants {\n            ...Variant\n          }\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').GetCategoryProductsBySlugDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetCheckoutById($id: ID!) {\n  checkout(id: $id) {\n    ...Checkout\n  }\n}',
): typeof import('./graphql').GetCheckoutByIdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetCollectionBySlug($slug: String!) {\n  collection(channel: "proyecto705", slug: $slug) {\n    id\n    name\n    slug\n    description\n    seoTitle\n    seoDescription\n    products(first: 1, sortBy: {field: LAST_MODIFIED_AT, direction: DESC}) {\n      edges {\n        node {\n          updatedAt\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').GetCollectionBySlugDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetCollectionProductsBySlug($slug: String!, $sortBy: ProductOrderField!, $sortDirection: OrderDirection!) {\n  collection(channel: "proyecto705", slug: $slug) {\n    products(first: 100, sortBy: {field: $sortBy, direction: $sortDirection}) {\n      edges {\n        node {\n          id\n          slug\n          name\n          isAvailableForPurchase\n          description\n          seoTitle\n          seoDescription\n          category {\n            name\n            slug\n          }\n          pricing {\n            priceRange {\n              start {\n                gross {\n                  currency\n                  amount\n                }\n              }\n              stop {\n                gross {\n                  currency\n                  amount\n                }\n              }\n            }\n          }\n          media {\n            url(size: 2160)\n            type\n            alt\n          }\n          collections {\n            name\n          }\n          updatedAt\n          variants {\n            ...Variant\n          }\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').GetCollectionProductsBySlugDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetCollections {\n  collections(channel: "proyecto705", first: 100) {\n    edges {\n      node {\n        id\n        name\n        slug\n        description\n        seoTitle\n        seoDescription\n        products(first: 1, sortBy: {field: LAST_MODIFIED_AT, direction: DESC}) {\n          edges {\n            node {\n              updatedAt\n            }\n          }\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').GetCollectionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetFeaturedProducts($first: Int!) {\n  products(first: $first, channel: "proyecto705") {\n    edges {\n      node {\n        ...FeaturedProduct\n      }\n    }\n  }\n}',
): typeof import('./graphql').GetFeaturedProductsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetMe {\n  me {\n    id\n    email\n    firstName\n    lastName\n    avatar {\n      url\n      alt\n    }\n    addresses {\n      id\n      city\n      cityArea\n      countryArea\n      postalCode\n      phone\n      streetAddress1\n      streetAddress2\n      country {\n        code\n        country\n      }\n    }\n    orders(first: 100) {\n      edges {\n        node {\n          id\n          created\n          number\n          statusDisplay\n          total {\n            gross {\n              amount\n            }\n          }\n          lines {\n            id\n            productName\n            quantity\n            totalPrice {\n              gross {\n                amount\n              }\n            }\n            thumbnail {\n              url\n            }\n          }\n        }\n      }\n    }\n    checkoutIds\n  }\n}',
): typeof import('./graphql').GetMeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment MenuItem on MenuItem {\n  id\n  name\n  url\n  collection {\n    slug\n    products(first: 0) {\n      totalCount\n    }\n  }\n  category {\n    slug\n    products(channel: "proyecto705", first: 0) {\n      totalCount\n    }\n  }\n  page {\n    slug\n    content\n  }\n}\n\nquery GetMenuBySlug($slug: String!) {\n  menu(slug: $slug, channel: "proyecto705") {\n    id\n    slug\n    name\n    items {\n      ...MenuItem\n      children {\n        ...MenuItem\n        children {\n          ...MenuItem\n          children {\n            ...MenuItem\n          }\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').MenuItemFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetOrderById($id: ID!) {\n  order(id: $id) {\n    id\n    number\n    created\n    origin\n    paymentStatus\n    status\n    statusDisplay\n    lines {\n      id\n      productName\n      quantity\n      quantityFulfilled\n      quantityToFulfill\n      totalPrice {\n        gross {\n          amount\n        }\n      }\n      thumbnail {\n        url\n      }\n    }\n    isPaid\n    isShippingRequired\n    total {\n      gross {\n        amount\n      }\n    }\n  }\n}',
): typeof import('./graphql').GetOrderByIdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetPageBySlug($slug: String!) {\n  page(slug: $slug) {\n    id\n    title\n    slug\n    content\n    seoTitle\n    seoDescription\n    created\n  }\n}',
): typeof import('./graphql').GetPageBySlugDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetPages {\n  pages(first: 10) {\n    edges {\n      node {\n        id\n        title\n        slug\n        content\n        seoTitle\n        seoDescription\n        created\n      }\n    }\n  }\n}',
): typeof import('./graphql').GetPagesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetProductBySlug($slug: String!) {\n  product(channel: "proyecto705", slug: $slug) {\n    ...ProductDetails\n  }\n}',
): typeof import('./graphql').GetProductBySlugDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetShippingMethods($id: ID!) {\n  checkout(id: $id) {\n    id\n    shippingMethods {\n      description\n      id\n      maximumDeliveryDays\n      name\n      price {\n        amount\n        currency\n      }\n    }\n  }\n}',
): typeof import('./graphql').GetShippingMethodsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query SearchProducts($search: String!, $sortBy: ProductOrderField!, $sortDirection: OrderDirection!) {\n  products(\n    first: 100\n    channel: "proyecto705"\n    sortBy: {field: $sortBy, direction: $sortDirection}\n    filter: {search: $search}\n  ) {\n    edges {\n      node {\n        id\n        slug\n        name\n        isAvailableForPurchase\n        description\n        seoTitle\n        seoDescription\n        category {\n          name\n          slug\n        }\n        pricing {\n          priceRange {\n            start {\n              gross {\n                currency\n                amount\n              }\n            }\n            stop {\n              gross {\n                currency\n                amount\n              }\n            }\n          }\n        }\n        media {\n          url(size: 2160)\n          type\n          alt\n        }\n        collections {\n          name\n        }\n        updatedAt\n        variants {\n          ...Variant\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').SearchProductsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'subscription WebhookSubscription {\n  event {\n    ... on CategoryCreated {\n      __typename\n      category {\n        id\n        slug\n      }\n    }\n    ... on CategoryDeleted {\n      __typename\n      category {\n        id\n        slug\n      }\n    }\n    ... on CategoryUpdated {\n      __typename\n      category {\n        id\n        slug\n      }\n    }\n    ... on CollectionUpdated {\n      __typename\n      collection {\n        id\n        slug\n      }\n    }\n    ... on CollectionDeleted {\n      __typename\n      collection {\n        id\n        slug\n      }\n    }\n    ... on CollectionCreated {\n      __typename\n      collection {\n        id\n        slug\n      }\n    }\n    ... on ProductCreated {\n      __typename\n      product {\n        id\n        slug\n      }\n    }\n    ... on ProductDeleted {\n      __typename\n      product {\n        id\n        slug\n      }\n    }\n    ... on ProductUpdated {\n      __typename\n      product {\n        id\n        slug\n      }\n    }\n    ... on ProductVariantCreated {\n      __typename\n      productVariant {\n        product {\n          id\n          slug\n        }\n      }\n    }\n    ... on ProductVariantDeleted {\n      __typename\n      productVariant {\n        product {\n          id\n          slug\n        }\n      }\n    }\n    ... on ProductVariantUpdated {\n      __typename\n      productVariant {\n        product {\n          id\n          slug\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').WebhookSubscriptionDocument;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
