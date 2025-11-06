import { order as orderType } from 'lib/types';
import { create } from 'zustand';

interface menu {
  addressMenu: boolean;
  historyMenu: boolean;
  orderMenu: boolean;
  order?: orderType | undefined;
  actions: {
    showAddressMenu: () => void;
    showHistoryMenu: () => void;
    showOrderMenu: () => void;
    // eslint-disable-next-line no-unused-vars
    setOrder: (order: orderType) => void;
  };
}

interface User {
  Login: boolean;
  Register: boolean;
  ResetPassword: boolean;
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
    openResetPassword: () => void;
    closeResetPassword: () => void;
    isLoading: () => void;
    isNotLoading: () => void;
  };
}

interface userMenu {
  isOpen: boolean;
  actions: {
    openMenu: () => void;
    closeMenu: () => void;
  };
}

interface userDetails {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  email: string;
  phone: string;
  postalCode: string;
  countryArea: string;
  password?: string;
}

interface user extends userDetails {
  actions: {
    // eslint-disable-next-line no-unused-vars
    setUserDetails: (user: userDetails) => void;
  };
}

const useUserMenuStore = create<userMenu>()((set) => ({
  isOpen: false,
  actions: {
    openMenu: () => set({ isOpen: true }),
    closeMenu: () => set({ isOpen: false }),
  },
}));

const useUserDetails = create<user>()((set) => ({
  firstName: '',
  lastName: '',
  streetAddress1: '',
  streetAddress2: '',
  city: '',
  countryArea: '',
  email: '',
  phone: '',
  postalCode: '',
  password: '',
  actions: {
    setUserDetails: (user: userDetails) =>
      set({
        firstName: user.firstName,
        lastName: user.lastName,
        streetAddress1: user.streetAddress1,
        streetAddress2: user.streetAddress2,
        city: user.city,
        email: user.email,
        phone: user.phone,
        postalCode: user.postalCode,
        countryArea: user.countryArea,
        password: user.password,
      }),
  },
}));

const usePersonStore = create<User>()((set) => ({
  Login: false,
  Register: false,
  ResetPassword: false,
  Error: false,
  ErrorMessage: '',
  Loading: false,
  actions: {
    openError: () => set({ Error: true }),
    closeError: () => set({ Error: false }),
    setErrorMessage: (message) => set({ ErrorMessage: message }),
    openLogin: () => set({ Login: true, Register: false, ResetPassword: false }),
    closeLogin: () => set({ Login: false }),
    openRegister: () => set({ Register: true, Login: false, ResetPassword: false }),
    closeRegister: () => set({ Register: false }),
    openResetPassword: () => set({ Register: false, Login: false, ResetPassword: true }),
    closeResetPassword: () => set({ ResetPassword: false }),
    isLoading: () => set({ Loading: true }),
    isNotLoading: () => set({ Loading: false }),
  },
}));

const MenuStore = create<menu>()((set) => ({
  addressMenu: true,
  historyMenu: false,
  orderMenu: false,
  order: undefined,
  actions: {
    showAddressMenu: () => set({ addressMenu: true, historyMenu: false, orderMenu: false }),
    showHistoryMenu: () => set({ historyMenu: true, addressMenu: false, orderMenu: false }),
    showOrderMenu: () => set({ historyMenu: false, addressMenu: false, orderMenu: true }),
    setOrder: (order: orderType) => set({ order: order }),
  },
}));

export const useLogin = () => usePersonStore((state) => state.Login);
export const useRegister = () => usePersonStore((state) => state.Register);
export const useResetPassword = () => usePersonStore((state) => state.ResetPassword);
export const useError = () => usePersonStore((state) => state.Error);
export const useErrorMessage = () => usePersonStore((state) => state.ErrorMessage);
export const useLoading = () => usePersonStore((state) => state.Loading);
export const usePersonActions = () => usePersonStore((state) => state.actions);
export const useUserMenuActions = () => useUserMenuStore((state) => state.actions);
export const useUserDetailsActions = () => useUserDetails((state) => state.actions);
export const useOpen = () => useUserMenuStore((state) => state.isOpen);
export const useUser = () => useUserDetails((state) => state);

// Below exports are for use Login
export const useMenuActions = () => MenuStore((state) => state.actions);
export const useAddressMenu = () => MenuStore((state) => state.addressMenu);
export const useHistoryMenu = () => MenuStore((state) => state.historyMenu);
export const useOrder = () => MenuStore((state) => state.order);
export const useOrderMenu = () => MenuStore((state) => state.orderMenu);
