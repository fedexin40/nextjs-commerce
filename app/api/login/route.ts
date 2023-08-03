import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<Response> {
  const paramenters = await req.json();
  const response = new NextResponse();

  if (paramenters.operation == 'set-token') {
    const accessToken = paramenters.accessToken;
    const refreshToken = paramenters.refreshToken;

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      path: '/'
    });
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      path: '/'
    });
    return response;
  } else if (paramenters.operation == 'isloggin') {
    const accessToken = cookies().get('accessToken');
    if (!accessToken) {
      return NextResponse.json({ isloggin: false });
    } else {
      return NextResponse.json({ isloggin: true });
    }
  }
  return NextResponse.json({ status: 204 });
}
