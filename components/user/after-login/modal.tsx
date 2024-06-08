'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode, useRef } from 'react';
import CloseLogin from './close-login';
import { useOpen, useUserMenuActions } from './store';

export default function UserMenuModal({
  UserDetails,
  UserShoppings,
}: {
  UserDetails: ReactNode;
  UserShoppings: ReactNode;
}) {
  const isOpen = useOpen();
  const { closeMenu } = useUserMenuActions();
  const initialFocusRef = useRef(null);

  return (
    <div className="z-50 opacity-50 hover:cursor-pointer">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {}}
          initialFocus={initialFocusRef}
        >
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
                  <div className="relative hidden md:block">
                    <div
                      className="absolute -right-4 -top-3 flex h-7 w-7 place-content-center rounded-full bg-[hsl(28,30%,59%)] pt-0.5 text-[15px] font-medium text-white hover:cursor-pointer dark:bg-[#c9aa9e] dark:text-black"
                      aria-label="Cerrar Incio de sesion"
                      onClick={closeMenu}
                    >
                      x
                    </div>
                  </div>
                  <div className="relative md:hidden">
                    <button
                      className="absolute right-5 top-5"
                      aria-label="Cerrar Incio de sesion"
                      onClick={closeMenu}
                    >
                      <CloseLogin />
                    </button>
                  </div>
                  <div className="flex h-full flex-col md:flex-row">
                    <div
                      className="bg-[#f7e7da] pb-10 pt-10 dark:bg-zinc-700 md:w-1/3 md:overflow-x-auto"
                      ref={initialFocusRef}
                    >
                      {UserDetails}
                    </div>
                    <div className="bg-white pb-20 pt-10 dark:bg-black md:w-2/3 md:overflow-x-auto">
                      {UserShoppings}
                    </div>
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
