'use client';

import { Dialog, Transition } from '@headlessui/react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { resetPassword } from 'actions/user';
import { clsx } from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Fragment, ReactNode, useRef } from 'react';
import {
  useError,
  useErrorMessage,
  useLoading,
  usePersonActions,
  useResetPassword,
} from 'stores/user';
import CloseRegister from './close-register';

export default function ResetPasswordModal({ children }: { children: ReactNode }) {
  const ErrorMessage = useErrorMessage();
  const isError = useError();
  const isOpen = useResetPassword();
  const Loading = useLoading();
  const { openLogin } = usePersonActions();
  const { closeResetPassword } = usePersonActions();
  const { setErrorMessage } = usePersonActions();
  const { openError } = usePersonActions();
  const { closeError } = usePersonActions();
  const { isLoading } = usePersonActions();
  const { isNotLoading } = usePersonActions();
  const router = useRouter();
  const initialFocusRef = useRef(null);

  async function ResetPasswordAction(formData: FormData) {
    isLoading();
    const rawFormData = {
      email: formData.get('email')?.toString() || '',
    };

    const error = await resetPassword({
      email: rawFormData.email,
    });
    if (error) {
      setErrorMessage(error);
      openError();
    } else {
      closeResetPassword();
      router.push('/password-reset');
    }
    isNotLoading();
  }

  return (
    <div className="z-50">
      <Transition show={isOpen}>
        <Dialog
          onClose={() => closeResetPassword()}
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
            <Dialog.Panel className="fixed bottom-0 left-0 top-0 flex h-full w-3/4 flex-col border-l border-neutral-200 bg-white/80 text-black backdrop-blur-xl md:w-[390px]">
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
              <div className="flex h-full flex-col overflow-y-auto overflow-x-hidden text-[13px] tracking-widest lg:text-[14.3px]">
                <div className="relative">
                  <button
                    className="absolute right-5 top-5"
                    aria-label="Cerrar Reinicio de Contraseña"
                    onClick={closeResetPassword}
                  >
                    <CloseRegister />
                  </button>
                </div>
                <div className="mt-14 w-full text-center text-[13.5px] tracking-[1.4px] md:mt-20 lg:mt-8 lg:text-[14.3px]">
                  <div className="mt-4 text-[14px] tracking-widest lg:text-[15px]">
                    Reiniciar Contraseña
                  </div>
                </div>
                <div className="mx-10 mb-28 mt-10 flex flex-col md:my-20 lg:mb-20 lg:mt-7">
                  <div className="gap-y-4">
                    <form action={ResetPasswordAction} ref={initialFocusRef}>
                      <div className="mb-10 text-center text-xs tracking-wider text-slate-500 lg:mb-14">
                        Ingresa tu correo electrónico. Te haremos llegar un correo a la dirección
                        proporcionada con los detalles necesarios para recuperar la contraseña
                      </div>
                      <div className="mb-10 flex flex-row gap-x-2 border-b-2 border-[#d2b6ab] p-1">
                        <div className="relative grid h-5 w-5 place-content-center">
                          <Image
                            className="object-contain text-center"
                            src="/email.png"
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        <input
                          className="w-full bg-transparent pl-1 focus:ring-0 focus:ring-offset-0"
                          type="email"
                          name="email"
                          placeholder="Email..."
                        />
                      </div>
                      <button
                        type="submit"
                        className={clsx(
                          'h-10 w-full bg-[#d2b6ab] p-2 text-[13.5px]  tracking-[1.4px] hover:opacity-60 lg:text-[14.3px]',
                          {
                            'cursor-not-allowed opacity-60 hover:opacity-60': Loading,
                          },
                        )}
                      >
                        Reiniciar Contraseña
                      </button>
                    </form>
                  </div>
                </div>
                <div className="flex h-full justify-center bg-[#d2b6ab] pb-10">
                  <div className="mx-10 w-full">
                    <div
                      className="top-5 mt-5 flex w-full flex-row place-content-center gap-2 whitespace-nowrap border-2 border-white p-3 hover:cursor-pointer hover:opacity-60 hover:ease-in"
                      onClick={openLogin}
                    >
                      <div className="text-white ">¿Tienes una cuenta?</div>
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
