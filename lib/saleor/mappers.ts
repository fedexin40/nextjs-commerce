import { Cart, Product } from 'lib/types';
import { parseEditorJsToHtml } from './editorjs';
import { CheckoutFragment, GetProductBySlugQuery, VariantFragment } from './generated/graphql';

export function saleorProductToVercelProduct(
  product: Exclude<GetProductBySlugQuery['product'], null | undefined>,
): Product {
  const images =
    product.media
      ?.filter((media) => media.type === 'IMAGE')
      .map((media) => {
        return {
          url: media.url,
          altText: media.alt || product.seoTitle || product.name,
          width: 2048,
          height: 2048,
        };
      }) || [];
  let featureCollection;
  if (product.collections && product.collections.length > 0) {
    featureCollection = {
      name: product.collections[0]?.name,
      slug: product.collections[0]?.slug,
    };
  } else {
    featureCollection = {
      name: product.category?.name,
      slug: product.category?.slug,
    };
  }

  return {
    id: product.id,
    handle: product.slug,
    availableForSale: product.isAvailableForPurchase || true,
    title: product.name,
    description: product.description || '',
    descriptionHtml: product.description
      ? parseEditorJsToHtml(product.description).replace(/<\/?p[^>]*>/g, '')
      : '',
    options: saleorVariantsToVercelOptions(product.variants),
    category: {
      name: product.category?.name,
      slug: product.category?.slug,
    },
    priceRange: {
      maxVariantPrice: {
        amount: product.pricing?.priceRange?.stop?.gross.amount.toString() || '0',
        currencyCode: product.pricing?.priceRange?.stop?.gross.currency || '',
      },
      minVariantPrice: {
        amount: product.pricing?.priceRange?.start?.gross.amount.toString() || '0',
        currencyCode: product.pricing?.priceRange?.start?.gross.currency || '',
      },
    },
    variants: saleorVariantsToVercelVariants(product.variants, product.isAvailableForPurchase),
    images: images,
    featuredImage: images[0]!,
    seo: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || '',
    },
    tags: product.collections?.map((c) => c.name) || [],
    updatedAt: product.updatedAt,
    collections:
      product.collections?.map((collection) => {
        return {
          name: collection.name,
          slug: collection.slug,
        };
      }) || [],
    featureCollection: featureCollection,
    metadata: product.metadata,
  };
}

export function saleorVariantsToVercelOptions(variants: VariantFragment[] | null | undefined) {
  return (
    variants
      ?.flatMap((variant) => {
        return variant.attributes.flatMap((attribute) => {
          return {
            id: attribute.attribute.slug || '',
            name: attribute.attribute.name || '',
            values:
              attribute.attribute.choices?.edges.map((choice) => choice.node.name || '') || [],
          };
        });
      })
      .filter(
        (value1, idx, arr) =>
          // filter unique
          arr.findIndex((value2) => value1.id === value2.id) === idx,
      ) || []
  );
}

export function saleorVariantsToVercelVariants(
  variants: null | undefined | VariantFragment[],
  isAvailableForPurchase: null | undefined | boolean,
): Product['variants'] {
  return (
    variants?.map((variant) => {
      return {
        id: variant.id,
        title: variant.name,
        availableForSale: isAvailableForPurchase || true,
        selectedOptions: variant.attributes.flatMap((attribute) => {
          return attribute.values.map((value) => {
            return {
              name: attribute.attribute.name || '',
              value: value.name || '',
            };
          });
        }),
        price: {
          amount: variant.pricing?.price?.gross.amount.toString() || '0',
          currencyCode: variant.pricing?.price?.gross.currency || '',
        },
        attributes: variant.attributes.map((attribute) => {
          return {
            name: attribute.values[0]?.name,
            valueRequired: false,
          };
        }),
      };
    }) || []
  );
}

export function saleorCheckoutToVercelCart(checkout: CheckoutFragment): Cart {
  const checkoutUrl = new URL('checkout', process.env.SHOP_PUBLIC_URL || '');
  const checkoutUrlPayment = new URL('checkout-payment', process.env.SHOP_PUBLIC_URL || '');
  checkoutUrl.searchParams.append('checkout', checkout.id);
  checkoutUrlPayment.searchParams.append('checkout', checkout.id);
  const checkoutToken = checkout.token.slice(-5);

  return {
    id: checkout.id,
    token: checkoutToken,
    checkoutUrl: checkoutUrl.toString(),
    checkoutUrlPayment: checkoutUrlPayment.toString(),
    updatedAt: checkout.updatedAt,
    cost: {
      subtotalAmount: {
        amount: checkout.totalPrice.net.amount.toString(),
        currencyCode: checkout.totalPrice.gross.currency,
      },
      totalAmount: {
        amount: checkout.totalPrice.gross.amount.toString(),
        currencyCode: checkout.subtotalPrice.gross.currency,
      },
      totalTaxAmount: {
        amount: checkout.subtotalPrice.tax.amount.toString(),
        currencyCode: checkout.subtotalPrice.tax.currency,
      },
    },
    lines: checkout.lines.map((line) => {
      const title = line.variant.name.trim() === line.variant.id ? '' : line.variant.name.trim();
      return {
        id: line.id,
        quantity: line.quantity,
        cost: {
          totalAmount: {
            amount: line.variant.pricing?.price?.gross.amount.toString() || '0',
            currencyCode: line.variant.pricing?.price?.gross.currency || '',
          },
        },
        merchandise: {
          id: line.variant.id,
          title,
          selectedOptions: line.variant.attributes.flatMap((attribute) => {
            return attribute.values.map((value) => {
              return {
                name: attribute.attribute.name || '',
                value: value.name || '',
              };
            });
          }),
          product: saleorProductToVercelProduct(line.variant.product),
        },
      };
    }),
    totalQuantity: checkout.quantity,
    chargeStatus: checkout.chargeStatus,
    authorizeStatus: checkout.authorizeStatus,
    shippingAddress: {
      city: checkout.shippingAddress?.city,
      countryArea: checkout.shippingAddress?.countryArea,
      firstName: checkout.shippingAddress?.firstName,
      lastName: checkout.shippingAddress?.lastName,
      phone: checkout.shippingAddress?.phone,
      postalCode: checkout.shippingAddress?.postalCode,
      streetAddress1: checkout.shippingAddress?.streetAddress1,
      streetAddress2: checkout.shippingAddress?.streetAddress2,
    },
    userEmail: checkout.user?.email,
    lastName: checkout.user?.lastName,
    firstName: checkout.user?.firstName,
    transactions: checkout.transactions,
    deliveryMethod: checkout.deliveryMethod,
  };
}
