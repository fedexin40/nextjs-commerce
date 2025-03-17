import { Me } from 'lib/saleor';
import Item from './item';

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
  if (!orders || orders.length == 0) {
    return (
      <div>
        <div>No tienes pedidos aun ...</div>
      </div>
    );
  }

  const periods = Object.keys(ordersByDate).sort().reverse();

  return (
    <div className="tracking-wider dark:text-[#c9aa9e]">
      <div className="flex flex-col gap-8">
        {periods.map((period) => (
          <div key={period} className="flex flex-col">
            <div className="underline underline-offset-4 md:text-base">{period}</div>
            {ordersByDate[period]?.map((order) => (
              <div key={order.id}>
                <Item order={order} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
