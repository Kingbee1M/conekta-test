import { createSlice } from '@reduxjs/toolkit';

interface CookieState {
  hasAccepted: boolean;
}

const initialState: CookieState = {
  hasAccepted: false,
};

const acceptCookieSlice = createSlice({
  name: 'cookieConsent',
  initialState: {
    hasAccepted: false,
    sessionHidden: false,
  },
  reducers: {
    acceptCookies: (state) => {
      state.hasAccepted = true;
    },
    hideForSession: (state) => {
      state.sessionHidden = true;
    },
    resetCookieConsent: (state) => {
      state.hasAccepted = false;
    },
  },
});

export const {acceptCookies, hideForSession, resetCookieConsent } = acceptCookieSlice.actions;
export default acceptCookieSlice.reducer;