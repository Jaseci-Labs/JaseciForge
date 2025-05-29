import { createAsyncThunk } from '@reduxjs/toolkit';
import { CosdfmtApi } from '../services/cosdfmt-api';
import { CosdfmtNode } from '@/nodes/cosdfmt-node';

// Example actions
export const fetchCosdfmts = createAsyncThunk(
  'products/cosdfmt/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CosdfmtApi.getCosdfmts();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch Cosdfmts');
    }
  }
);
