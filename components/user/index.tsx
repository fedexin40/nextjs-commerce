import { Me } from 'lib/saleor';
import UserMenuDropDown from './after-login';
import UserMenuModal from './after-login/modal';
import UserDetails from './after-login/user-details/page';
import UserShoppings from './after-login/user-shoppings';
import Login from './before-login/login';
import Register from './before-login/register';

export default async function User() {
  const me = await Me();
  if (me.id.length === 0) {
    return (
      <>
        <Login />
        <Register />
      </>
    );
  }
  return (
    <>
      <UserMenuDropDown />
      <UserMenuModal
        UserDetails={<UserDetails />}
        UserShoppings={<UserShoppings />}
      ></UserMenuModal>
    </>
  );
}
