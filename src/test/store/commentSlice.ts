import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { CommentNode } from '@/nodes/comment-node';
import { fetchComments } from '@/modules/products/actions/comment-actions';

interface CommentState {
  items: CommentNode[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
  successMessage: string | null;
}

const initialState: CommentState = {
  items: [],
  isLoading: false,
  error: null,
  success: false,
  successMessage: null,
};

export const commentSlice = createSlice({
  name: 'products/comment',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<CommentNode[]>) => {
      state.items = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.success = false;
    },
    resetSuccess: (state) => {
      state.success = false;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchComments.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
      state.success = true;
      state.successMessage = 'Comments fetched successfully';
    });
    builder.addCase(fetchComments.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
  },
});

export const { setItems, setLoading, setError, resetSuccess } = commentSlice.actions;
export default commentSlice.reducer;
