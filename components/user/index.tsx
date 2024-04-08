import { Me } from 'lib/saleor';
import UserMenu from './after-login';
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
  return <UserMenu />;
}
