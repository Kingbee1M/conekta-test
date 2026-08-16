import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  KycProfileData,
  KycRequirement,
} from '@/shared/service/publicKyc/publicKYCtypes';
import { publicKycApiSlice } from '@/shared/service/publicKyc/publicKYC.services';

interface PublicKycState {
  profile: KycProfileData | null;
  requirements: KycRequirement[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PublicKycState = {
  profile: null,
  requirements: [],
  isLoading: false,
  error: null,
};

export const publicKycSlice = createSlice({
  name: 'publicKyc',
  initialState,
  reducers: {
    setKycProfile: (state, action: PayloadAction<KycProfileData | null>) => {
      state.profile = action.payload;
    },
    setKycRequirements: (state, action: PayloadAction<KycRequirement[]>) => {
      state.requirements = action.payload;
    },
    clearKycState: (state) => {
      state.profile = null;
      state.requirements = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. Store profile when getMyKycProfile succeeds
      .addMatcher(
        publicKycApiSlice.endpoints.getMyKycProfile.matchFulfilled,
        (state, { payload }) => {
          if (payload.data) {
            state.profile = payload.data;
          }
          state.isLoading = false;
        }
      )
      // 2. Store requirements when getKycRequirements succeeds
      .addMatcher(
        publicKycApiSlice.endpoints.getKycRequirements.matchFulfilled,
        (state, { payload }) => {
          if (payload.data) {
            state.requirements = payload.data;
          }
          state.isLoading = false;
        }
      )
      // 3. Update requirement submission when submitKycDocuments succeeds
      .addMatcher(
        publicKycApiSlice.endpoints.submitKycDocuments.matchFulfilled,
        (state, { payload }) => {
          if (payload.data && state.profile?.requirements) {
            const { requirement_uuid, submission } = payload.data;
            const index = state.profile.requirements.findIndex(
              (item) => item.requirement.requirement_uuid === requirement_uuid
            );

            if (index !== -1) {
              state.profile.requirements[index].submission = submission;
            }
          }
          state.isLoading = false;
        }
      )
      // 4. Update profile when submitKycProfile succeeds
      .addMatcher(
        publicKycApiSlice.endpoints.submitKycProfile.matchFulfilled,
        (state, { payload }) => {
          if (payload.data) {
            state.profile = payload.data;
          }
          state.isLoading = false;
        }
      )
      // Set loading state on pending API calls
      .addMatcher(
        (action) =>
          action.type.startsWith('api/') && action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      // Handle rejected state across KYC endpoints
      .addMatcher(
        (action) =>
          action.type.startsWith('api/') && action.type.endsWith('/rejected'),
        (state, action: { payload?: { data?: { message?: string } }; error?: { message?: string } }) => {
          state.isLoading = false;
          // Better error extraction
          let errorMsg = 'An error occurred';
          if (action.payload?.data?.message) {
            errorMsg = action.payload.data.message;
          } else if (action.error?.message) {
            errorMsg = action.error.message;
          }
          state.error = errorMsg;
          console.error('[publicKycSlice] API Error:', { action, error: errorMsg });
        }
      );
  },
});

export const { setKycProfile, setKycRequirements, clearKycState } =
  publicKycSlice.actions;

export default publicKycSlice.reducer;