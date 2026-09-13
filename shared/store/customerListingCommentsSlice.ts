import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActiveReplyState {
  parentCommentUuid: string;
  parentAuthorName: string;
}

interface ActiveEditState {
  commentUuid: string;
  currentText: string;
}

interface CommentsUiState {
  activeReply: ActiveReplyState | null;
  activeEdit: ActiveEditState | null;
  isSubmitting: boolean;
}

const initialState: CommentsUiState = {
  activeReply: null,
  activeEdit: null,
  isSubmitting: false,
};

export const customerListingCommentsSlice = createSlice({
  name: 'customerListingComments',
  initialState,
  reducers: {
    setActiveReply: (state, action: PayloadAction<ActiveReplyState | null>) => {
      state.activeReply = action.payload;
      state.activeEdit = null; // Clear edit mode when replying
    },
    setActiveEdit: (state, action: PayloadAction<ActiveEditState | null>) => {
      state.activeEdit = action.payload;
      state.activeReply = null; // Clear reply mode when editing
    },
    clearCommentUiState: (state) => {
      state.activeReply = null;
      state.activeEdit = null;
      state.isSubmitting = false;
    },
    setIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  setActiveReply,
  setActiveEdit,
  clearCommentUiState,
  setIsSubmitting,
} = customerListingCommentsSlice.actions;

export default customerListingCommentsSlice.reducer;