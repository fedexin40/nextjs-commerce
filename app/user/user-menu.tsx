'use client';

import clsx from 'clsx';
import { ReactNode, useState } from 'react';
import { Logout } from './actions';

export default function UserMenu({
  UserAddress,
  UserShoppings,
}: {
  UserAddress: ReactNode;
  UserShoppings: ReactNode;
}) {
  const [menu, setMenu] = useState(false);
  return (
    <div className="flex w-full flex-row dark:bg-zinc-700">
      <div className="basis-1/4 py-10">
        <div className="flex h-full flex-col gap-10  rounded-sm border-r-2 border-zinc-400 px-10  dark:border-white">
          <div
            className={clsx('hover:cursor-pointer', { 'opacity-50': menu })}
            onClick={() => setMenu(true)}
          >
            <span className="bg:border-white text-ellipsis whitespace-nowrap rounded-sm border-b-2 border-zinc-400 py-2">
              Dirección
            </span>
          </div>
          <div
            className={clsx('hover:cursor-pointer', { 'opacity-50': !menu })}
            onClick={() => setMenu(false)}
          >
            <span className="bg:border-white text-ellipsis whitespace-nowrap rounded-sm border-b-2 border-zinc-400 py-2">
              Historial de Compras
            </span>
          </div>
          <div
            className="text-ellipsis whitespace-nowrap hover:cursor-pointer"
            onClick={() => Logout()}
          >
            <span className="bg:border-white text-ellipsis whitespace-nowrap rounded-sm border-b-2 border-zinc-400 py-2">
              Cerrar Sesión
            </span>
          </div>
        </div>
      </div>
      <div className="basis-3/4 py-[50px] pl-[50px] md:pr-[100px] lg:pr-[180px]">
        {menu ? UserAddress : UserShoppings}
      </div>
    </div>
  );
}
