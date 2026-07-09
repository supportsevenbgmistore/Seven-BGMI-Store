"use client";

import { create } from "zustand";

type FilterState = {
  availableOnly: boolean;
  setAvailableOnly: (value: boolean) => void;
};

export const useAccountFilters = create<FilterState>((set) => ({
  availableOnly: false,
  setAvailableOnly: (value) => set({ availableOnly: value })
}));
