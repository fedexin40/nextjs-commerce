'use client';

import { create } from 'zustand';

interface loadMore {
  currentPageNumber: number;
  endCursor: string;
  startCursor: string;
  sortKey: string;
  actions: {
    resetPageNumber: () => void;
    increasePageNumber: () => void;
    setEndCursor: (endCursor: string) => void;
    setStartCursor: (startCursor: string) => void;
    setSortKey: (sortKey: string) => void;
  };
}

const loadMoreStore = create<loadMore>()((set) => ({
  currentPageNumber: 1,
  endCursor: '',
  startCursor: '',
  sortKey: '',
  actions: {
    resetPageNumber: () => set(() => ({ currentPageNumber: 1 })),
    increasePageNumber: () => set((state) => ({ currentPageNumber: state.currentPageNumber + 1 })),
    setEndCursor: (cursor) => set({ endCursor: cursor }),
    setStartCursor: (cursor) => set({ startCursor: cursor }),
    setSortKey: (sortKey) => set({ sortKey: sortKey }),
  },
}));

export const useLoadMore = () => loadMoreStore((state) => state);
export const useLoadMoreActions = () => loadMoreStore((state) => state.actions);
