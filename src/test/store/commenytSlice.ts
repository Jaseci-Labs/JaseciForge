import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { CommenytNode } from '@/nodes/commenyt-node';
import { fetchCommenyts } from '@/modules/products/actions/commenyt-actions';

interface CommenytState {
  items: CommenytNode[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
  successMessage: string | null;
}

const initialState: CommenytState = {
  items: [],
  isLoading: false,
  error: null,
  success: false,
  successMessage: null,
};

export const commenytSlice = createSlice({
  name: 'products/commenyt',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<CommenytNode[]>) => {
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
    builder.addCase(fetchCommenyts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(fetchCommenyts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
      state.success = true;
      state.successMessage = 'Commenyts fetched successfully';
    });
    builder.addCase(fetchCommenyts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
  },
});

export const { setItems, setLoading, setError, resetSuccess } = commenytSlice.actions;
export default commenytSlice.reducer;
