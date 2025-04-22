'use client';

import * as pixel from 'lib/fpixel';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

//FACEBOOK INIT
export const FacebookPixelEvents = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(pixel.FB_PIXEL_ID || '');
        ReactPixel.pageView();
      });
  }, [pathname, searchParams]);

  return null;
};

//CUSTOM EVENTS
export const CompleteRegistration = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.track('CompleteRegistration');
      });
  }, [pathname, searchParams]);

  return null;
};

export const ProductView = (parameters: { content_ids: [string]; content_type: string }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.track('ViewContent', parameters);
      });
  }, [pathname, searchParams]);

  return null;
};

export const Add2Cart = (parameters: {
  content_ids: string[] | undefined;
  content_type: string;
  currency: string;
  value: string;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.track('AddToCart', parameters);
      });
  }, [pathname, searchParams]);

  return null;
};

export const Purchase = (parameters: {
  content_ids: string[] | undefined;
  content_type: string;
  currency: string;
  value: string;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.track('Purchase', parameters);
      });
  }, [pathname, searchParams]);

  return null;
};

export const InitiateCheckout = (parameters: {
  content_ids: string[] | undefined;
  content_type: string;
  currency: string;
  value: string;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.track('InitiateCheckout', parameters);
      });
  }, [pathname, searchParams]);

  return null;
};
