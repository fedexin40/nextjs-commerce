import { create } from 'zustand';

interface User {
  Login: boolean;
  Register: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  openRegister: () => void;
  closeRegister: () => void;
}

export const usePersonStore = create<User>()((set) => ({
  Login: false,
  Register: false,
  openLogin: () => set({ Login: true, Register: false }),
  closeLogin: () => set({ Login: false }),
  openRegister: () => set({ Register: true, Login: false }),
  closeRegister: () => set({ Register: false }),
}));
