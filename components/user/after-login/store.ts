import { create } from 'zustand';

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
  postalCode: string;
  city: string;
  countryArea: string;
  email: string;
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
  postalCode: '',
  city: '',
  countryArea: '',
  email: '',
  actions: {
    setUserDetails: (user: userDetails) =>
      set({
        firstName: user.firstName,
        lastName: user.lastName,
        streetAddress1: user.streetAddress1,
        streetAddress2: user.streetAddress2,
        postalCode: user.postalCode,
        city: user.city,
        countryArea: user.countryArea,
        email: user.email,
      }),
  },
}));

export const useOpen = () => useUserMenuStore((state) => state.isOpen);
export const useUserMenuActions = () => useUserMenuStore((state) => state.actions);
export const useUserDetailsActions = () => useUserDetails((state) => state.actions);
export const useUser = () => useUserDetails((state) => state);
