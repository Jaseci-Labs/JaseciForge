import { CommentNode } from '@/nodes/comment-node';
import { private_api } from '@/_core/api-client';

export const CommentApi = {
  // Get all comments
  getComments: async () => {
    const response = await private_api.get('/products/comments');
    return response.data;
  },

  // Get a specific comment
  getComment: async (id: number) => {
    const response = await private_api.get(`/products/comments/${id}`);
    return response.data;
  },

  // Create a new comment
  createComment: async (data: Omit<CommentNode, 'id'>) => {
    const response = await private_api.post('/products/comments', data);
    return response.data;
  },

  // Update an existing comment
  updateComment: async (id: number, data: Partial<CommentNode>) => {
    const response = await private_api.put(`/products/comments/${id}`, data);
    return response.data;
  },

  // Delete a comment
  deleteComment: async (id: number) => {
    const response = await private_api.delete(`/products/comments/${id}`);
    return response.data;
  }
};
