import { shippingMethod } from 'lib/types';
import { create } from 'zustand';

interface shippingStore {
  shippingMethods: shippingMethod[];
  selectedShippingId: string;
  actions: {
    // eslint-disable-next-line no-unused-vars
    setSelectedShippingId: (shippingId: string) => void;
    // eslint-disable-next-line no-unused-vars
    setShippingMethods: (shippingMethods: shippingMethod[]) => void;
  };
}

const useShippingStore = create<shippingStore>()((set) => ({
  shippingMethods: [],
  selectedShippingId: '',
  actions: {
    setSelectedShippingId: (shippingId) => set({ selectedShippingId: shippingId }),
    setShippingMethods: (shippingMethods) => set({ shippingMethods: shippingMethods }),
  },
}));

export const useShipping = () => useShippingStore((state) => state);
export const useShippingActions = () => useShippingStore((state) => state.actions);
