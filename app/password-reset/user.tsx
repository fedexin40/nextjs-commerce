'use client';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { Login, setPassword } from 'actions/user';
import clsx from 'clsx';
import { permanentRedirect } from 'next/navigation';
import { useTransition } from 'react';
import { useError, useErrorMessage, usePersonActions } from 'stores/user';

export default function User({ email, token }: { email: string; token: string }) {
  const [isPending, startTransition] = useTransition();
  const ErrorMessage = useErrorMessage();
  const isError = useError();
  const { closeError, openError, setErrorMessage } = usePersonActions();

  async function passwordReset(formData: FormData) {
    startTransition(async () => {
      const rawFormData = {
        password: formData.get('password')?.toString() || '',
        password2: formData.get('password2')?.toString() || '',
      };
      if (rawFormData.password2 != rawFormData.password) {
        setErrorMessage('Las contaseñas no coinciden');
        openError();
        return;
      }
      const error = await setPassword({
        email: email,
        password: rawFormData.password,
        token: token,
      });
      if (error) {
        openError();
        setErrorMessage(error);
        return;
      }
      await Login({ email: email, password: rawFormData.password });
      permanentRedirect('/home');
    });
  }

  return (
    <div>
      <div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isError}
          autoHideDuration={6000}
          onClose={closeError}
        >
          <Alert onClose={closeError} severity="error" variant="filled" sx={{ width: '100%' }}>
            {ErrorMessage}
          </Alert>
        </Snackbar>
      </div>
      <div className="my-16 lg:my-24">
        <div className="flex flex-row  place-content-center">
          <form className="w-56 lg:w-72" action={passwordReset}>
            <div className="mb-4 flex flex-row gap-x-2 border-b-2 border-[#d2b6ab] p-1">
              <input
                className="w-full bg-transparent pl-1 focus:ring-0 focus:ring-offset-0"
                type="password"
                name="password"
                placeholder="Escriba la nueva contraseña ..."
              />
            </div>
            <div className="flex flex-row gap-x-2 border-b-2 border-[#d2b6ab] p-1">
              <input
                className="w-full bg-transparent pl-1 focus:ring-0 focus:ring-offset-0"
                type="password"
                name="password2"
                placeholder="Repita la contraseña ..."
                autoComplete="on"
              />
            </div>
            <button
              className={clsx(
                'mt-10 h-10 w-full bg-[#d2b6ab] p-2 text-[13.5px] tracking-[1.4px] hover:opacity-60 lg:text-[14.3px]',
                {
                  'cursor-not-allowed opacity-60 hover:opacity-60': isPending,
                },
              )}
            >
              Reiniciar Contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
