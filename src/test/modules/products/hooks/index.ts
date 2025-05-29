import { useAppDispatch, useAppSelector } from '@/store/useStore';
import { fetchproductss } from '../actions';
import { productsNode } from '@/nodes/products-node';

export const useproductss = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector(state => state.products);

  const refresh = () => {
    dispatch(fetchproductss());
  };

  return { items, isLoading, error, refresh };
};

export * from './comment-hooks';
export * from './commenyt-hooks';
export * from './comt-hooks';
export * from './cosdfmt-hooks';