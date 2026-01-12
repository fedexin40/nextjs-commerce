import { NextRequest, NextResponse } from 'next/server';

const bizSdk = require('facebook-nodejs-business-sdk');
const Content = bizSdk.Content;
const CustomData = bizSdk.CustomData;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const ServerEvent = bizSdk.ServerEvent;
const FacebookAdsApi = bizSdk.FacebookAdsApi;

const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
const pixelID = process.env.FACEBOOK_PIXEL_ID;

type ProductItem = {
  handle: string;
  quantity: number;
  price: number;
};

export async function POST(req: NextRequest): Promise<Response> {
  const parameters = await req.json();
  const ip = parameters.ip;
  const userAgent = parameters.userAgent;
  const fbc = parameters.fbc;
  const fbp = parameters.fbp;
  const eventName = parameters.eventName;
  const eventId = parameters.eventId;
  const email = parameters.email;
  const phone = parameters.phone;
  const products = parameters.products;
  const value = parameters.value || 0.0;
  const eventURL = parameters.eventURL;
  const external_id = parameters.external_id;
  const current_timestamp = parameters.current_timestamp;

  // From https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api?locale=es_ES
  FacebookAdsApi.init(accessToken);
  const userData = new UserData()
    // It is recommended to send Client IP and User Agent for Conversions API Events.
    .setClientIpAddress(ip)
    .setClientUserAgent(userAgent)
    .setFbp(fbp)
    .setFbc(fbc)
    .setExternalId(external_id);

  if (email && email.length > 0) {
    userData.setEmails([email]);
  }

  if (phone && phone.length > 0) {
    userData.setPhones([phone]);
  }

  const content = products.map((product: ProductItem) =>
    new Content()
      .setId(product.handle)
      .setQuantity(product.quantity)
      .setItemPrice(product.price || 0.0),
  );

  const customData = new CustomData()
    .setContents(content)
    .setCurrency('MXN')
    .setValue(value)
    .setContentType('product')
    .setContentIds(products.map((p: ProductItem) => p.handle));

  const serverEvent = new ServerEvent()
    .setEventId(eventId)
    .setEventName(eventName)
    .setEventTime(current_timestamp)
    .setUserData(userData)
    .setCustomData(customData)
    .setEventSourceUrl(eventURL)
    .setActionSource('website');

  const eventRequest = new EventRequest(accessToken, pixelID).setEvents([serverEvent]);
  try {
    const response = await eventRequest.execute();
    return NextResponse.json({ ok: true, response });
  } catch (err: any) {
    console.error('CAPI Error:', err);
    return new Response(JSON.stringify({ ok: false, error: String(err?.message ?? err) }), {
      status: 500,
    });
  }
}
