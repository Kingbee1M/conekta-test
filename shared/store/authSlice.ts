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

// --- BASE PROFILE FIELDS SHARED BY BOTH ROLES ---
export interface BaseProfile {
  profile_uuid: string;
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
  ref_no: string;
  active_status: string;
  kyc_status: string;
  created_at: string;
  updated_at: string;
}

// --- SPECIFIC ROLE PROFILES ---
export interface CustomerProfile extends BaseProfile {
  occupation?: string | null;
  monthly_income?: number | null;
  employer_name?: string | null;
  employer_address?: string | null;
  employer_phone?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  emergency_contact_relationship?: string | null;
  guarantor_name?: string | null;
  guarantor_phone?: string | null;
  guarantor_email?: string | null;
  guarantor_address?: string | null;
  guarantor_relationship?: string | null;
}

export type ListerProfile = BaseProfile;

// --- AUTH STATE INTERFACE ---
interface AuthState {
  session: LoginSessionData | null;
  customerProfile: CustomerProfile | null;
  listerProfile: ListerProfile | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  isAuthenticated: boolean;
  timestamp: number | null; // Track when session was saved (24h TTL)
}

interface PersistPayload {
  auth?: AuthState;
}

interface RehydrateAction extends Action {
  type: typeof REHYDRATE;
  payload?: PersistPayload;
}

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

const initialState: AuthState = {
  session: null,
  customerProfile: null,
  listerProfile: null,
  status: 'idle',
  isAuthenticated: false,
  timestamp: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Stores login response data & stamps current time
    setLoginSession: (state, action: PayloadAction<LoginSessionData>) => {
      state.session = action.payload;
      state.status = 'succeeded';
      state.isAuthenticated = true;
      state.timestamp = Date.now();
    },
    // Switch active role explicitly if changed on the frontend
    setActiveRole: (state, action: PayloadAction<RoleEnum>) => {
      if (state.session) {
        state.session.active_role = action.payload;
      }
    },
    // Stores customer profile data (/customers/profile/me/)
    setCustomerProfile: (state, action: PayloadAction<CustomerProfile>) => {
      state.customerProfile = action.payload;
    },
    // Stores lister profile data (/listers/profile/me/)
    setListerProfile: (state, action: PayloadAction<ListerProfile>) => {
      state.listerProfile = action.payload;
    },
    clearUserInfo: (state) => {
      state.session = null;
      state.customerProfile = null;
      state.listerProfile = null;
      state.status = 'idle';
      state.isAuthenticated = false;
      state.timestamp = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action) => {
      const rehydrateAction = action as RehydrateAction;
      const persistedAuth = rehydrateAction.payload?.auth;

      if (persistedAuth?.session && persistedAuth?.timestamp) {
        const isExpired = Date.now() - persistedAuth.timestamp > TWENTY_FOUR_HOURS_MS;

        if (isExpired) {
          // TTL exceeded: Wipe persisted state back to initialState
          state.session = null;
          state.customerProfile = null;
          state.listerProfile = null;
          state.isAuthenticated = false;
          state.status = 'idle';
          state.timestamp = null;
        } else {
          // State is still fresh (< 24h)
          state.session = persistedAuth.session;
          state.customerProfile = persistedAuth.customerProfile || null;
          state.listerProfile = persistedAuth.listerProfile || null;
          state.isAuthenticated = true;
          state.status = 'succeeded';
          state.timestamp = persistedAuth.timestamp;
        }
      }
    });
  },
});

export const {
  setLoginSession,
  setActiveRole,
  setCustomerProfile,
  setListerProfile,
  clearUserInfo,
} = authSlice.actions;

export default authSlice.reducer;