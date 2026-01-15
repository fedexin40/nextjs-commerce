'use client';

import { sendMetaCapiEvent } from '#/actions/facebook';
import { Product } from '#/lib/types';
import crypto from 'crypto';
import { useEffect } from 'react';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

type ProductItem = {
  handle: string;
  quantity: number;
};

export function generateEventId(): string {
  return crypto.randomBytes(5).toString('hex'); // 10 chars
}

//FACEBOOK INIT
export const FacebookPixelEvents = () => {
  useEffect(() => {
    import('@bettercart/react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(FB_PIXEL_ID || '');
        ReactPixel.pageView();
      });
  }, []);

  return null;
};

export const ProductView = (parameters: {
  value: string;
  email: string;
  phone: string;
  product: Product;
  fbclid: string | string[] | undefined;
}) => {
  const date = Date.now();
  const current_timestamp = Math.floor(date / 1000);
  const event_id = `${generateEventId()}_ViewContent_${current_timestamp}`;
  const content_ids = [parameters.product.handle];
  useEffect(() => {
    import('@bettercart/react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.track(
          'ViewContent',
          {
            content_ids: content_ids,
            content_type: 'product',
            currency: 'MXN',
            value: parameters.value,
          },
          { eventID: event_id },
        );
      });
    // Server Action → CAPI
    const run = async () => {
      const products = {
        handle: parameters.product.handle,
        quantity: 1,
      };
      await sendMetaCapiEvent({
        event_name: 'ViewContent',
        fbclid: parameters.fbclid,
        value: parameters.value,
        event_id: event_id,
        email: parameters.email,
        phone: parameters.phone,
        current_timestamp: current_timestamp,
        current_timestamp_miliseconds: date,
        products: [products],
      });
    };
    run();
  }, []);
  return null;
};

export const InitiateCheckout = (parameters: {
  value: string;
  email: string | undefined;
  phone: string | undefined;
  products: Product[];
  fbclid: string | string[] | undefined;
}) => {
  const date = Date.now();
  const current_timestamp = Math.floor(date / 1000);
  const event_id = `${generateEventId()}_InitiateCheckout_${current_timestamp}`;
  const content_ids = parameters.products.map((product) => product.handle);
  useEffect(() => {
    import('@bettercart/react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.track(
          'InitiateCheckout',
          {
            content_ids: content_ids,
            content_type: 'product',
            currency: 'MXN',
            value: parameters.value,
          },
          { eventID: event_id },
        );
      });
    // Server Action → CAPI
    const run = async () => {
      const products = parameters.products.map((product) => {
        return {
          handle: product.handle,
          quantity: 1,
        };
      });
      await sendMetaCapiEvent({
        event_name: 'InitiateCheckout',
        fbclid: parameters.fbclid,
        value: parameters.value,
        event_id: event_id,
        email: parameters.email,
        phone: parameters.phone,
        current_timestamp: current_timestamp,
        current_timestamp_miliseconds: date,
        products: products,
      });
    };
    run();
  }, []);
  return null;
};
