import { Me } from 'lib/saleor';

function removeDay({ date }: { date: string }) {
  const dateObject = new Date(date);
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();
  const sinDay = `${month}-${year}`;
  return sinDay;
}

export default async function UserShoppings() {
  const me = await Me();
  const orders = me.orders || [];
  const ordersByDate = Object.groupBy(orders, removeDay);
  if (!ordersByDate) {
    return (
      <div className="tracking-wider dark:text-[#c9aa9e]">
        <div>No tienes pedidos aun ...</div>
      </div>
    );
  }

  const periods = Object.keys(ordersByDate);

  return (
    <div className="tracking-wider dark:text-[#c9aa9e]">
      <div className="flex flex-col gap-8">
        {periods.map((period) => (
          <div key={period} className="flex flex-col">
            <div className="text-lg underline underline-offset-4">{period}</div>
            {ordersByDate[period]?.map((order) => (
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
        ))}
      </div>
    </div>
  );
}
