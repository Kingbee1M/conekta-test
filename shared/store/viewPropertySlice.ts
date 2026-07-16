'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Shape of the detailed listing view requested
export interface ViewPropertyState {
  uuid: string;
  title: string;
  description: string;
  published_at: string;
  ref_no: string;
  purpose: string;
  property_info: {
    bedrooms: number | null;
    bathrooms: number | null;
    structure: string;
  } | null;
  location: {
    street: string;
    city: string;
    state: string;
    lga: string;
    country: string;
  } | null;
  fees: Array<{
    fee: string;
    frequency: string;
    fee_type: string;
  }>;
  base_price: string;
  payment_frequency: string;
  verification_status: string;
  listing_status: string;
  media: Array<{
    name: string;
    url: string;
    media_type: string;
    is_primary: boolean;
    sort_order: number;
  }>;
  average_rating: number;
  ratings_count: number;
  comments_count: number;
  user_rating: number;
}

const initialState: { currentView: ViewPropertyState | null } = {
  currentView: null,
};

export const viewPropertySlice = createSlice({
  name: 'viewProperty',
  initialState,
  reducers: {
    setViewProperty: (state, action: PayloadAction<ViewPropertyState>) => {
      state.currentView = action.payload;
    },
    clearViewProperty: (state) => {
      state.currentView = null;
    },
  },
});

export const { setViewProperty, clearViewProperty } = viewPropertySlice.actions;
export default viewPropertySlice.reducer;