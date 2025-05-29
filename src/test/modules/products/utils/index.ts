import { productsNode } from '@/nodes/products-node';

export const formatproducts = (item: productsNode) => ({
  ...item,
  created_at: new Date(item.created_at).toLocaleDateString(),
  updated_at: new Date(item.updated_at).toLocaleDateString(),
});
