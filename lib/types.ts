import { TransactionEventTypeEnum } from './saleor/generated/graphql';

export type Maybe<T> = T | null;

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type shippingMethod = {
  id: string;
  name: string;
  serviceName?: string;
  price: number;
  currency?: string;
  maximumDeliveryDays?: number;
};

export type Cart = Omit<VercelCommerceCart, 'lines'> & {
  lines: CartItem[];
};

export type CartItem = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: Product;
  };
};

export type Collection = VercelCommerceCollection & {
  path: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type Menu = {
  title: string;
  path: string;
  data: string[];
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type Product = Omit<VercelCommerceProduct, 'variants' | 'images'> & {
  variants: ProductVariant[];
  images: Image[];
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
  attributes: {
    name: string | null | undefined;
    valueRequired: boolean;
  }[];
};

export type SEO = {
  title: string;
  description: string;
};

export type transaction = {
  events: {
    type: string;
    createdAt: string;
  }[];
};

export type VercelCommerceCart = {
  id: string;
  token: string;
  updatedAt: string;
  checkoutUrl: string;
  checkoutUrlPayment: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
  chargeStatus: string;
  authorizeStatus: string;
  shippingAddress:
    | {
        city: string | undefined;
        countryArea: string | undefined;
        firstName: string | undefined;
        lastName: string | undefined;
        phone: string | undefined | null;
        postalCode: string | undefined;
        streetAddress1: string | undefined;
        streetAddress2: string | undefined;
      }
    | undefined;
  userEmail?: string;
  lastName?: string;
  firstName?: string;
  transactions?:
    | {
        events: {
          type?: TransactionEventTypeEnum | null;
          createdAt: string;
        }[];
      }[]
    | null;
};

export type VercelCommerceCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
};

export type VercelCommerceProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  category: {
    name: string | undefined;
    slug: string | undefined;
  };
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

export type VercelCommerceCartOperation = {
  data: {
    cart: VercelCommerceCart;
  };
  variables: {
    cartId: string;
  };
};

export type VercelCommerceCreateCartOperation = {
  data: { cartCreate: { cart: VercelCommerceCart } };
};

export type VercelCommerceAddToCartOperation = {
  data: {
    cartLinesAdd: {
      cart: VercelCommerceCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type VercelCommerceRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: VercelCommerceCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type VercelCommerceUpdateCartOperation = {
  data: {
    cartLinesUpdate: {
      cart: VercelCommerceCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type VercelCommerceCollectionOperation = {
  data: {
    collection: VercelCommerceCollection;
  };
  variables: {
    handle: string;
  };
};

export type VercelCommerceCollectionProductsOperation = {
  data: {
    collection: {
      products: Connection<VercelCommerceProduct>;
    };
  };
  variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type VercelCommerceCollectionsOperation = {
  data: {
    collections: Connection<VercelCommerceCollection>;
  };
};

export type VercelCommerceMenuOperation = {
  data: {
    menu?: {
      items: {
        title: string;
        url: string;
      }[];
    };
  };
  variables: {
    handle: string;
  };
};

export type VercelCommercePageOperation = {
  data: { pageByHandle: Page };
  variables: { handle: string };
};

export type VercelCommercePagesOperation = {
  data: {
    pages: Connection<Page>;
  };
};

export type VercelCommerceProductOperation = {
  data: { product: VercelCommerceProduct };
  variables: {
    handle: string;
  };
};

export type VercelCommerceProductRecommendationsOperation = {
  data: {
    productRecommendations: VercelCommerceProduct[];
  };
  variables: {
    productId: string;
  };
};

export type VercelCommerceProductsOperation = {
  data: {
    products: Connection<VercelCommerceProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type Category = {
  name: string;
  slug: string;
  parent: {
    level?: number;
  };
  url: string;
};

export type authenticationUrl = {
  url: string;
};

export type Token = {
  token: string;
  tokenRefresh?: string;
};

export type CurrentPerson = {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  avatar?: {
    alt: string | undefined | null;
    url: string | undefined | null;
  };
  orders?: order[];
  lastCheckout?: string | undefined | null;
  address: {
    id: string;
    city: string;
    cityArea?: string;
    countryArea: string;
    streetAddress2?: string;
    companyName?: string;
    name?: string;
    postalCode: string;
    streetAddress1: string;
    phone: string;
  };
};

export type orderLines = {
  id: string;
  productName: string;
  quantity: number;
  amount: number;
  urlImage: string;
};

export type order = {
  id: string;
  status: string;
  number: string;
  date: string;
  total: number;
  subtotal: number;
  taxes: number;
  shippingMethodName?: string;
  lines: orderLines[];
  shippingPrice: number;
  trackingNumber?: string;
  shippingAddress:
    | {
        city: string | undefined;
        countryArea?: string | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        phone: string | undefined | null;
        postalCode: string | undefined;
        streetAddress1: string | undefined;
        streetAddress2: string | undefined;
      }
    | undefined;
};

export type countryAreaChoices =
  | {
      raw?: string | undefined | null;
      verbose?: string | undefined | null;
    }[]
  | null
  | undefined;

export type CountryCode =
  | 'AD'
  | 'AE'
  | 'AF'
  | 'AG'
  | 'AI'
  | 'AL'
  | 'AM'
  | 'AO'
  | 'AQ'
  | 'AR'
  | 'AS'
  | 'AT'
  | 'AU'
  | 'AW'
  | 'AX'
  | 'AZ'
  | 'BA'
  | 'BB'
  | 'BD'
  | 'BE'
  | 'BF'
  | 'BG'
  | 'BH'
  | 'BI'
  | 'BJ'
  | 'BL'
  | 'BM'
  | 'BN'
  | 'BO'
  | 'BQ'
  | 'BR'
  | 'BS'
  | 'BT'
  | 'BV'
  | 'BW'
  | 'BY'
  | 'BZ'
  | 'CA'
  | 'CC'
  | 'CD'
  | 'CF'
  | 'CG'
  | 'CH'
  | 'CI'
  | 'CK'
  | 'CL'
  | 'CM'
  | 'CN'
  | 'CO'
  | 'CR'
  | 'CU'
  | 'CV'
  | 'CW'
  | 'CX'
  | 'CY'
  | 'CZ'
  | 'DE'
  | 'DJ'
  | 'DK'
  | 'DM'
  | 'DO'
  | 'DZ'
  | 'EC'
  | 'EE'
  | 'EG'
  | 'EH'
  | 'ER'
  | 'ES'
  | 'ET'
  | 'EU'
  | 'FI'
  | 'FJ'
  | 'FK'
  | 'FM'
  | 'FO'
  | 'FR'
  | 'GA'
  | 'GB'
  | 'GD'
  | 'GE'
  | 'GF'
  | 'GG'
  | 'GH'
  | 'GI'
  | 'GL'
  | 'GM'
  | 'GN'
  | 'GP'
  | 'GQ'
  | 'GR'
  | 'GS'
  | 'GT'
  | 'GU'
  | 'GW'
  | 'GY'
  | 'HK'
  | 'HM'
  | 'HN'
  | 'HR'
  | 'HT'
  | 'HU'
  | 'ID'
  | 'IE'
  | 'IL'
  | 'IM'
  | 'IN'
  | 'IO'
  | 'IQ'
  | 'IR'
  | 'IS'
  | 'IT'
  | 'JE'
  | 'JM'
  | 'JO'
  | 'JP'
  | 'KE'
  | 'KG'
  | 'KH'
  | 'KI'
  | 'KM'
  | 'KN'
  | 'KP'
  | 'KR'
  | 'KW'
  | 'KY'
  | 'KZ'
  | 'LA'
  | 'LB'
  | 'LC'
  | 'LI'
  | 'LK'
  | 'LR'
  | 'LS'
  | 'LT'
  | 'LU'
  | 'LV'
  | 'LY'
  | 'MA'
  | 'MC'
  | 'MD'
  | 'ME'
  | 'MF'
  | 'MG'
  | 'MH'
  | 'MK'
  | 'ML'
  | 'MM'
  | 'MN'
  | 'MO'
  | 'MP'
  | 'MQ'
  | 'MR'
  | 'MS'
  | 'MT'
  | 'MU'
  | 'MV'
  | 'MW'
  | 'MX'
  | 'MY'
  | 'MZ'
  | 'NA'
  | 'NC'
  | 'NE'
  | 'NF'
  | 'NG'
  | 'NI'
  | 'NL'
  | 'NO'
  | 'NP'
  | 'NR'
  | 'NU'
  | 'NZ'
  | 'OM'
  | 'PA'
  | 'PE'
  | 'PF'
  | 'PG'
  | 'PH'
  | 'PK'
  | 'PL'
  | 'PM'
  | 'PN'
  | 'PR'
  | 'PS'
  | 'PT'
  | 'PW'
  | 'PY'
  | 'QA'
  | 'RE'
  | 'RO'
  | 'RS'
  | 'RU'
  | 'RW'
  | 'SA'
  | 'SB'
  | 'SC'
  | 'SD'
  | 'SE'
  | 'SG'
  | 'SH'
  | 'SI'
  | 'SJ'
  | 'SK'
  | 'SL'
  | 'SM'
  | 'SN'
  | 'SO'
  | 'SR'
  | 'SS'
  | 'ST'
  | 'SV'
  | 'SX'
  | 'SY'
  | 'SZ'
  | 'TC'
  | 'TD'
  | 'TF'
  | 'TG'
  | 'TH'
  | 'TJ'
  | 'TK'
  | 'TL'
  | 'TM'
  | 'TN'
  | 'TO'
  | 'TR'
  | 'TT'
  | 'TV'
  | 'TW'
  | 'TZ'
  | 'UA'
  | 'UG'
  | 'UM'
  | 'US'
  | 'UY'
  | 'UZ'
  | 'VA'
  | 'VC'
  | 'VE'
  | 'VG'
  | 'VI'
  | 'VN'
  | 'VU'
  | 'WF'
  | 'WS'
  | 'YE'
  | 'YT'
  | 'ZA'
  | 'ZM'
  | 'ZW';
