import { Me } from 'lib/saleor';
import Image from 'next/image';
import Link from 'next/link';
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
    <div className="text-[13px] tracking-widest lg:text-[14.3px]">
      <Link href="/user">
        <div className="relative h-[27px] w-[27px] opacity-50">
          <Image
            className="object-contain"
            src={'/registro.png'}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
    </div>
  );
}
