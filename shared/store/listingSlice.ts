'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrencyEnum, StructureEnum } from '@/types';

// 1. Structure the shape of a draft object still in production by the user
export interface ListingDraftState {
  title: string;
  currency: CurrencyEnum;
  amount: string;
  property_info: {
    bedrooms: number | null;
    bathrooms: number | null;
    structure: StructureEnum;
  };
  location: {
    street: string;
    city: string;
    state: number | null;
    lga: number | null;
    country: string;
  };
}


interface ListingUIState {
  selectedListingUuids: string[];
  
  // Grid layout config state options
  gridSize: 3 | 4 | 5;
  sortBy: 'Newest' | 'Price: Low to High' | 'Price: High to Low' | 'Most Popular';
  
  // Search parameters
  searchQuery: string;
  structureFilter: StructureEnum | 'all';

  // Active form wizard memory storage
  activeDraft: ListingDraftState | null;
}

const initialState: ListingUIState = {
  selectedListingUuids: [],
  gridSize: 3,
  sortBy: 'Newest',
  searchQuery: '',
  structureFilter: 'all',
  activeDraft: null,
};

export const listingSlice = createSlice({
  name: 'listingUI',
  initialState,
  reducers: {
    // --- Selection Reducers ---
    setSelectedListingUuids: (state, action: PayloadAction<string[]>) => {
      state.selectedListingUuids = action.payload;
    },
    clearSelection: (state) => {
      state.selectedListingUuids = [];
    },

    // --- Layout & View State Reducers ---
    setGridSize: (state, action: PayloadAction<3 | 4 | 5>) => {
      state.gridSize = action.payload;
    },
    setSortBy: (state, action: PayloadAction<ListingUIState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setStructureFilter: (state, action: PayloadAction<StructureEnum | 'all'>) => {
      state.structureFilter = action.payload;
    },

    // --- Draft Management Reducers ---
    updateDraft: (state, action: PayloadAction<Partial<ListingDraftState>>) => {
      if (!state.activeDraft) {
        state.activeDraft = {
          title: '',
          currency: CurrencyEnum.NGN,
          amount: '',
          property_info: { bedrooms: null, bathrooms: null, structure: StructureEnum.FLAT },
          location: { street: '', city: '', state: null, lga: null, country: 'Nigeria' }
        };
      }
      state.activeDraft = { ...state.activeDraft, ...action.payload };
    },
    clearDraft: (state) => {
      state.activeDraft = null;
    },

    // --- Core Master Reset Reset Trigger ---
    resetFilters: (state) => {
      state.searchQuery = '';
      state.structureFilter = 'all';
      state.sortBy = 'Newest';
    },
  },
});

export const {
  setSelectedListingUuids,
  clearSelection,
  setGridSize,
  setSortBy,
  setSearchQuery,
  setStructureFilter,
  updateDraft,
  clearDraft,
  resetFilters,
} = listingSlice.actions;

export default listingSlice.reducer;