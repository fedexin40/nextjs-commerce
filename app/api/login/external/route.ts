import { externalAuthenticationUrl } from 'lib/saleor';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let paramenters = await req.json();
  let callback = paramenters.callback;
  let response = await externalAuthenticationUrl(callback);
  let url = JSON.parse(response.url);
  url = url.authorizationUrl;
  return NextResponse.json({ url: url });
}
