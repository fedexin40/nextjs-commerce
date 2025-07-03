import { Me } from 'lib/saleor';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith('/user') ||
    request.nextUrl.pathname.startsWith('/checkout') ||
    request.nextUrl.pathname.startsWith('/checkout-payment')
  ) {
    // If there is no an open session then return to home
    const me = await Me();
    if (me.id.length === 0) {
      return NextResponse.redirect(new URL('/home', request.url), 308);
    }
  }

  // Add a new header x-current-path which passes the path to downstream components
  const headers = new Headers(request.headers);
  headers.set('x-current-path', request.nextUrl.pathname);
  return NextResponse.next({ headers });
}
