import { externalObtainAccessTokens } from 'lib/saleor';
import { NextRequest, NextResponse } from 'next/server';

export async function setToken(
  response: NextResponse,
  accessToken?: string,
  refreshToken?: string
) {
  if (accessToken) {
    response.cookies.set('accessToken', accessToken, {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 5256000
    });
  }
  if (refreshToken) {
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 5256000
    });
  }
  return response;
}

export async function GET(req: NextRequest) {
  let searchParams = req.nextUrl.searchParams;
  let code = searchParams.get('code') || '';
  let state = searchParams.get('state') || '';
  let token;
  let response;
  token = await externalObtainAccessTokens(code, state);

  const accessToken = token?.token;
  const refreshToken = token?.refreshToken;
  //response = NextResponse.redirect(`${process.env.SALEOR_FRONTEND_URL}`);
  response = NextResponse.redirect('https://a93a-189-164-165-240.ngrok-free.app/');
  response = await setToken(response, accessToken, refreshToken);
  return response;
}
