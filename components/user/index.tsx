import PersonIcon from '@mui/icons-material/Person';
import Login from 'components/login';
import Register from 'components/register';
import ResetPassword from 'components/reset-password';
import { Me } from 'lib/saleor';
import Link from 'next/link';

export default async function User() {
  const me = await Me();
  if (me.id.length === 0) {
    return (
      <>
        <Login />
        <Register />
        <ResetPassword />
      </>
    );
  }
  return (
    <div className="text-[13px] tracking-widest lg:text-[14.3px]">
      <Link href="/user">
        <div className="opacity-50">
          <PersonIcon fontSize="large" />
        </div>
      </Link>
    </div>
  );
}
