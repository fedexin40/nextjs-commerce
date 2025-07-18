'use client';

import { order as orderType } from 'lib/types';
import { useMenuActions } from 'stores/user';

export default function Item({ order }: { order: orderType }) {
  const { showOrderMenu } = useMenuActions();
  const { setOrder } = useMenuActions();

  function orderItem(order: orderType) {
    setOrder(order);
    showOrderMenu();
  }

  return (
    <div
      className="my-5 border-2 border-neutral-300 py-5 shadow-sm hover:cursor-pointer"
      onClick={() => orderItem(order)}
    >
      <div className="flex flex-row justify-around gap-3">
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="font-semibold text-[hsl(28,30%,59%)]">Fecha.</div>
          <div>{order.date.split('T')[0]}</div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="font-semibold text-[hsl(28,30%,59%)]">No. de pedido</div>
          <div className="text-center">{order.number}</div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="font-semibold text-[hsl(28,30%,59%)]">Total.</div>
          <div className="text-center">
            <span>$</span>
            <span>{order.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
