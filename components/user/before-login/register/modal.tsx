'use client';

import { Dialog, Transition } from '@headlessui/react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { clsx } from 'clsx';
import {
  useError,
  useErrorMessage,
  useLoading,
  usePersonActions,
  useRegister,
} from 'components/user/before-login/store';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Fragment, ReactNode, Suspense, useRef } from 'react';
import { accountRegister } from './actions';
import CloseRegister from './close-register';

export default function RegisterModal({ children }: { children: ReactNode }) {
  const ErrorMessage = useErrorMessage();
  const isError = useError();
  const isOpen = useRegister();
  const Loading = useLoading();
  const { closeRegister } = usePersonActions();
  const { openLogin } = usePersonActions();
  const { closeError } = usePersonActions();
  const { setErrorMessage } = usePersonActions();
  const { openError } = usePersonActions();
  const { isLoading } = usePersonActions();
  const { isNotLoading } = usePersonActions();
  const router = useRouter();
  const initialFocusRef = useRef(null);

  async function RegisterAction(formData: FormData) {
    isLoading();
    const rawFormData = {
      password: formData.get('password')?.toString() || '',
      passwordConfirm: formData.get('passwordConfirm')?.toString() || '',
      email: formData.get('email')?.toString() || '',
    };

    if (rawFormData.password !== rawFormData.passwordConfirm) {
      openError();
      setErrorMessage('Las contraseñas no coinciden');
    } else {
      const error = await accountRegister({
        email: rawFormData.email,
        password: rawFormData.password,
      });
      if (error) {
        setErrorMessage(error);
        openError();
      } else {
        closeRegister();
        router.push('/new-user');
      }
    }
    isNotLoading();
  }

  return (
    <div className="z-50">
      <Transition show={isOpen}>
        <Dialog onClose={() => {}} className="relative z-50" initialFocus={initialFocusRef}>
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
              <div>
                <Snackbar
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={isError}
                  autoHideDuration={6000}
                  onClose={closeError}
                >
                  <Alert
                    onClose={closeError}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                  >
                    {ErrorMessage}
                  </Alert>
                </Snackbar>
              </div>
              <div className="flex h-full flex-col overflow-y-auto overflow-x-hidden">
                <div className="relative">
                  <button
                    className="absolute right-5 top-5"
                    aria-label="Cerrar Incio de sesion"
                    onClick={closeRegister}
                  >
                    <CloseRegister />
                  </button>
                </div>
                <div className="mt-14 w-full text-center text-base font-medium tracking-wide md:mt-20 lg:mt-8">
                  <div className="mt-4 text-[#a8a8a8] dark:text-white">Registrate</div>
                </div>
                <div className="mx-10 mb-10 mt-10 flex flex-col md:my-20 lg:mb-7 lg:mt-7">
                  <div className="gap-y-4">
                    <form action={RegisterAction} ref={initialFocusRef}>
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
                          name="email"
                          placeholder="Email..."
                        />
                      </div>
                      <div className="mb-4 flex flex-row gap-x-2 border-b-2 border-[#d2b6ab] p-1">
                        <div className="relative h-5 w-5 place-content-center">
                          <Suspense>
                            <Image className="object-cover" src="/contrasena.png" alt="" fill />
                          </Suspense>
                        </div>
                        <input
                          className="w-full bg-transparent pl-1 focus:ring-0 focus:ring-offset-0"
                          type="password"
                          name="password"
                          placeholder="Contraseña..."
                        />
                      </div>

                      <div className="mb-4 flex flex-row gap-x-2 border-b-2 border-[#d2b6ab] p-1">
                        <div className="relative h-5 w-5 place-content-center">
                          <Suspense>
                            <Image className="object-cover" src="/contrasena.png" alt="" fill />
                          </Suspense>
                        </div>
                        <input
                          className="w-full bg-transparent pl-1 focus:ring-0 focus:ring-offset-0"
                          type="password"
                          name="passwordConfirm"
                          placeholder="Confirmar contraseña..."
                        />
                      </div>
                      <div className="mb-4 text-center text-xs tracking-wider text-slate-500 dark:text-white">
                        Te recordamos que toda tu informacion es confidencial. Al registrarte
                        aceptas nuestras Condiciones, nuestra Politica de privacidad y nuestra
                        Politica de cookies
                      </div>
                      <button
                        className={clsx(
                          'h-10 w-full bg-[#d2b6ab] p-2 text-white hover:opacity-60',
                          {
                            'cursor-not-allowed opacity-60 hover:opacity-60': Loading,
                          },
                        )}
                      >
                        Registrate
                      </button>
                    </form>
                    <div className="grid grid-cols-3 grid-rows-2 py-5">
                      <div className="col-start-1 col-end-2 border-b-2 border-black	" />
                      <div className="max-w-3 col-start-2	col-end-3 row-span-2 place-self-center">
                        o
                      </div>
                      <div className="col-start-3 border-b-2 border-black	" />
                    </div>
                  </div>
                  {children}
                </div>
                <div className="flex h-full justify-center bg-[#d2b6ab] pb-10">
                  <div className="mx-10 w-full">
                    <div
                      className="top-5 mt-5 flex w-full flex-row place-content-center gap-2 whitespace-nowrap border-2 border-white p-3 hover:cursor-pointer hover:opacity-60 hover:ease-in"
                      onClick={openLogin}
                    >
                      <div className="text-white">¿Tienes una cuenta?</div>
                      <div className="text-black">Entrar</div>
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
