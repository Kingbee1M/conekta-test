import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { RoleEnum } from '../enums/roles.enum';

interface InnerLoginUser {
  uuid: string;
  email: string;
  profile: {
    full_name: string;
  };
  other_roles: RoleEnum[];
}

export interface LoginSessionData {
  active_role: RoleEnum;
  email_verified: boolean;
  kyc_verified: boolean;
  user: InnerLoginUser;
}

// --- B. TYPES FOR PERSONAL DATA (/me) ---
export interface PersonalData {
  uuid: string;
  email: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  phone_number?: string | null;
  date_of_birth?: string | null;
  nationality?: string | null;
  country?: string | null;
  state?: string | null;
  lga?: string | null;
  address?: string | null;
  postal_code?: string | null;
  active_role: RoleEnum | string;
  other_roles: (RoleEnum | string)[];
}

// --- C. AUTH STATE INTERFACE ---
interface AuthState {
  session: LoginSessionData | null;
  profile: PersonalData | null;
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

const initialState: AuthState = {
  session: null,
  profile: null,
  status: 'idle',
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Stores login response data
    setLoginSession: (state, action: PayloadAction<LoginSessionData>) => {
      state.session = action.payload;
      state.status = 'succeeded';
      state.isAuthenticated = true;
    },
    // Stores /me personal profile data
    setPersonalProfile: (state, action: PayloadAction<PersonalData>) => {
      state.profile = action.payload;
    },
    clearUserInfo: (state) => {
      state.session = null;
      state.profile = null;
      state.status = 'idle';
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action) => {
      const rehydrateAction = action as RehydrateAction;
      const persistedAuth = rehydrateAction.payload?.auth;

      if (persistedAuth?.session) {
        state.session = persistedAuth.session;
        state.profile = persistedAuth.profile || null;
        state.isAuthenticated = true;
        state.status = 'succeeded';
      }
    });
  },
});

export const { setLoginSession, setPersonalProfile, clearUserInfo } = authSlice.actions;
export default authSlice.reducer;