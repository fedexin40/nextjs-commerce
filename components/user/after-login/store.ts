'use client';

import { create } from 'zustand';

interface userMenu {
  isOpen: boolean;
  actions: {
    openMenu: () => void;
    closeMenu: () => void;
  };
}

export interface userDetails {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  email: string;
  phone: string;
  postalCode: string;
  countryArea: string;
}

export interface user extends userDetails {
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
      }),
  },
}));

export const useUserMenuActions = () => useUserMenuStore((state) => state.actions);
export const useUserDetailsActions = () => useUserDetails((state) => state.actions);
export const useOpen = () => useUserMenuStore((state) => state.isOpen);
export const useUser = () => useUserDetails((state) => state);
