import { CosdfmtNode } from '@/nodes/cosdfmt-node';
import { private_api } from '@/_core/api-client';

export const CosdfmtApi = {
  // Get all cosdfmts
  getCosdfmts: async () => {
    const response = await private_api.get('/products/cosdfmts');
    return response.data;
  },

  // Get a specific cosdfmt
  getCosdfmt: async (id: number) => {
    const response = await private_api.get(`/products/cosdfmts/${id}`);
    return response.data;
  },

  // Create a new cosdfmt
  createCosdfmt: async (data: Omit<CosdfmtNode, 'id'>) => {
    const response = await private_api.post('/products/cosdfmts', data);
    return response.data;
  },

  // Update an existing cosdfmt
  updateCosdfmt: async (id: number, data: Partial<CosdfmtNode>) => {
    const response = await private_api.put(`/products/cosdfmts/${id}`, data);
    return response.data;
  },

  // Delete a cosdfmt
  deleteCosdfmt: async (id: number) => {
    const response = await private_api.delete(`/products/cosdfmts/${id}`);
    return response.data;
  }
};
