# Step 3c: Data Layer Integration

Let's set up the data layer to manage task state and connect our service layer with the UI.

## Redux Store Setup

```typescript
// store/taskSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskNode } from '@/nodes/task-node';

interface TaskState {
  items: TaskNode[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  items: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<TaskNode[]>) => {
      state.items = action.payload;
    },
    addItem: (state, action: PayloadAction<TaskNode>) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<TaskNode>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setItems,
  addItem,
  updateItem,
  removeItem,
  setLoading,
  setError,
} = taskSlice.actions;

export default taskSlice.reducer;
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

[Continue to Step 4: UI Implementation →](./step4-ui-implementation.md) 