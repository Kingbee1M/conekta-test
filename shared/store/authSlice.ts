import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Pro-tip: Capitalize Interface names for clarity
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

const initialState: AuthState = {
  user: null,
  status: 'idle',
  isAuthenticated: false,
};

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
});

export const { setUserInfo, clearUserInfo } = authSlice.actions;
export default authSlice.reducer;