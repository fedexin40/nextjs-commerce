'use client';

import { Dispatch, createContext, useReducer } from 'react';

const initialTasks = {
  showLogin: false,
  showRegister: false,
  showRegisterMsg: false,
  showUserLogged: false
};

export const TasksContext = createContext<Tasks>(initialTasks);
export const TasksDispatchContext = createContext<Dispatch<actionState>>(() => null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>{children}</TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export enum Action {
  showLogin = 'showLogin',
  showRegister = 'showRegister',
  showLoginMsg = 'showLoginMsg',
  showRegisterMsg = 'showRegisterMsg',
  showUserLogged = 'showUserLogged',
  hiddenLogin = 'hiddenLogin',
  hidddenRegister = 'hidddenRegister',
  hiddenLoginMsg = 'hiddenLoginMsg',
  hiddenRegisterMsg = 'hiddenRegisterMsg',
  hiddenUserLogged = 'hiddenUserLogged'
}

interface actionState {
  type: Action;
}

interface Tasks {
  showLogin: boolean;
  showRegister: boolean;
  showRegisterMsg: boolean;
  showUserLogged: boolean;
}

function tasksReducer(tasks: Tasks, action: actionState) {
  switch (action.type) {
    case Action.showLogin: {
      return {
        ...tasks,
        showLogin: true,
        showRegister: false,
        showRegisterMsg: false
      };
    }
    case Action.showRegister: {
      return {
        ...tasks,
        showLogin: false,
        showRegister: true,
        showRegisterMsg: false
      };
    }
    case Action.showRegisterMsg: {
      return {
        ...tasks,
        showLogin: false,
        showRegister: false,
        showRegisterMsg: true
      };
    }
    case Action.showUserLogged: {
      return {
        ...tasks,
        showUserLogged: true
      };
    }
    case Action.hiddenUserLogged: {
      return {
        ...tasks,
        showUserLogged: false
      };
    }
    default: {
      return {
        ...tasks,
        showLogin: false,
        showRegister: false,
        showRegisterMsg: false
      };
    }
  }
}
