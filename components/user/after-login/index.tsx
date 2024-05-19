import UserMenuModal from './modal';
import UserDetails from './user-details/page';
import UserShoppings from './user-shoppings';

export default function UserMenu() {
  return <UserMenuModal UserDetails={<UserDetails />} UserShoppings={<UserShoppings />} />;
}