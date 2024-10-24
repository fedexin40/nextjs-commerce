'use client';

import { create } from 'zustand';

interface loadMore {
  currentPageNumber: number;
  cursor: string;
  actions: {
    increasePageNumber: () => void;
    setCursor: (cursor: string) => void;
  };
}

const loadMoreStore = create<loadMore>()((set) => ({
  currentPageNumber: 1,
  cursor: '',
  actions: {
    increasePageNumber: () => set((state) => ({ currentPageNumber: state.currentPageNumber + 1 })),
    setCursor: (cursor) => set({ cursor: cursor }),
  },
}));

export const useLoadMore = () => loadMoreStore((state) => state);
export const useLoadMoreActions = () => loadMoreStore((state) => state.actions);
