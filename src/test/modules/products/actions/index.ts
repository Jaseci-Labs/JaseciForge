import { createAsyncThunk } from '@reduxjs/toolkit';
import { productsApi } from '../services';
import { productsNode } from '@/nodes/products-node';

// Example action
export const fetchproductss = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsApi.getproductss();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch productss');
    }
  }
);

export * from './comment-actions';
export * from './commenyt-actions';
export * from './comt-actions';
export * from './cosdfmt-actions';