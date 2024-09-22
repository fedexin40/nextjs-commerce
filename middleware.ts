import { Me } from 'lib/saleor';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/user', '/checkout', '/checkout-payment'],
};

export async function middleware(request: NextRequest) {
  // If there is no an open session then return to home
  const me = await Me();
  if (me.id.length === 0) {
    const url = request.nextUrl.clone();
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
