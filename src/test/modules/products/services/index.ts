import { productsNode } from '@/nodes/products-node';
import { private_api } from '@/_core/api-client';

export const productsApi = {
  // Get all productss
  getproductss: async () => {
    const response = await private_api.get('/api/products');
    return response.data;
  },

  // Create a new products
  createproducts: async (data: Omit<productsNode, 'id'>) => {
    const response = await private_api.post('/api/products', data);
    return response.data;
  },

  // Update an existing products
  updateproducts: async (id: number, data: Partial<productsNode>) => {
    const response = await private_api.put(`/api/products/${id}`, data);
    return response.data;
  },

  // Delete a products
  deleteproducts: async (id: number) => {
    const response = await private_api.delete(`/api/products/${id}`);
    return response.data;
  }
};

export * from './comment-api';
export * from './commenyt-api';
export * from './comt-api';
export * from './cosdfmt-api';