'use server';
import { Me, updateMetaData } from '#/lib/saleor';
import { Cart } from '#/lib/types';
import { cookies, headers } from 'next/headers';

type ProductItem = {
  handle: string;
  quantity: number;
};

export const sendMetaCapiEvent = async ({
  fbclid,
  event_name,
  value,
  event_id,
  email,
  phone,
  current_timestamp,
  current_timestamp_miliseconds,
  products,
}: {
  fbclid: string | string[] | undefined;
  event_name: string;
  value: string;
  event_id: string;
  email: string | undefined;
  phone: string | undefined;
  current_timestamp: number;
  current_timestamp_miliseconds: number;
  products: ProductItem[];
}) => {
  const baseUrl = process.env.SHOP_PUBLIC_URL;
  const user = await Me();
  const headersList = await headers();
  const cookieStore = await cookies();
  const xForwardedFor = headersList.get('x-forwarded-for');
  const remoteAddress = headersList.get('remoteAddress');
  const userAgent = headersList.get('user-agent');
  const pathname = headersList.get('x-current-path');
  const fbp = cookieStore.get('_fbp')?.value;
  const f_external_id_me = user.f_external_id;
  const f_external_id_cookie = cookieStore.get('f_external_id')?.value;
  const f_external_id = Math.random().toString(36).substring(2);
  let fbc = cookieStore.get('_fbc')?.value;
  const eventURL = `${baseUrl}/${pathname}`;

  let ip;
  if (xForwardedFor && xForwardedFor.split(',')[0]) {
    // If x-forwarded-for is present, take the first IP address
    ip = xForwardedFor.split(',')[0]?.trim();
  } else if (remoteAddress) {
    // If x-forwarded-for is not present, use remoteAddress
    ip = remoteAddress;
  } else {
    ip = 'unknown'; // Handle cases where no IP is available
  }

  if (!f_external_id_me && !f_external_id_cookie) {
    cookieStore.set('f_external_id', f_external_id, { httpOnly: true, maxAge: 25920000 });
    if (user.id) {
      await updateMetaData({
        id: user.id,
        key: 'f_external_id',
        value: f_external_id,
      });
    }
  } else if (f_external_id_me && !f_external_id_cookie) {
    cookieStore.set('f_external_id', f_external_id_me, { httpOnly: true, maxAge: 25920000 });
  }

  if (!fbc && fbclid) {
    fbc = `fb.2.${current_timestamp_miliseconds}.${fbclid}`;
    cookieStore.set('_fbc', fbc, { httpOnly: true, maxAge: 25920000 });
  }

  const facebookApi = `${baseUrl}/api/facebook`;
  const body = {
    ip: ip,
    userAgent: userAgent,
    fbc: fbc,
    fbp: fbp,
    eventName: event_name,
    eventId: event_id,
    email: email,
    phone: phone,
    products: products,
    value: value,
    eventURL: eventURL,
    external_id: f_external_id_me || f_external_id_cookie || f_external_id,
    current_timestamp: current_timestamp,
  };
  await fetch(facebookApi, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const facebookMetadata = async ({ cart }: { cart: Cart }) => {
  const cookieStore = await cookies();
  const headersList = await headers();
  const baseUrl = process.env.SHOP_PUBLIC_URL;
  const xForwardedFor = headersList.get('x-forwarded-for');
  const remoteAddress = headersList.get('remoteAddress');
  const userAgent = headersList.get('user-agent');
  const fbp = cookieStore.get('_fbp')?.value;
  const fbc = cookieStore.get('_fbc')?.value;
  const f_external_id = cookieStore.get('f_external_id')?.value;
  const eventURL = `${baseUrl}/cart/processing`;

  let ip;
  if (xForwardedFor && xForwardedFor.split(',')[0]) {
    // If x-forwarded-for is present, take the first IP address
    ip = xForwardedFor.split(',')[0]?.trim();
  } else if (remoteAddress) {
    // If x-forwarded-for is not present, use remoteAddress
    ip = remoteAddress;
  } else {
    ip = 'unknown'; // Handle cases where no IP is available
  }

  try {
    if (fbc) {
      await updateMetaData({
        id: cart.id,
        key: '_fbc',
        value: fbc,
      });
    }
    if (fbp) {
      await updateMetaData({
        id: cart.id,
        key: '_fbp',
        value: fbp,
      });
    }
    if (f_external_id) {
      await updateMetaData({
        id: cart.id,
        key: 'f_external_id',
        value: f_external_id,
      });
    }
    if (userAgent) {
      await updateMetaData({
        id: cart.id,
        key: 'userAgent',
        value: userAgent,
      });
    }
    if (ip && ip != 'unknown') {
      await updateMetaData({
        id: cart.id,
        key: 'ip',
        value: ip,
      });
    }
    await updateMetaData({
      id: cart.id,
      key: 'eventURL',
      value: eventURL,
    });
  } catch (error) {
    console.log(error);
  }
};
