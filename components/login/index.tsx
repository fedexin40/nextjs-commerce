'use client';

import AlertMessage from 'components/common/alert';
import Image from 'next/image';
import { useEffect, useReducer } from 'react';
import LoginModal from './loginModal';
import RegisterModal from './registerModal';
import tasksReducer, { Action } from './taskReducer';
import UserMenu from './userMenu';

export default function Login() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  useEffect(() => {
    const getData = async () => {
      const result = await fetch('http://localhost:3000/api/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operation: 'isloggin'
        })
      });
      const token = await result.json();
      if (token.isloggin) {
        dispatch({ type: Action.showUserLogged });
      } else {
        dispatch({ type: Action.hiddenUserLogged });
      }
    };
    getData();
  }, [tasks.showLogin]);

  return (
    <>
      {tasks.showLogin ? (
        <LoginModal
          isOpen={tasks.showLogin}
          onClose={() => dispatch({ type: Action.hiddenLogin })}
          register={() => dispatch({ type: Action.showRegister })}
        />
      ) : (
        <div />
      )}
      {tasks.showRegister ? (
        <RegisterModal
          DisplayMsgRegisterOk={() => dispatch({ type: Action.showRegisterMsg })}
          isOpen={tasks.showRegister}
          onClose={() => dispatch({ type: Action.hidddenRegister })}
          login={() => dispatch({ type: Action.showLogin })}
        />
      ) : (
        <div />
      )}
      <AlertMessage
        severity="success"
        open={tasks.showRegisterMsg}
        message="El usuario fue creado exitosamente, revisa tu correo para activar tu cuenta"
        handleClose={() => dispatch({ type: Action.hiddenRegisterMsg })}
      />
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

const initialTasks = {
  showLogin: false,
  showRegister: false,
  showRegisterMsg: false,
  showUserLogged: false
};
