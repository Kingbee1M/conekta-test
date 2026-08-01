import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
// 1. Swap the old import for your custom SSR-safe storage
import storage from '@/lib/storage';
import authReducer from './authSlice';
import listingReducer from'./listingSlice'
import viewListingREducer from './viewPropertySlice'
import adminCustomerReducer from './admincustomerSlice'
import cookieReducer from './acceptCookieSlice'; 
import listerReducer from './adminListerSlice';
import adminListingReducer from './adminListingSlice'
import { apiSlice } from '@/lib/api';

const rootReducer = combineReducers({
  auth: authReducer,
  listing: listingReducer,
  listingView: viewListingREducer,
  cookieConsent: cookieReducer,
  adminCustomer: adminCustomerReducer,
  adminLister: listerReducer,
  adminListing: adminListingReducer,
  [apiSlice.reducerPath]: apiSlice.reducer, 
});

const persistConfig = {
  key: 'conketa_root',
  storage,
  whitelist: ['auth', 'cookieConsent', 'listing', 'listingView', 'adminCustomer', 'adminLister', 'adminListing',], 
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