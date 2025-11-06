import { getCart, Me, updateMetaData } from 'lib/saleor';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/user')) {
    // If there is no an open session then return to home
    const me = await Me();
    if (me.id.length === 0) {
      return NextResponse.redirect(new URL('/home', request.url), 308);
    }
  }

  if (request.nextUrl.pathname.startsWith('/cart/processing')) {
    const searchParams = request.nextUrl.searchParams;
    if (searchParams) {
      const checkout = searchParams.get('checkout') || '';
      const cart = await getCart(checkout || '');
      if (cart) {
        updateMetaData({
          id: cart.id,
          key: 'is_checkout_waiting_payment',
          value: 'true',
        });
      }
    }
    return NextResponse.next();
  }

  // Add a new header x-current-path which passes the path to downstream components
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  response.headers.set('x-current-path', request.nextUrl.pathname);
  return response;
}
