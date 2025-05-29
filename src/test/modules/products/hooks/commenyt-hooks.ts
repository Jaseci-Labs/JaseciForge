import { useAppDispatch, useAppSelector } from '@/store/useStore';
import { fetchCommenyts } from '../actions/commenyt-actions';
import { CommenytNode } from '@/nodes/commenyt-node';

export const useCommenyts = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector(state => state.products.commenyt);

  const refresh = () => {
    dispatch(fetchCommenyts());
  };

  return { items, isLoading, error, refresh };
};
