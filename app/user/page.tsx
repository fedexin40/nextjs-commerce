import Order from 'components/order/page';
import UserAddress from 'components/user-details/page';
import UserShoppings from 'components/user-shoppings/page';
import { Me } from 'lib/saleor';
import { redirect } from 'next/navigation';
import UserMenu from './user-menu';

export default async function User() {
  const me = await Me();
  if (me.id.length === 0) {
    redirect('/home');
  }

  return (
    <UserMenu UserAddress={<UserAddress />} UserShoppings={<UserShoppings />} Order={<Order />} />
  );
}
