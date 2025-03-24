import { shippingMethod } from 'lib/types';
import { create } from 'zustand';

interface shippingStore {
  shippingMethods: shippingMethod[];
  selectedShippingId: string;
  CarrierName: string;
  shippingCost: number;
  actions: {
    // eslint-disable-next-line no-unused-vars
    setSelectedShippingId: (shippingId: string, CarrierName: string, shippingCost: number) => void;
    // eslint-disable-next-line no-unused-vars
    setShippingMethods: (shippingMethods: shippingMethod[]) => void;
    reset: () => void;
  };
}

const useShippingStore = create<shippingStore>()((set) => ({
  shippingMethods: [],
  selectedShippingId: '',
  shippingCost: 0,
  CarrierName: '',
  actions: {
    setSelectedShippingId: (shippingId, CarrierName, shippingCost) =>
      set({
        selectedShippingId: shippingId,
        CarrierName: CarrierName,
        shippingCost: shippingCost,
      }),
    setShippingMethods: (shippingMethods) => set({ shippingMethods: shippingMethods }),
    reset: () => {
      set({
        selectedShippingId: undefined,
        CarrierName: undefined,
        shippingCost: undefined,
      });
    },
  },
}));

export const useShipping = () => useShippingStore((state) => state);
export const useShippingActions = () => useShippingStore((state) => state.actions);
