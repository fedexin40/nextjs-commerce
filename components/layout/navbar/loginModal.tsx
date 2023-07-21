import { Dialog } from '@headlessui/react';
import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CloseIcon from 'components/icons/close';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { registeraccount } from 'lib/saleor';
import AlertMessage from 'components/common/alert';

interface RegisterFormData {
  email: string;
  password: string;
}

export default function LoginModal({
  isOpen,
  onClose,
  RegisterSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  RegisterSuccess: () => void;
}) {
  const { register: registerForm, handleSubmit: handleSubmitForm } = useForm<RegisterFormData>({});

  function handleClose() {
    setError(false);
  }

  const [errorMessage, setErrorMessage] = React.useState('');
  const [error, setError] = React.useState(false);

  const handleRegister = handleSubmitForm(async (formData: RegisterFormData) => {
    let UserCreationError: any = '';
    try {
      await registeraccount(
        formData.email,
        formData.password,
        'http://localhost:3000/account/confirm'
      );
    } catch (e) {
      UserCreationError = e;
      setErrorMessage(String(UserCreationError));
      setError(true);
    }
    if (!UserCreationError) {
      onClose();
      RegisterSuccess();
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
            handleClose={handleClose}
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
                <p className="text-lg font-bold">Registrarse</p>
                <button
                  aria-label="Close login"
                  onClick={onClose}
                  className="text-black transition-colors"
                >
                  <CloseIcon className="h-7" />
                </button>
              </div>
              <div className="md:p10 flex p-5 pt-10">
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
                      onClick={handleRegister}
                      type="submit"
                    >
                      Registrarse
                    </button>
                  </Box>
                  <Linethrough text={'o'} />
                  <div className="grid grid-cols-1 gap-4 pt-5">
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
    <div className="grid grid-cols-3 grid-rows-2 pt-5">
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
