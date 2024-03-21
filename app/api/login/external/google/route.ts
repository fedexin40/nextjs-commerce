import { externalObtainAccessTokens } from 'lib/saleor';
import { NextRequest, NextResponse } from 'next/server';
import { setTokenexternal } from '../set-cookies';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const pluginId = 'mirumee.authentication.openidconnect.google';

  const code = searchParams.get('code') || '';
  const state = searchParams.get('state') || '';
  const token = await externalObtainAccessTokens(code, state, pluginId);

  const accessToken = token.token;
  const refreshToken = token.tokenRefresh;
  let response = NextResponse.redirect('/');
  response = await setTokenexternal(response, accessToken, refreshToken);
  return response;
}
