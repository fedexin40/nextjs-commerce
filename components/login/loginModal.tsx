import { Dialog } from '@headlessui/react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import AlertMessage from 'components/common/alert';
import CloseIcon from 'components/icons/close';
import { AnimatePresence, motion } from 'framer-motion';
import { tokencreate } from 'lib/saleor';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { useForm } from 'react-hook-form';

interface RegisterFormData {
  email: string;
  password: string;
}

export default function LoginModal({
  isOpen,
  onClose,
  register
}: {
  isOpen: boolean;
  onClose: () => void;
  register: () => void;
}) {
  const { register: registerForm, handleSubmit: handleSubmitForm } = useForm<RegisterFormData>({});
  const [errorMessage, setErrorMessage] = React.useState('');
  const [error, setError] = React.useState(false);

  const handleLogin = handleSubmitForm(async (formData: RegisterFormData) => {
    try {
      let token = await tokencreate(formData.email, formData.password);
      let accessToken = token?.token;
      let refreshToken = token?.refreshToken;
      if (token) {
        await fetch('/api/login', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            accessToken,
            refreshToken,
            operation: 'set-token'
          })
        });
      }
      onClose();
    } catch (e) {
      setErrorMessage('Creedenciales Invalidas');
      setError(true);
    }
  });

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <Dialog
          as={motion.div}
          initial="closed"
          animate="open"
          exit="closed"
          key="dialog"
          open={isOpen}
          onClose={onClose}
          className="relative z-50"
        >
          <motion.div
            variants={{
              open: { opacity: 1, backdropFilter: 'blur(0.5px)' },
              closed: { opacity: 0, backdropFilter: 'blur(0px)' }
            }}
            className="fixed inset-0 bg-black/30"
            aria-hidden="true"
          />
          <AlertMessage
            severity="error"
            open={error}
            message={errorMessage}
            handleClose={() => setError(false)}
          />
          <div className="fixed inset-0 flex justify-end">
            <Dialog.Panel
              as={motion.div}
              variants={{
                open: { translateX: 0 },
                closed: { translateX: '100%' }
              }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="flex w-full flex-col bg-white p-8 text-black md:w-3/5 lg:w-2/5"
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">Iniciar sesion</p>
                <button
                  aria-label="Close login"
                  onClick={onClose}
                  className="text-black transition-colors"
                >
                  <CloseIcon className="h-7" />
                </button>
              </div>
              <div className="md:p10 flex p-5 pt-3">
                <div className="flex flex-col	">
                  <Box
                    component="form"
                    sx={{
                      '& .MuiTextField-root': { m: 1 }
                    }}
                  >
                    <TextField
                      required
                      type="email"
                      label="Correo Electronico"
                      {...registerForm('email', {
                        required: true
                      })}
                      fullWidth
                    />
                    <TextField
                      required
                      label="Contraseña"
                      type="password"
                      {...registerForm('password', {
                        required: true
                      })}
                      fullWidth
                    />
                    <div className="p-3 text-sm text-slate-700">
                      Al continuar, usted acepta el Calendario Específico de Producto PSS de
                      Autoservicio y la
                      <Link
                        className="focus:text-primary-600 active:text-primary-700 text-blue-600 transition duration-150 ease-in-out hover:text-blue-400"
                        href="_blank"
                      >
                        &nbsp;Política de Privacidad
                      </Link>
                    </div>
                    <button
                      className="h-10 min-w-full rounded-xl bg-blue-700 text-white hover:opacity-60"
                      onClick={handleLogin}
                      type="submit"
                    >
                      Iniciar sesion
                    </button>
                  </Box>
                  <button
                    className="mt-5 h-10 min-w-full rounded-xl bg-green-700 text-white hover:opacity-60"
                    onClick={register}
                    type="submit"
                  >
                    Registrarse
                  </button>
                  <Linethrough text={'o'} />
                  <div className="grid grid-cols-1 gap-4">
                    <ButtonSocial text={'Continuar con Google'} image={'/google-avatar.png'} />
                    <ButtonSocial text={'Continuar con Facebook'} image={'/facebook-avatar.png'} />
                    <ButtonSocial text={'Continuar con Apple'} image={'/apple-avatar.png'} />
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

function Linethrough({ text }: { text: string }) {
  return (
    <div className="grid grid-cols-3 grid-rows-2 p-3">
      <div className="border-b-2 border-black" />
      <div className="row-span-2 text-center">{text}</div>
      <div className="border-b-2 border-black" />
    </div>
  );
}

function ButtonSocial({ text, image }: { text: string; image: string }) {
  return (
    <button className="rounded-md border-2 border-blue-600 p-2 duration-300 ease-in-out hover:border-blue-400 hover:text-slate-400 hover:opacity-50">
      <div className="grid grid-cols-5 grid-rows-1">
        <Image className="justify-self-center" src={image} alt={text} width={25} height={25} />
        <div className="col-span-4	text-left">{text}</div>
      </div>
    </button>
  );
}
