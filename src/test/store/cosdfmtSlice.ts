import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { CosdfmtNode } from '@/nodes/cosdfmt-node';
import { fetchCosdfmts } from '@/modules/products/actions/cosdfmt-actions';

interface CosdfmtState {
  items: CosdfmtNode[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
  successMessage: string | null;
}

const initialState: CosdfmtState = {
  items: [],
  isLoading: false,
  error: null,
  success: false,
  successMessage: null,
};

export const cosdfmtSlice = createSlice({
  name: 'products/cosdfmt',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<CosdfmtNode[]>) => {
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
    builder.addCase(fetchCosdfmts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(fetchCosdfmts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
      state.success = true;
      state.successMessage = 'Cosdfmts fetched successfully';
    });
    builder.addCase(fetchCosdfmts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
  },
});

export const { setItems, setLoading, setError, resetSuccess } = cosdfmtSlice.actions;
export default cosdfmtSlice.reducer;
