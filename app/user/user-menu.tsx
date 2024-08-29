'use client';

import MenuIcon from '@mui/icons-material/Menu';
import clsx from 'clsx';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { create } from 'zustand';
import { Logout } from './actions';

interface menu {
  addressMenu: boolean;
  historyMenu: boolean;
  actions: {
    showAddressMenu: () => void;
    showHistoryMenu: () => void;
  };
}

const MenuStore = create<menu>()((set) => ({
  addressMenu: true,
  historyMenu: false,
  actions: {
    showAddressMenu: () => set({ addressMenu: true, historyMenu: false }),
    showHistoryMenu: () => set({ historyMenu: true, addressMenu: false }),
  },
}));

const menuActions = () => MenuStore((state) => state.actions);
const addressMenu = () => MenuStore((state) => state.addressMenu);
const historyMenu = () => MenuStore((state) => state.historyMenu);

export function Menu() {
  const { showAddressMenu } = menuActions();
  const { showHistoryMenu } = menuActions();
  return (
    <>
      <div className="flex h-full flex-col gap-10 px-10">
        <div
          className={clsx('hover:cursor-pointer', { 'opacity-50': addressMenu() })}
          onClick={() => showAddressMenu()}
        >
          <span className="bg:border-white text-ellipsis whitespace-nowrap rounded-sm border-b-2 border-zinc-400 py-2">
            Dirección
          </span>
        </div>
        <div
          className={clsx('hover:cursor-pointer', { 'opacity-50': historyMenu() })}
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
}: {
  UserAddress: ReactNode;
  UserShoppings: ReactNode;
}) {
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
      <div className="flex w-full flex-row dark:bg-zinc-700">
        <div className="basis-[10px] py-10 md:basis-1/4">
          <div className="flex h-full md:hidden">
            <div className="relative">
              {openSelect && (
                <div
                  className="absolute left-0 top-0 z-50 h-full rounded-sm border-r-2 border-zinc-400 bg-white shadow-md dark:border-white dark:bg-zinc-700"
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
        <div className="my-10 basis-[90%] rounded-sm border-l-2 border-zinc-400 px-5 dark:border-white md:basis-3/4 md:pl-[50px] md:pr-[100px] lg:pr-[180px]">
          {addressMenu() && UserAddress}
          {historyMenu() && UserShoppings}
        </div>
      </div>
    </div>
  );
}
