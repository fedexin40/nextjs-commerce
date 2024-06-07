'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Logout } from '../before-login/login/actions';
import { useUserMenuActions } from './store';

export default function UserMenuDropDown() {
  const [openSelect, setOpenSelect] = useState(false);
  const { openMenu } = useUserMenuActions();
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
    <>
      <div className="relative" ref={ref}>
        <div
          onClick={() => {
            setOpenSelect(!openSelect);
          }}
          className="text-black underline-offset-4 hover:text-neutral-500 hover:underline dark:text-black dark:hover:text-neutral-300"
        >
          <div className="relative h-[27px] w-[27px] opacity-50">
            <Image className="object-cover" src={'/registro.png'} alt="" fill />
          </div>
        </div>
        {openSelect && (
          <div
            onClick={() => {
              setOpenSelect(false);
            }}
            className="absolute right-0 top-10 z-50 w-fit rounded-b-md bg-white shadow-md dark:bg-black md:-right-[28px] md:-top-[70px] lg:left-[4px] lg:top-[50px]"
          >
            <div className="flex flex-row whitespace-nowrap capitalize">
              <div
                className="w-1/2 px-3 py-1 text-center"
                onClick={() => {
                  openMenu();
                }}
              >
                Perfil
              </div>
              <div
                className="w-fit bg-[#c9aa9e] px-3 py-1 text-white"
                onClick={() => {
                  Logout();
                }}
              >
                Cerrar sesion
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
