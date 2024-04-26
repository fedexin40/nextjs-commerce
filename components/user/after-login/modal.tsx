'use client';

import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Fragment, ReactNode } from 'react';
import { useOpen, useUserMenuActions } from './store';

export default function UserMenuModal({
  UserDetails,
  UserShoppings,
}: {
  UserDetails: ReactNode;
  UserShoppings: ReactNode;
}) {
  const isOpen = useOpen();
  const { openMenu } = useUserMenuActions();
  const { closeMenu } = useUserMenuActions();

  return (
    <div className="z-50 opacity-50 hover:cursor-pointer">
      <div onClick={openMenu}>
        <Image src={'/registro.png'} alt="" width="27" height="27" />
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="h-full w-full text-left align-middle md:w-3/4 md:py-28 lg:py-10">
                  <div className="relative">
                    <div
                      className="absolute -right-4 -top-3 flex h-7 w-7 place-content-center rounded-full bg-[hsl(28,30%,59%)] pt-0.5 text-[15px] font-medium text-white hover:cursor-pointer"
                      aria-label="Cerrar Incio de sesion"
                      onClick={closeMenu}
                    >
                      x
                    </div>
                  </div>
                  <div className="flex h-full flex-col md:flex-row">
                    <div className="bg-[#f7e7da] pb-10 pt-10 md:w-1/3">{UserDetails}</div>
                    <div className="h-full bg-white pt-10 md:w-2/3">{UserShoppings}</div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
