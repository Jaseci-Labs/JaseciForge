# Lesson 3.4: Data Layer Integration

Let's set up the data layer to manage task state and connect our service layer with the UI.

## Redux Store Setup

```typescript
// store/postSlice.ts
import { PostNode } from "@/nodes/post-node";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  createPost,
  deletePostAction,
  fetchPosts,
  updatePostAction,
} from "../modules/post/actions";

interface PostState {
  items: PostNode[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
  successMessage: string | null;
}

const initialState: PostState = {
  items: [],
  isLoading: false,
  error: null,
  success: false,
  successMessage: null,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<PostNode[]>) => {
      state.items = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.success = false;
    },
    resetSuccess: (state) => {
      state.success = false;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
      state.success = true;
      state.successMessage = "Posts fetched successfully";
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
    // add case for create post
    builder.addCase(createPost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.items.push(action.payload);
      state.success = true;
      state.successMessage = "Post created successfully";
    });
    builder.addCase(createPost.rejected, (state, action) => {
      state.error = action.payload as string;
      state.success = false;
    });
    // add case for update post
    builder.addCase(updatePostAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(updatePostAction.fulfilled, (state, action) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
      state.success = true;
      state.successMessage = "Post updated successfully";
    });
    builder.addCase(updatePostAction.rejected, (state, action) => {
      state.error = action.payload as string;
      state.success = false;
    });
    // add case for delete post
    builder.addCase(deletePostAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(deletePostAction.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.success = true;
      state.successMessage = "Post deleted successfully";
    });
    builder.addCase(deletePostAction.rejected, (state, action) => {
      state.error = action.payload as string;
      state.success = false;
    });
  },
});

export const { setItems, setLoading, setError, resetSuccess } =
  postSlice.actions;
export default postSlice.reducer;
```

## Data Management Hook

```typescript
// modules/tasks/hooks/use-task-manager.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TasksApi } from '../services/task-service';
import { TaskNode } from '@/nodes/task-node';
import { TaskFormData } from '../schemas/task-schema';
import {
  setItems,
  addItem,
  updateItem,
  removeItem,
  setLoading,
  setError,
} from '@/store/taskSlice';

export const useTaskManager = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.tasks);

  const loadTasks = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const tasks = await TasksApi.getUserTasks();
      dispatch(setItems(tasks));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to load tasks'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const addTask = useCallback(async (data: TaskFormData) => {
    try {
      dispatch(setLoading(true));
      const task = await TasksApi.createTask(data);
      dispatch(addItem(task));
      return task;
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to create task'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const updateTask = useCallback(async (id: number, data: Partial<TaskFormData>) => {
    try {
      dispatch(setLoading(true));
      const task = await TasksApi.updateTask(id, data);
      dispatch(updateItem(task));
      return task;
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to update task'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const deleteTask = useCallback(async (id: number) => {
    try {
      dispatch(setLoading(true));
      await TasksApi.deleteTask(id);
      dispatch(removeItem(id));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to delete task'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const toggleComplete = useCallback(async (id: number) => {
    try {
      dispatch(setLoading(true));
      const task = await TasksApi.toggleTaskCompletion(id);
      dispatch(updateItem(task));
      return task;
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to toggle task'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    tasks: items,
    loading,
    error,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
  };
};
```

## Data Layer Features

1. **State Management**
   - Centralized task state
   - Loading and error states
   - Type-safe actions and reducers

2. **Data Operations**
   - CRUD operations with error handling
   - Optimistic updates
   - Loading state management

3. **Type Safety**
   - Full TypeScript integration
   - Redux state typing
   - Action payload typing

## Verify Data Layer

1. Test Redux store:
   ```typescript
   // In your component
   const { tasks, loading, error, loadTasks } = useTaskManager();
   
   useEffect(() => {
     loadTasks();
   }, [loadTasks]);
   ```

2. Check state updates:
   ```typescript
   // After operations
   console.log('Tasks:', tasks);
   console.log('Loading:', loading);
   console.log('Error:', error);
   ```

## Next Steps

Now that we have our data layer set up, we can move on to:
1. Creating UI components
2. Implementing the task list
3. Adding task forms

[Continue to Lesson 3.5: Store and Reducers Implementation →](./step3d-store-and-reducers.md) 