import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import cookieReducer from './acceptCookieSlice';
import { apiSlice } from '@/lib/api';

const rootReducer = combineReducers({
  auth: authReducer,
  cookieConsent: cookieReducer,
  [apiSlice.reducerPath]: apiSlice.reducer, 
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cookieConsent'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(apiSlice.middleware),
  });
};