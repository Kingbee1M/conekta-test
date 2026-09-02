import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
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

const {
  getMyKycProfile,
  getKycRequirements,
  submitKycDocuments,
  submitKycProfile,
} = publicKycApiSlice.endpoints;

const isKycPending = isAnyOf(
  getMyKycProfile.matchPending,
  getKycRequirements.matchPending,
  submitKycDocuments.matchPending,
  submitKycProfile.matchPending
);

const isKycRejected = isAnyOf(
  getMyKycProfile.matchRejected,
  getKycRequirements.matchRejected,
  submitKycDocuments.matchRejected,
  submitKycProfile.matchRejected
);

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
      .addMatcher(getMyKycProfile.matchFulfilled, (state, { payload }) => {
        if (payload.data) {
          state.profile = payload.data;
        }
        state.isLoading = false;
      })
      // 2. Store requirements when getKycRequirements succeeds
      .addMatcher(getKycRequirements.matchFulfilled, (state, { payload }) => {
        if (payload.data) {
          state.requirements = payload.data;
        }
        state.isLoading = false;
      })
      // 3. Update requirement submission when submitKycDocuments succeeds
      .addMatcher(submitKycDocuments.matchFulfilled, (state, { payload }) => {
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
      })
      // 4. Update profile when submitKycProfile succeeds
      .addMatcher(submitKycProfile.matchFulfilled, (state, { payload }) => {
        if (payload.data) {
          state.profile = payload.data;
        }
        state.isLoading = false;
      })
      // Set loading state on KYC pending calls
      .addMatcher(isKycPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Handle rejected state across KYC endpoints safely
      .addMatcher(isKycRejected, (state, action) => {
        state.isLoading = false;

        let errorMsg = 'An error occurred';

        if (
          action.payload &&
          'data' in action.payload &&
          typeof action.payload.data === 'object' &&
          action.payload.data !== null &&
          'message' in action.payload.data &&
          typeof (action.payload.data as { message?: string }).message === 'string'
        ) {
          errorMsg = (action.payload.data as { message: string }).message;
        } else if (action.error?.message) {
          errorMsg = action.error.message;
        }

        state.error = errorMsg;
      });
  },
});

export const { setKycProfile, setKycRequirements, clearKycState } =
  publicKycSlice.actions;

export default publicKycSlice.reducer;