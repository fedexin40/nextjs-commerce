'use client';

import { sendMetaCapiEvent } from '#/actions/facebook';
import { Product } from '#/lib/types';
import Script from 'next/script';
import { useEffect } from 'react';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export function generateEventId(): string {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function FacebookPixelEvents() {
  if (!FB_PIXEL_ID) return null;
  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
!function(f,b,e,v,n,t,s){
if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)
}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${FB_PIXEL_ID}');
fbq('track','PageView');
        `,
      }}
    />
  );
}

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
    if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
      (window as any).fbq(
        'track',
        'ViewContent',
        {
          content_ids: content_ids,
          content_type: 'product',
          currency: 'MXN',
          value: parameters.value,
        },
        { eventID: event_id },
      );
    } else {
      console.warn('[Pixel] fbq no disponible');
    }

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
    if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
      (window as any).fbq(
        'track',
        'InitiateCheckout',
        {
          content_ids: content_ids,
          content_type: 'product',
          currency: 'MXN',
          value: parameters.value,
        },
        { eventID: event_id },
      );
    } else {
      console.warn('[Pixel] fbq no disponible');
    }
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
