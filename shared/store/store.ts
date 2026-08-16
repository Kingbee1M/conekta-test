import { configureStore, combineReducers, UnknownAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
// 1. Swap the old import for your custom SSR-safe storage
import storage from '@/lib/storage';
import authReducer from './authSlice';
import listingReducer from './listingSlice';
import viewListingREducer from './viewPropertySlice';
import adminCustomerReducer from './admincustomerSlice';
import cookieReducer from './acceptCookieSlice'; 
import listerReducer from './adminListerSlice';
import adminListingReducer from './adminListingSlice';
import adminUserReducer from './adminUsersSlice';
import customerListingReducer from './customerListingSlice';
import publicKYCReducer from './publicKycSlice'
import { apiSlice } from '@/lib/api';
import { resetStore } from './actions';

const appReducer = combineReducers({
  auth: authReducer,
  listing: listingReducer,
  listingView: viewListingREducer,
  cookieConsent: cookieReducer,
  adminCustomer: adminCustomerReducer,
  adminLister: listerReducer,
  adminListing: adminListingReducer,
  adminUsers: adminUserReducer,
  customerListing: customerListingReducer,
  publicKyc: publicKYCReducer,
  [apiSlice.reducerPath]: apiSlice.reducer, 
});

// Master reducer to handle store resets across all slices & redux-persist
const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: UnknownAction) => {
  if (action.type === resetStore.type) {
    // Setting state to undefined resets all slice states and purges redux-persist state
    state = undefined;
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: 'conketa_root',
  storage,
  whitelist: ['auth', 'cookieConsent', 'listing', 'listingView', 'adminCustomer', 'adminLister', 'adminListing', 'adminUsers', 'customerListing', 'publicKyc'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Essential for Redux Persist
      }).concat(apiSlice.middleware),
  });
};

// Types for your hooks
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];