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

export default function tasksReducer(tasks: Tasks, action: actionState) {
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
    default:
      return {
        showLogin: false,
        showRegister: false,
        showRegisterMsg: false,
        showUserLogged: false
      };
  }
}
