import { create } from 'zustand';

interface User {
  Login: boolean;
  Register: boolean;
  Error: boolean;
  ErrorMessage: string;
  Loading: boolean;
  actions: {
    // eslint-disable-next-line no-unused-vars
    setErrorMessage: (message: string) => void;
    closeError: () => void;
    openError: () => void;
    openLogin: () => void;
    closeLogin: () => void;
    openRegister: () => void;
    closeRegister: () => void;
    isLoading: () => void;
    isNotLoading: () => void;
  };
}

const usePersonStore = create<User>()((set) => ({
  Login: false,
  Register: false,
  Error: false,
  ErrorMessage: '',
  Loading: false,
  actions: {
    openError: () => set({ Error: true }),
    closeError: () => set({ Error: false }),
    setErrorMessage: (message) => set({ ErrorMessage: message }),
    openLogin: () => set({ Login: true, Register: false }),
    closeLogin: () => set({ Login: false }),
    openRegister: () => set({ Register: true, Login: false }),
    closeRegister: () => set({ Register: false }),
    isLoading: () => set({ Loading: true }),
    isNotLoading: () => set({ Loading: false }),
  },
}));

export const useLogin = () => usePersonStore((state) => state.Login);
export const useRegister = () => usePersonStore((state) => state.Register);
export const useError = () => usePersonStore((state) => state.Error);
export const useErrorMessage = () => usePersonStore((state) => state.ErrorMessage);
export const useLoading = () => usePersonStore((state) => state.Loading);
export const usePersonActions = () => usePersonStore((state) => state.actions);
