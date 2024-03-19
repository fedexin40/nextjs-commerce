'use client';

import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Fragment, Suspense, useState } from 'react';
import { externalAuthenticationFacebook, externalAuthenticationGoogle } from './actions';
import CloseLogin from './close-login';
import OpenLogin from './open-login';

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const openLogin = () => setIsOpen(true);
  const closeLogin = () => setIsOpen(false);

  return (
    <div className="z-50">
      <div aria-label="Open cart" onClick={openLogin}>
        <OpenLogin />
      </div>
      <Transition show={isOpen}>
        <Dialog onClose={closeLogin} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="-translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="-translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 text-black backdrop-blur-xl dark:border-neutral-700 dark:bg-black/80 dark:text-white md:w-[390px]">
              <div className="flex h-full flex-col overflow-y-auto overflow-x-hidden">
                <div className="relative">
                  <button
                    className="absolute right-5 top-5 md:hidden"
                    aria-label="Cerrar Incio de sesion"
                    onClick={closeLogin}
                  >
                    <CloseLogin />
                  </button>
                </div>
                <div className="mt-14 w-full text-center text-base font-medium tracking-wide md:mt-20 lg:mt-8">
                  <div className="flex justify-center">
                    <Image src={'/session.png'} alt="" width={60} height={60} />
                  </div>
                  <div className="mt-4 text-[#a8a8a8]">Iniciar Sesion</div>
                </div>
                <div className="mx-10 mb-10 mt-10 flex flex-col md:my-20 lg:mb-7 lg:mt-7">
                  <div>
                    <form>
                      <div className="mb-4 flex flex-row gap-x-2 border-b-2 border-[#d2b6ab] p-1">
                        <div className="relative grid h-5 w-5 place-content-center">
                          <Suspense>
                            <Image
                              className="object-contain text-center"
                              src="/email.png"
                              alt=""
                              fill
                            />
                          </Suspense>
                        </div>
                        <input
                          className="w-full bg-transparent pl-1 focus:ring-0 focus:ring-offset-0"
                          type="email"
                          name="UserName"
                          placeholder="Email..."
                        />
                      </div>
                      <div className="flex flex-row gap-x-2 border-b-2 border-[#d2b6ab] p-1">
                        <div className="relative h-5 w-5 place-content-center">
                          <Suspense>
                            <Image className="object-cover" src="/contrasena.png" alt="" fill />
                          </Suspense>
                        </div>
                        <input
                          className="w-full bg-transparent pl-1 focus:ring-0 focus:ring-offset-0"
                          type="password"
                          name="Password"
                          placeholder="Contraseña..."
                        />
                      </div>
                      <div className="flex flex-col-reverse place-content-end	 py-5	hover:cursor-pointer hover:opacity-25">
                        <div className="text-xs">¿Olvidaste tu contrasena?</div>
                      </div>
                      <button className="w-full bg-[#d2b6ab] p-2 text-white hover:opacity-60">
                        Entrar
                      </button>
                    </form>
                    <div className="grid grid-cols-3 grid-rows-2 py-5 opacity-40">
                      <div className="col-start-1 col-end-2 border-b-2 border-black	" />
                      <div className="max-w-3 col-start-2	col-end-3 row-span-2 place-self-center">
                        o
                      </div>
                      <div className="col-start-3 border-b-2 border-black	" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 flex w-full flex-row gap-5 bg-[#316FF6] px-5 py-2 text-sm hover:cursor-pointer hover:opacity-60 hover:ease-in">
                      <div className="relative h-5 w-5">
                        <Image
                          className="h-10 w-10 rounded-full bg-[#316FF6] object-cover"
                          src={'/facebookLogin.png'}
                          alt=""
                          fill
                        />
                      </div>
                      <div
                        className="whitespace-nowrap text-white"
                        onClick={async () => {
                          await externalAuthenticationFacebook();
                        }}
                      >
                        Inciar sesion con Facebook
                      </div>
                    </div>
                    <div className="flex flex-row gap-5 border-2 border-[#a8a8a8] px-5 py-2 text-sm hover:cursor-pointer hover:opacity-60 hover:ease-in">
                      <div className="relative h-5 w-5">
                        <Image className="object-cover" src={'/googleLogin.png'} alt="" fill />
                      </div>
                      <div
                        className="content-center whitespace-nowrap text-[#a8a8a8]"
                        onClick={async () => {
                          await externalAuthenticationGoogle();
                        }}
                      >
                        Inciar sesion con Google
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex h-full justify-center bg-[#d2b6ab] pb-10">
                  <div>
                    <div className=" top-5 mt-5 flex flex-row gap-2 border-2 border-white p-3 hover:cursor-pointer hover:opacity-60 hover:ease-in">
                      <div className="text-white">¿No tienes una cuenta?</div>
                      <div className="text-black">Registrate</div>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
}
