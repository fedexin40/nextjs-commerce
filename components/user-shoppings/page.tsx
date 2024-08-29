import { Me } from 'lib/saleor';

export default async function UserShoppings() {
  const me = await Me();
  const orders = me.orders || [];

  return (
    <div className="tracking-wider dark:text-[#c9aa9e]">
      <div>
        {orders?.length > 0 ? (
          <div>
            {orders.map((order) => (
              <div
                key={order.id}
                className="my-5 border-2 border-neutral-300 py-5 hover:cursor-pointer dark:border-[#c9aa9e]"
              >
                <div className="flex flex-row justify-around gap-3">
                  <div className="flex flex-col gap-2 md:flex-row">
                    <div className="font-semibold text-[hsl(28,30%,59%)]">Fecha.</div>
                    <div className="dark:text-white">{order.date.split('T')[0]}</div>
                  </div>
                  <div className="flex flex-col gap-2 md:flex-row">
                    <div className="font-semibold text-[hsl(28,30%,59%)]">No. de pedido</div>
                    <div className="text-center dark:text-white">{order.number}</div>
                  </div>
                  <div className="flex flex-col gap-2 md:flex-row">
                    <div className="font-semibold text-[hsl(28,30%,59%)]">Total.</div>
                    <div className="text-center dark:text-white">
                      <span>$</span>
                      <span>{order.amount}</span>
                    </div>
                  </div>
                </div>
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
