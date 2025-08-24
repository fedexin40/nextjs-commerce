'use client';

import { SetupCookie, updateExternalId } from 'actions/user';
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
  fbclid: string | string[] | undefined;
  eventName: string;
  eventId: string;
  email: string | null;
  phone: string | null;
  productID: string;
  value: string;
  eventURL: string;
  SHOP_PUBLIC_URL: string;
  f_external_id_cookie: string | undefined | null;
  f_external_id: string;
  f_external_id_me: string | undefined | null;
  current_timestamp: number;
  user_id: string | null;
}) => {
  useEffect(() => {
    const facebook = async () => {
      let fbc = null;
      if (!param.f_external_id_me && !param.f_external_id_cookie && !param.user_id) {
        SetupCookie({
          name: 'f_external_id',
          value: param.f_external_id,
        });
      } else if (!param.f_external_id_me && !param.f_external_id_cookie && param.user_id) {
        updateExternalId({
          id: param.user_id,
          value: param.f_external_id,
        });
        SetupCookie({
          name: 'f_external_id',
          value: param.f_external_id,
        });
      } else if (!param.f_external_id_me && param.f_external_id_cookie && param.user_id) {
        updateExternalId({
          id: param.user_id,
          value: param.f_external_id_cookie,
        });
      } else if (param.f_external_id_me && !param.f_external_id_cookie) {
        SetupCookie({
          name: 'f_external_id',
          value: param.f_external_id_me,
        });
      }

      if (!param.fbc && param.fbclid) {
        fbc = `fb.2.${param.current_timestamp}.${param.fbclid}`;
        SetupCookie({ name: '_fbc', value: fbc });
      }

      const facebookApi = `${param.SHOP_PUBLIC_URL}/api/facebook`;
      await fetch(facebookApi, {
        method: 'POST',
        body: JSON.stringify({
          ip: param.ip,
          userAgent: param.userAgent,
          fbc: param.fbc || fbc,
          fbp: param.fbp,
          eventName: param.eventName,
          eventId: param.eventId,
          email: param.email,
          phone: param.phone,
          productID: param.productID,
          value: param.value,
          eventURL: param.eventURL,
          external_id: param.f_external_id_me || param.f_external_id_cookie || param.f_external_id,
          current_timestamp: param.current_timestamp,
        }),
      });
    };
    facebook();
  }, []);
  return null;
};
