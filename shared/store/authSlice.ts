import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';

// 1. NESTED SUB-STRUCTURE INTERFACES
interface Store {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  address: string;
  status: string;
}

interface UserProfile {
  first_name: string
  last_name: string
}


interface InnerUserData {
  uuid: string;
  email: string;
  other_roles: string[];
  profile: UserProfile;
}

 export interface UserData {
  active_role: string;
  kyc_verified: boolean;
  email_verified: boolean;
  user: InnerUserData;
  store: Store | null;
}

interface AuthState {
  user: UserData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  isAuthenticated: boolean;
}

interface PersistPayload {
  auth?: AuthState;
}

interface RehydrateAction extends Action {
  type: typeof REHYDRATE;
  payload?: PersistPayload;
}

// 3. INITIAL STATE
const initialState: AuthState = {
  user: null,
  status: 'idle',
  isAuthenticated: false,
};

// 4. THE SLICE
export const authSlice = createSlice({
  name: 'auth',
  initialState, 
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      state.status = 'succeeded';
      state.isAuthenticated = true;
    },
    clearUserInfo: (state) => {
      state.user = null;
      state.status = 'idle';
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action) => {
      const rehydrateAction = action as RehydrateAction;
      const persistedAuth = rehydrateAction.payload?.auth;
      
      if (persistedAuth?.user) {
        state.user = persistedAuth.user;
        state.isAuthenticated = true;
        state.status = 'succeeded';
      }
    });
  },
});

export const { setUserInfo, clearUserInfo } = authSlice.actions;
export default authSlice.reducer;