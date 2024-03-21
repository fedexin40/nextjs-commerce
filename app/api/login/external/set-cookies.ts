import { NextResponse } from 'next/server';

export async function setTokenexternal(
  response: NextResponse,
  accessToken?: string,
  refreshToken?: string,
) {
  if (accessToken) {
    response.cookies.set('accessToken', accessToken, {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 5256000,
    });
    response.cookies.set('externalToken', 'True', {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 5256000,
    });
  }
  if (refreshToken) {
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 5256000,
    });
  }
  return response;
}
