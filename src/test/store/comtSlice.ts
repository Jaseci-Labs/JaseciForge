import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ComtNode } from '@/nodes/comt-node';
import { fetchComts } from '@/modules/products/actions/comt-actions';

interface ComtState {
  items: ComtNode[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
  successMessage: string | null;
}

const initialState: ComtState = {
  items: [],
  isLoading: false,
  error: null,
  success: false,
  successMessage: null,
};

export const comtSlice = createSlice({
  name: 'products/comt',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<ComtNode[]>) => {
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
    builder.addCase(fetchComts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(fetchComts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
      state.success = true;
      state.successMessage = 'Comts fetched successfully';
    });
    builder.addCase(fetchComts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
  },
});

export const { setItems, setLoading, setError, resetSuccess } = comtSlice.actions;
export default comtSlice.reducer;
