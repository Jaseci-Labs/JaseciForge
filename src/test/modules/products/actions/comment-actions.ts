import { createAsyncThunk } from '@reduxjs/toolkit';
import { CommentApi } from '../services/comment-api';
import { CommentNode } from '@/nodes/comment-node';

// Example actions
export const fetchComments = createAsyncThunk(
  'products/comment/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CommentApi.getComments();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch Comments');
    }
  }
);
