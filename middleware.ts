import { Me } from 'lib/saleor';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const user = await Me();
  const cartId = request.cookies.get('cartId');
  const response = NextResponse.redirect(new URL('/home', request.url));
  if (!cartId && user.lastCheckout) {
    response.cookies.set({
      name: 'cartId',
      value: user.lastCheckout,
    });
    return response;
  }
}

export const config = {
  matcher: '/home',
};
