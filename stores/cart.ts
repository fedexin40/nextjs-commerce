'use client';

import { create } from 'zustand';

interface cart {
  isOpen: boolean;
  actions: {
    openMenu: () => void;
    closeMenu: () => void;
  };
}

const cartStore = create<cart>()((set) => ({
  isOpen: false,
  actions: {
    openMenu: () => set({ isOpen: true }),
    closeMenu: () => set({ isOpen: false }),
  },
}));

export const cartActions = () => cartStore((state) => state.actions);
export const useCartOpen = () => cartStore((state) => state.isOpen);
