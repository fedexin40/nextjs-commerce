'use client';

import { create } from 'zustand';

interface userMenu {
  isOpen: boolean;
  actions: {
    openMenu: () => void;
    closeMenu: () => void;
  };
}

interface userDetailsPostalCode {
  postalCode: string;
  actions: {
    // eslint-disable-next-line no-unused-vars
    setPostalCode: (postalCode: string) => void;
  };
}

interface userDetailsCountryArea {
  countryArea: string;
  actions: {
    // eslint-disable-next-line no-unused-vars
    setCountryArea: (countryArea: string) => void;
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
}

export interface user extends userDetails {
  actions: {
    // eslint-disable-next-line no-unused-vars
    setUserDetails: (user: userDetails) => void;
  };
}

const useUserPostalCode = create<userDetailsPostalCode>()((set) => ({
  postalCode: '',
  actions: {
    setPostalCode: (postalCode: string) => set({ postalCode: postalCode }),
  },
}));

const useUserCountryArea = create<userDetailsCountryArea>()((set) => ({
  countryArea: '',
  actions: {
    setCountryArea: (countryArea: string) => set({ countryArea: countryArea }),
  },
}));

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
      }),
  },
}));

export const usePostalCodeActions = () => useUserPostalCode((state) => state.actions);
export const useCountryAreaActions = () => useUserCountryArea((state) => state.actions);
export const useUserMenuActions = () => useUserMenuStore((state) => state.actions);
export const useUserDetailsActions = () => useUserDetails((state) => state.actions);
export const useCountryArea = () => useUserCountryArea((state) => state);
export const usePostalCode = () => useUserPostalCode((state) => state);
export const useOpen = () => useUserMenuStore((state) => state.isOpen);
export const useUser = () => useUserDetails((state) => state);
