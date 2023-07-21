'use client';

import Image from 'next/image';
import { useState } from 'react';
import LoginModal from './loginModal';
import AlertMessage from 'components/common/alert';

export default function Login() {
  const [LoginIsOpen, setLoginIsOpen] = useState(false);
  const [RegisterSuccess, setRegisterSuccess] = useState(false);

  function handleClose() {
    setRegisterSuccess(false);
  }

  return (
    <>
      {LoginIsOpen ? (
        <LoginModal
          RegisterSuccess={() => setRegisterSuccess(true)}
          isOpen={LoginIsOpen}
          onClose={() => setLoginIsOpen(false)}
        />
      ) : (
        <div />
      )}
      <AlertMessage
        severity="success"
        open={RegisterSuccess}
        message="El usuario fue creado exitosamente, revisa tu correo para activar tu cuenta"
        handleClose={handleClose}
      />
      <button
        onClick={() => {
          setLoginIsOpen(true);
        }}
      >
        <Image
          className="me-3 cursor-pointer rounded-full border-2 bg-yellow-300 hover:bg-yellow-500"
          src="/defaultUser.jpeg"
          alt="userProfileImage"
          width="40"
          height="40"
        />
      </button>
    </>
  );
}
