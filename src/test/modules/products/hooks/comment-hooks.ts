import { useAppDispatch, useAppSelector } from '@/store/useStore';
import { fetchComments } from '../actions/comment-actions';
import { CommentNode } from '@/nodes/comment-node';

export const useComments = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector(state => state.products.comment);

  const refresh = () => {
    dispatch(fetchComments());
  };

  return { items, isLoading, error, refresh };
};
