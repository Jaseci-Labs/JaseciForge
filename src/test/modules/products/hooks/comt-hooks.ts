import { useAppDispatch, useAppSelector } from '@/store/useStore';
import { fetchComts } from '../actions/comt-actions';
import { ComtNode } from '@/nodes/comt-node';

export const useComts = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector(state => state.products.comt);

  const refresh = () => {
    dispatch(fetchComts());
  };

  return { items, isLoading, error, refresh };
};
