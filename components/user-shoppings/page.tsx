import { Me } from 'lib/saleor';
import Image from 'next/image';

export default async function UserShoppings() {
  const me = await Me();
  const orders = me.orders || [];

  return (
    <div className="text-sm tracking-wider dark:text-[#c9aa9e]">
      <div>
        {orders?.length > 0 ? (
          <div>
            {orders.map((order) => (
              <div key={order.id}>
                {order.lines.map((line) => (
                  <div
                    key={line.id}
                    className="my-3 border-2 border-neutral-300 p-3 text-xs dark:border-[#c9aa9e]"
                  >
                    <div className="flex flex-row justify-around	gap-3">
                      <div className="relative h-14 w-14">
                        <Image className="object-contain" alt="" src={line.urlImage} fill />
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="font-semibold text-[hsl(28,30%,59%)]">Producto.</div>
                        <div className="dark:text-white">{line.productName}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="font-semibold text-[hsl(28,30%,59%)]">Fecha.</div>
                        <div className="dark:text-white">{order.date.split('T')[0]}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="font-semibold text-[hsl(28,30%,59%)]">No. de pedido</div>
                        <div className="text-center dark:text-white">{order.number}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="font-semibold text-[hsl(28,30%,59%)]">Total.</div>
                        <div className="text-center dark:text-white">
                          <span>$</span>
                          <span>{line.amount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div>No tienes pedidos aun ...</div>
        )}
      </div>
    </div>
  );
}
