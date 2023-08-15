'use client';

import AlertMessage from 'components/common/alert';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { Action, TasksContext, TasksDispatchContext } from '../context';
import LoginModal from './loginModal';
import RegisterModal from './registerModal';
import UserMenu from './userMenu';

export default function LoginMenu() {
  const dispatch = useContext(TasksDispatchContext);
  const tasks = useContext(TasksContext);
  const router = useRouter();

  useEffect(() => {
    const getlogin = async () => {
      let accessToken = await fetch('/api/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operation: 'getToken'
        })
      });
      accessToken = await accessToken.json();
      if (accessToken.accessToken) {
        dispatch({ type: Action.showUserLogged });
      }
      router.refresh();
    };
    getlogin();
  }, [tasks.showUserLogged]);

  return (
    <>
      <AlertMessage
        severity="success"
        open={tasks.showRegisterMsg}
        message="El usuario fue creado exitosamente, revisa tu correo para activar tu cuenta"
        handleClose={() => dispatch({ type: Action.hiddenRegisterMsg })}
      />
      {tasks.showLogin ? <LoginModal isOpen={tasks.showLogin} /> : <div />}
      {tasks.showRegister ? <RegisterModal isOpen={tasks.showRegister} /> : <div />}
      {tasks.showUserLogged ? (
        <UserMenu />
      ) : (
        <button
          onClick={() => {
            dispatch({ type: Action.showLogin });
          }}
        >
          <Image
            className="me-3 cursor-pointer rounded-full hover:scale-110"
            src="/defaultUser.jpeg"
            alt="userProfileImage"
            width="40"
            height="40"
          />
        </button>
      )}
    </>
  );
}
