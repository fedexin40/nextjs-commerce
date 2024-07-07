import { completeCheckout } from 'lib/saleor';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest): Promise<Response> {
  const { checkout } = await req.json();
  console.log(checkout);
  console.log(req);
  const order = await completeCheckout({ checkoutId: checkout.id });
  console.log(order);
  return NextResponse.json({ status: 200 });
}
