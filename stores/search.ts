'use client';

import { create } from 'zustand';

interface search {
  isOpen: boolean;
  actions: {
    openMenu: () => void;
    closeMenu: () => void;
  };
}

const searchStore = create<search>()((set) => ({
  isOpen: false,
  actions: {
    openMenu: () => set({ isOpen: true }),
    closeMenu: () => set({ isOpen: false }),
  },
}));

export const searchActions = () => searchStore((state) => state.actions);
export const useSearch = () => searchStore((state) => state.isOpen);
