import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
// 1. Swap the old import for your custom SSR-safe storage
import storage from '@/lib/storage';
import authReducer from './authSlice';
import cookieReducer from './acceptCookieSlice'; 
import { apiSlice } from '@/lib/api';

const rootReducer = combineReducers({
  auth: authReducer,
  cookieConsent: cookieReducer, 
  [apiSlice.reducerPath]: apiSlice.reducer, 
});

const persistConfig = {
  key: 'conketa_root', // Giving it a unique key for your project
  storage, // 2. This now uses your SSR-safe logic from storage.ts
  whitelist: ['auth', 'cookieConsent'], 
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