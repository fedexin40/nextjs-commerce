'use client';

import { useEffect } from 'react';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

//FACEBOOK INIT
export const FacebookPixelEvents = () => {
  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(FB_PIXEL_ID || '');
        ReactPixel.pageView();
      });
  }, []);

  return null;
};

//CUSTOM EVENTS
export const CompleteRegistration = () => {
  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.track('CompleteRegistration');
      });
  }, []);

  return null;
};

export const ProductView = (parameters: { content_ids: [string]; content_type: string }) => {
  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.track('ViewContent', parameters);
      });
  }, []);

  return null;
};

export const InitiateCheckout = (parameters: {
  content_ids: string[] | undefined;
  content_type: string;
  currency: string;
  value: string;
}) => {
  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.track('InitiateCheckout', parameters);
      });
  }, []);

  return null;
};
