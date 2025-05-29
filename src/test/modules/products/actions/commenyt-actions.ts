import { createAsyncThunk } from '@reduxjs/toolkit';
import { CommenytApi } from '../services/commenyt-api';
import { CommenytNode } from '@/nodes/commenyt-node';

// Example actions
export const fetchCommenyts = createAsyncThunk(
  'products/commenyt/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CommenytApi.getCommenyts();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch Commenyts');
    }
  }
);
