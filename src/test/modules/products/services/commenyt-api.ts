import { CommenytNode } from '@/nodes/commenyt-node';
import { private_api } from '@/_core/api-client';

export const CommenytApi = {
  // Get all commenyts
  getCommenyts: async () => {
    const response = await private_api.get('/products/commenyts');
    return response.data;
  },

  // Get a specific commenyt
  getCommenyt: async (id: number) => {
    const response = await private_api.get(`/products/commenyts/${id}`);
    return response.data;
  },

  // Create a new commenyt
  createCommenyt: async (data: Omit<CommenytNode, 'id'>) => {
    const response = await private_api.post('/products/commenyts', data);
    return response.data;
  },

  // Update an existing commenyt
  updateCommenyt: async (id: number, data: Partial<CommenytNode>) => {
    const response = await private_api.put(`/products/commenyts/${id}`, data);
    return response.data;
  },

  // Delete a commenyt
  deleteCommenyt: async (id: number) => {
    const response = await private_api.delete(`/products/commenyts/${id}`);
    return response.data;
  }
};
