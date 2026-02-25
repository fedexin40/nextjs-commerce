import { updateMetaData } from 'lib/saleor';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { checkoutId } = await req.json();

  const res = updateMetaData({
    id: checkoutId,
    key: 'is_checkout_waiting_payment',
    value: 'true',
  });

  return NextResponse.json({ ok: true, res });
}
