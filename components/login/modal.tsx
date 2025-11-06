'use client';

import { Dialog, Transition } from '@headlessui/react';
import PersonIcon from '@mui/icons-material/Person';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { Login } from 'actions/user';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Fragment, ReactNode, useRef } from 'react';
import { useError, useErrorMessage, useLoading, useLogin, usePersonActions } from 'stores/user';
import CloseLogin from './close-login';

export default function LoginModal({ children }: { children: ReactNode }) {
  const isOpen = useLogin();
  const ErrorMessage = useErrorMessage();
  const isError = useError();
  const { openLogin } = usePersonActions();
  const { openRegister } = usePersonActions();
  const { closeLogin } = usePersonActions();
  const { openResetPassword } = usePersonActions();
  const { isLoading } = usePersonActions();
  const { isNotLoading } = usePersonActions();
  const { closeError } = usePersonActions();
  const { setErrorMessage } = usePersonActions();
  const { openError } = usePersonActions();
  const Loading = useLoading();
  const router = useRouter();
  const initialFocusRef = useRef(null);

  async function LoginAction(formData: FormData) {
    isLoading();
    const rawFormData = {
      password: formData.get('password')?.toString() || '',
      email: formData.get('email')?.toString() || '',
    };
    const data = await Login({
      email: rawFormData.email,
      password: rawFormData.password,
    });
    if (!data) {
      router.refresh();
    }
    if (data.tokenCreate?.errors.length > 0) {
      setErrorMessage(data.tokenCreate.errors[0]?.message || '');
      openError();
    } else {
      closeLogin();
      router.refresh();
    }
    isNotLoading();
  }
  return (
    <div className="z-50">
      <div onClick={openLogin}>
        <PersonIcon fontSize="large" />
      </div>
      <Transition show={isOpen}>
        <Dialog
          onClose={() => {
            closeLogin();
          }}
          className="relative z-50"
          initialFocus={initialFocusRef}
        >
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
            <Dialog.Panel className="fixed bottom-0 left-0 top-0 flex h-full w-3/4 flex-col border-l border-neutral-200 bg-white/80 text-[13.5px] tracking-[1.4px] text-black backdrop-blur-xl md:w-[390px] lg:text-[14.3px]">
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
                    onClick={closeLogin}
                  >
                    <CloseLogin />
                  </button>
                </div>
                <div className="mt-14 w-full text-center md:mt-20 lg:mt-8">
                  <div className="flex justify-center">
                    <Image src={'/session.png'} alt="" width={60} height={60} />
                  </div>
                  <div className="mt-4 text-[14px]">Iniciar Sesión</div>
                </div>
                <div className="mx-10 mb-10 mt-10 flex flex-col md:my-20 lg:mb-7 lg:mt-7">
                  <div>
                    <form action={LoginAction} ref={initialFocusRef}>
                      <div className="mb-4 flex flex-row gap-x-2 border-b-2 border-[#d2b6ab] p-1">
                        <div className="relative grid h-5 w-5 place-content-center">
                          <div className="relative h-[20px] w-[20px]">
                            <Image
                              className="object-contain text-center"
                              src="/email.png"
                              alt="email"
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        </div>
                        <input
                          className="w-full bg-transparent pl-1 focus:ring-0 focus:ring-offset-0"
                          type="email"
                          name="email"
                          placeholder="Email..."
                        />
                      </div>
                      <div className="flex flex-row gap-x-2 border-b-2 border-[#d2b6ab] p-1">
                        <div className="relative h-5 w-5 place-content-center">
                          <div className="relative h-[20px] w-[20px]">
                            <Image
                              className="object-cover"
                              src="/contrasena.png"
                              alt="password"
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        </div>
                        <input
                          className="w-full bg-transparent pl-1 focus:ring-0 focus:ring-offset-0"
                          type="password"
                          name="password"
                          placeholder="Contraseña..."
                          autoComplete="on"
                        />
                      </div>
                      <div className="flex flex-col-reverse place-content-end	py-5	text-[13.5px] tracking-[1.4px] hover:cursor-pointer hover:opacity-25">
                        <div onClick={openResetPassword}>¿Olvidaste tu contrasena?</div>
                      </div>
                      <button
                        className={clsx(
                          'h-10 w-full bg-[#d2b6ab] p-2 text-[13.5px] tracking-[1.4px] hover:opacity-60 lg:text-[14.3px]',
                          {
                            'cursor-not-allowed opacity-60 hover:opacity-60': Loading,
                          },
                        )}
                      >
                        Entrar
                      </button>
                    </form>
                    <div className="grid grid-cols-3 grid-rows-2 py-5">
                      <div className="col-start-1 col-end-2 border-b-2 border-black	" />
                      <div className="col-start-2 col-end-3	row-span-2 max-w-3 place-self-center">
                        o
                      </div>
                      <div className="col-start-3 border-b-2 border-black	" />
                    </div>
                  </div>
                </div>
                <div className="p-3">{children}</div>
                <div className="flex h-full place-content-center justify-center bg-[#d2b6ab] pb-10">
                  <div className="w-full p-3">
                    <div
                      className="top-5 mt-5 flex w-full flex-row place-content-center gap-2 whitespace-nowrap border-2 border-white p-3 hover:cursor-pointer hover:opacity-60 hover:ease-in"
                      onClick={openRegister}
                    >
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
