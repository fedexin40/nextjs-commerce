import UserAddress from 'components/user-details/page';
import UserShoppings from 'components/user-shoppings/page';
import UserMenu from './user-menu';

export default async function User() {
  return <UserMenu UserAddress={<UserAddress />} UserShoppings={<UserShoppings />} />;
}
