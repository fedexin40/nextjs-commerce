import { NextRequest, NextResponse } from 'next/server';

const bizSdk = require('facebook-nodejs-business-sdk');
const Content = bizSdk.Content;
const CustomData = bizSdk.CustomData;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const ServerEvent = bizSdk.ServerEvent;

const accessToken = process.env.NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN;
const pixelID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

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
  const productID = parameters.productID;
  const value = parameters.value || 0.0;
  const eventURL = parameters.eventURL;
  const external_id = parameters.external_id;
  const current_timestamp = parameters.current_timestamp;
  // From https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api?locale=es_ES
  const userData = new UserData()
    // It is recommended to send Client IP and User Agent for Conversions API Events.
    .setClientIpAddress(ip)
    .setClientUserAgent(userAgent)
    .setFbp(fbp)
    .setFbc(fbc)
    .setExternalId(external_id);

  if (email) {
    userData.setEmails([email]);
  }

  if (phone) {
    userData.setPhones([phone]);
  }

  const content = new Content().setId(productID).setQuantity(1);

  const customData = new CustomData().setContents([content]).setCurrency('mxn').setValue(value);

  const serverEvent = new ServerEvent()
    .setEventId(eventId)
    .setEventName(eventName)
    .setEventTime(current_timestamp)
    .setUserData(userData)
    .setCustomData(customData)
    .setEventSourceUrl(eventURL)
    .setActionSource('website');

  const eventsData = [serverEvent];
  const eventRequest = new EventRequest(accessToken, pixelID).setEvents(eventsData);

  eventRequest.execute().then(
    (response: any) => {
      console.log('Response: ', response);
    },
    (err: any) => {
      console.error('Error: ', err);
    },
  );
  return NextResponse.json({ status: 200 });
}
