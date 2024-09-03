'use server';

import { GetOrderById } from 'lib/saleor';

export async function getOrder({ orderId }: { orderId: string }) {
  const order = await GetOrderById(orderId);
  return order;
}
