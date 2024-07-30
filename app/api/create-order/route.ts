import { completeCheckout } from 'lib/saleor';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest): Promise<Response> {
  const { checkout } = await req.json();
  console.log('Trying creating order from checkout');
  try {
    await completeCheckout({ checkoutId: checkout.id });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ status: 500 });
  }
  console.log('Order created successfully');
  return NextResponse.json({ status: 200 });
}
