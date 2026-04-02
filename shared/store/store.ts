import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import cookieReducer from './acceptCookieSlice'; // 1. Import your new slice
import { apiSlice } from '@/lib/api';

const rootReducer = combineReducers({
  auth: authReducer,
  cookieConsent: cookieReducer, // 2. Add it to the reducer map
  [apiSlice.reducerPath]: apiSlice.reducer, 
});

const persistConfig = {
  key: 'root',
  storage,
  // 3. Whitelist both so they stay alive on page refresh
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

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Types remain the same...