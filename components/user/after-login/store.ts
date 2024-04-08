import { create } from 'zustand';

interface userMenu {
  isOpen: boolean;
  actions: {
    openMenu: () => void;
    closeMenu: () => void;
  };
}

const useUserMenuStore = create<userMenu>()((set) => ({
  isOpen: false,
  actions: {
    openMenu: () => set({ isOpen: true }),
    closeMenu: () => set({ isOpen: false }),
  },
}));

export const useOpen = () => useUserMenuStore((state) => state.isOpen);
export const useUserMenuActions = () => useUserMenuStore((state) => state.actions);
