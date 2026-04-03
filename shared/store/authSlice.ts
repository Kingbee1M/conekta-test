import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';

interface Store {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  address: string;
  status: string;
}

interface UserData {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
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
      // Cast the action to our custom RehydrateAction
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