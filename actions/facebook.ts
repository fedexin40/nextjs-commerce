'use server';
import { TAGS } from '#/lib/constants';
import { Me, updateMetaData } from '#/lib/saleor';
import { revalidateTag } from 'next/cache';
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
  products,
}: {
  fbclid: string | string[] | undefined;
  event_name: string;
  value: string;
  event_id: string;
  email: string | undefined;
  phone: string | undefined;
  current_timestamp: number;
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
  } else if (!f_external_id_me && f_external_id_cookie && user.id) {
    await updateMetaData({
      id: user.id,
      key: 'f_external_id',
      value: f_external_id_cookie,
    });
    revalidateTag(TAGS.user, 'max');
  } else if (f_external_id_me && !f_external_id_cookie) {
    cookieStore.set('f_external_id', f_external_id_me, { httpOnly: true, maxAge: 25920000 });
  }

  if (!fbc && fbclid) {
    fbc = `fb.2.${current_timestamp}.${fbclid}`;
    cookieStore.set('_fbc', fbc, { httpOnly: true, maxAge: 25920000 });
  }

  const facebookApi = `${baseUrl}/api/facebook`;
  const body = {
    ip: ip,
    userAgent: userAgent,
    fbc: fbc || fbc,
    fbp: fbp,
    eventName: event_name,
    eventId: event_id,
    email: email,
    phone: phone,
    productID: products,
    value: value,
    eventURL: eventURL,
    external_id: f_external_id_me ?? f_external_id_cookie ?? f_external_id,
    current_timestamp: current_timestamp,
  };
  await fetch(facebookApi, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};
