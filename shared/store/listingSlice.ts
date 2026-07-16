'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Listing } from '@/types';

interface ListingState {
  propertiesList: Listing[];
}

const initialState: ListingState = {
  propertiesList: [],
};

export const listingSlice = createSlice({
  name: 'listing',
  initialState,
  reducers: {
    setProperties: (state, action: PayloadAction<Listing[]>) => {
      state.propertiesList = action.payload;
    },
    clearProperties: (state) => {
      state.propertiesList = [];
    },
  },
});

export const { setProperties, clearProperties } = listingSlice.actions;
export default listingSlice.reducer;