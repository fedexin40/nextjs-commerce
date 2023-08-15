import { registeraccount, tokencreate, tokenRefresh, tokenVerify } from 'lib/saleor';
import { cookies } from 'next/headers';
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

export async function POST(req: NextRequest) {
  let paramenters = await req.json();
  let response;
  let operation = paramenters.operation;
  let accessToken;
  let refreshToken;
  let IstokenOk;
  let password;
  let email;
  let token;

  switch (operation) {
    case 'login':
      email = paramenters.email;
      password = paramenters.password;
      try {
        token = await tokencreate(email, password);
      } catch (error) {
        return NextResponse.json({ status: 500 });
      }
      accessToken = token?.token;
      refreshToken = token?.refreshToken;
      response = NextResponse.json({ status: 200 });
      response = await setToken(response, accessToken, refreshToken);
      return response;

    case 'register':
      email = paramenters.email;
      password = paramenters.password;
      try {
        await registeraccount(email, password, 'http://localhost:3000/account/confirm');
      } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
      }
      return NextResponse.json({ status: 200 });

    case 'getToken':
      accessToken = cookies().get('accessToken')?.value;
      refreshToken = cookies().get('refreshToken')?.value;
      if (!accessToken || !refreshToken) {
        return NextResponse.json({ accessToken: false });
      }
      // Before seding the token verify it is ok
      try {
        IstokenOk = await tokenVerify(accessToken);
      } catch (e) {
        console.log(e);
      }

      // The token is valid so it is ok to send it
      if (IstokenOk === true) {
        return NextResponse.json({ accessToken: accessToken });
      }
      // Token is not valid, so we will try to refresh it
      try {
        accessToken = await tokenRefresh(refreshToken);
      } catch {
        // Something failed while trying to refresh the token so
        // we will request user to sign again
        return NextResponse.json({ accessToken: false });
      }
      // Before sending the new token, lets add it to the cookies
      accessToken = accessToken?.token;
      response = NextResponse.json({ accessToken: accessToken });
      response = await setToken(response, accessToken);
      return response;

    case 'closeSession':
      cookies().delete('accessToken');
      cookies().delete('refreshToken');
      return NextResponse;
  }
}
