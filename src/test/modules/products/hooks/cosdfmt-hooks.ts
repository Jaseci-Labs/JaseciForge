import { useAppDispatch, useAppSelector } from '@/store/useStore';
import { fetchCosdfmts } from '../actions/cosdfmt-actions';
import { CosdfmtNode } from '@/nodes/cosdfmt-node';

export const useCosdfmts = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector(state => state.products.cosdfmt);

  const refresh = () => {
    dispatch(fetchCosdfmts());
  };

  return { items, isLoading, error, refresh };
};
