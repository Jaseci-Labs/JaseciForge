import { ComtNode } from '@/nodes/comt-node';
import { private_api } from '@/_core/api-client';

export const ComtApi = {
  // Get all comts
  getComts: async () => {
    const response = await private_api.get('/products/comts');
    return response.data;
  },

  // Get a specific comt
  getComt: async (id: number) => {
    const response = await private_api.get(`/products/comts/${id}`);
    return response.data;
  },

  // Create a new comt
  createComt: async (data: Omit<ComtNode, 'id'>) => {
    const response = await private_api.post('/products/comts', data);
    return response.data;
  },

  // Update an existing comt
  updateComt: async (id: number, data: Partial<ComtNode>) => {
    const response = await private_api.put(`/products/comts/${id}`, data);
    return response.data;
  },

  // Delete a comt
  deleteComt: async (id: number) => {
    const response = await private_api.delete(`/products/comts/${id}`);
    return response.data;
  }
};
