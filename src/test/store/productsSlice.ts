import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { productsNode } from '@/nodes/products-node';
import { fetchproductss } from '../modules/products/actions';

interface productsState {
  items: productsNode[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
  successMessage: string | null;
}

const initialState: productsState = {
  items: [],
  isLoading: false,
  error: null,
  success: false,
  successMessage: null,
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<productsNode[]>) => {
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
    builder.addCase(fetchproductss.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(fetchproductss.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
      state.success = true;
      state.successMessage = 'productss fetched successfully';
    });
    builder.addCase(fetchproductss.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
  },
});

export const { setItems, setLoading, setError, resetSuccess } = productsSlice.actions;
export default productsSlice.reducer;
