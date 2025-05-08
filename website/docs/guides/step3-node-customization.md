# Step 3: Node Customization and Hooks

Let's enhance our Task node and implement custom hooks for better functionality.

## Customize Task Node

Let's add more fields and types to our Task node:

```typescript
// nodes/task-node.ts
export interface TaskNode {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

## Add Validation Schema

Create a Zod schema for validation:

```typescript
// modules/tasks/schemas/task-schema.ts
import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  userId: z.number(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  tags: z.array(z.string()).default([]),
});

export type TaskFormData = z.infer<typeof taskSchema>;
```

## Implement Custom Hooks

### Task Manager Hook

```typescript
// modules/tasks/hooks/use-task-manager.ts
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TasksApi } from '../services/task-service';
import { taskSlice } from '@/store/taskSlice';
import { TaskNode } from '@/nodes/task-node';
import { taskSchema } from '../schemas/task-schema';

export function useTaskManager() {
  const dispatch = useDispatch();
  const { items: tasks, isLoading, error } = useSelector((state) => state.tasks);

  // Load tasks
  const loadTasks = useCallback(async () => {
    try {
      dispatch(taskSlice.actions.setLoading(true));
      const data = await TasksApi.getUserTasks();
      dispatch(taskSlice.actions.setItems(data));
    } catch (err) {
      dispatch(taskSlice.actions.setError(err.message));
    } finally {
      dispatch(taskSlice.actions.setLoading(false));
    }
  }, [dispatch]);

  // Add task
  const addTask = useCallback(async (data: TaskFormData) => {
    try {
      const validated = taskSchema.parse(data);
      const newTask = await TasksApi.createTask({
        ...validated,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      dispatch(taskSlice.actions.addItem(newTask));
    } catch (err) {
      dispatch(taskSlice.actions.setError(err.message));
    }
  }, [dispatch]);

  // Update task
  const updateTask = useCallback(async (id: number, data: Partial<TaskFormData>) => {
    try {
      const validated = taskSchema.partial().parse(data);
      const updated = await TasksApi.updateTask(id.toString(), {
        ...validated,
        updatedAt: new Date().toISOString(),
      });
      dispatch(taskSlice.actions.updateItem(updated));
    } catch (err) {
      dispatch(taskSlice.actions.setError(err.message));
    }
  }, [dispatch]);

  // Delete task
  const deleteTask = useCallback(async (id: number) => {
    try {
      await TasksApi.deleteTask(id.toString());
      dispatch(taskSlice.actions.removeItem(id));
    } catch (err) {
      dispatch(taskSlice.actions.setError(err.message));
    }
  }, [dispatch]);

  // Toggle completion
  const toggleComplete = useCallback(async (id: number) => {
    try {
      const updated = await TasksApi.toggleTaskCompletion(id.toString());
      dispatch(taskSlice.actions.updateItem(updated));
    } catch (err) {
      dispatch(taskSlice.actions.setError(err.message));
    }
  }, [dispatch]);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    isLoading,
    error,
    actions: {
      loadTasks,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
    },
  };
}
```

### Task Stats Hook

```typescript
// modules/tasks/hooks/use-task-stats.ts
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TaskNode } from '@/nodes/task-node';

export function useTaskStats() {
  const tasks = useSelector((state) => state.tasks.items);

  return useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const highPriority = tasks.filter(t => t.priority === 'high').length;

    return {
      total,
      completed,
      pending,
      highPriority,
      completionRate: total ? (completed / total) * 100 : 0,
    };
  }, [tasks]);
}
```

## Update Redux Slice

Enhance the Redux slice with new actions:

```typescript
// store/taskSlice.ts
export const taskSlice = createSlice({
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
      const index = state.items.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});
```

## Verify Changes

1. Check that the Task node has all new fields
2. Verify the validation schema works
3. Test the custom hooks
4. Confirm Redux actions work

## Next Steps

In the next step, we'll:
1. Create UI components
2. Implement the task list
3. Add task forms

[Continue to Step 4: UI Implementation →](./step4-ui-implementation.md) 