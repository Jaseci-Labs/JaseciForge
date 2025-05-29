import { createAsyncThunk } from '@reduxjs/toolkit';
import { ComtApi } from '../services/comt-api';
import { ComtNode } from '@/nodes/comt-node';

// Example actions
export const fetchComts = createAsyncThunk(
  'products/comt/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ComtApi.getComts();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch Comts');
    }
  }
);
