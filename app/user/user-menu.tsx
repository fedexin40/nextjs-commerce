'use client';

import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import MenuIcon from '@mui/icons-material/Menu';
import { Logout } from 'actions/user';
import clsx from 'clsx';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useAddressMenu, useHistoryMenu, useMenuActions, useOrderMenu } from 'stores/user';

function Menu() {
  const addressMenu = useAddressMenu();
  const historyMenu = useHistoryMenu();
  const { showAddressMenu } = useMenuActions();
  const { showHistoryMenu } = useMenuActions();
  return (
    <>
      <div className="flex min-h-[300px] flex-col gap-10 px-10">
        <div
          className={clsx('hover:cursor-pointer', { 'opacity-50': addressMenu })}
          onClick={() => showAddressMenu()}
        >
          <span className="bg:border-white text-ellipsis whitespace-nowrap rounded-sm border-b-2 border-zinc-400 py-2">
            Dirección
          </span>
        </div>
        <div
          className={clsx('hover:cursor-pointer', { 'opacity-50': historyMenu })}
          onClick={() => showHistoryMenu()}
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
    </>
  );
}

export default function UserMenu({
  UserAddress,
  UserShoppings,
  Order,
}: {
  UserAddress: ReactNode;
  UserShoppings: ReactNode;
  Order: ReactNode;
}) {
  const addressMenu = useAddressMenu();
  const historyMenu = useHistoryMenu();
  const orderMenu = useOrderMenu();
  const { showHistoryMenu } = useMenuActions();
  const [openSelect, setOpenSelect] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div>
      <div className="flex w-full flex-row">
        <div className="basis-[10px] py-10 md:basis-1/4">
          <div className="flex h-full min-h-[300px] md:hidden" ref={ref}>
            <div className="relative">
              {openSelect && (
                <div
                  className="absolute left-0 top-0 z-50 h-full border-r-2 border-zinc-400 bg-white pt-10"
                  onClick={() => {
                    setOpenSelect(false);
                  }}
                >
                  <Menu />
                </div>
              )}
            </div>
            <div
              className="p-2 hover:cursor-pointer"
              onClick={() => {
                setOpenSelect(!openSelect);
              }}
            >
              <MenuIcon />
            </div>
          </div>
          <div className="hidden md:flex">
            <Menu />
          </div>
        </div>
        <div className="my-10 basis-[90%] rounded-sm border-l-2 border-zinc-400 px-5 md:basis-3/4 md:pl-[50px] md:pr-[100px] lg:pr-[180px]">
          {addressMenu && UserAddress}
          {historyMenu && UserShoppings}
          {orderMenu && (
            <div className="flex flex-col gap-5">
              <div
                className="w-fit rounded-lg bg-zinc-100 p-2 shadow-md shadow-gray-400 hover:cursor-pointer"
                onClick={() => showHistoryMenu()}
              >
                <KeyboardReturnIcon />
              </div>
              <div>{Order}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
