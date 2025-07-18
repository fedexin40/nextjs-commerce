'use client';

import { SetupCookie } from 'actions/user';
import { useEffect } from 'react';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

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

//CUSTOM EVENTS
export const CompleteRegistration = () => {
  useEffect(() => {
    import('@bettercart/react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.track('CompleteRegistration');
      });
  }, []);

  return null;
};

export const ProductView = (parameters: {
  content_ids: [string];
  event_id: string;
  value: string;
}) => {
  useEffect(() => {
    import('@bettercart/react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.track(
          'ViewContent',
          {
            content_ids: parameters.content_ids,
            content_type: 'product',
            currency: 'MXN',
            value: parameters.value,
          },
          { eventID: parameters.event_id },
        );
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
    import('@bettercart/react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.track('InitiateCheckout', parameters);
      });
  }, []);
  return null;
};

export const FacebookConversionApi = (param: {
  ip: string | undefined;
  userAgent: string | null;
  fbc: string | undefined;
  fbp: string | undefined;
  eventName: string;
  eventId: string;
  email: string | null;
  phone: string | null;
  productID: string;
  value: string;
  eventURL: string;
  updateCookie: boolean;
  SHOP_PUBLIC_URL: string;
}) => {
  useEffect(() => {
    const facebook = async () => {
      const facebookApi = `${param.SHOP_PUBLIC_URL}/api/facebook`;
      await fetch(facebookApi, {
        method: 'POST',
        body: JSON.stringify({
          ip: param.ip,
          userAgent: param.userAgent,
          fbc: param.fbc,
          fbp: param.fbp,
          eventName: param.eventName,
          eventId: param.eventId,
          email: param.email,
          phone: param.phone,
          productID: param.productID,
          value: param.value,
          eventURL: param.eventURL,
        }),
      });
    };
    if (param.updateCookie && param.fbc) {
      SetupCookie({ name: '_fbc', value: param.fbc });
    }
    facebook();
  }, []);
  return null;
};
