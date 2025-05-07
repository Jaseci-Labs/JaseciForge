# Building an App with Jaseci Forge: A Step-by-Step Guide

This guide will walk you through creating a simple task management app using Jaseci Forge's architecture. We'll use the JSONPlaceholder API as our data source.

## Prerequisites
- Node.js 18+ installed
- Basic understanding of React and TypeScript
- Jaseci Forge project set up

## Step 1: Define Data Models

First, let's define our data models in the data layer:

```typescript
// src/data/models/task.model.ts
export interface Task {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}
```

## Step 2: Register Slice in Store

Create and register a Redux slice for tasks:

```typescript
// src/data/store/task.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskState } from '../models/task.model';

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setTasks, setLoading, setError } = taskSlice.actions;
export default taskSlice.reducer;
```

## Step 3: Create Feature Module and Service

Create a feature module for tasks and implement the API service:

```typescript
// src/features/tasks/services/task.service.ts
import { Task } from '../../../data/models/task.model';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

export class TaskService {
  async getTasks(): Promise<Task[]> {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  }
}

export const taskService = new TaskService();
```

## Step 4: Define Actions

Create actions that use the service:

```typescript
// src/features/tasks/actions/task.actions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '../services/task.service';
import { setTasks, setLoading, setError } from '../../../data/store/task.slice';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const tasks = await taskService.getTasks();
      dispatch(setTasks(tasks));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }
);
```

## Step 5: Configure Store with Extra Reducers

Update the task slice to handle async actions:

```typescript
// src/data/store/task.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskState } from '../models/task.model';
import { fetchTasks } from '../../features/tasks/actions/task.actions';

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
```

## Step 6: Create Presentation Layer

Create a page component in the feature module:

```typescript
// src/features/tasks/pages/TaskListPage.tsx
import React from 'react';
import { TaskList } from '../organisms/TaskList';
import { useTaskList } from '../hooks/useTaskList';

export const TaskListPage: React.FC = () => {
  const { tasks, loading, error, fetchTasks } = useTaskList();

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <TaskList tasks={tasks} />;
};
```

## Step 7: Create Custom Hook

Implement a custom hook for data layer communication:

```typescript
// src/features/tasks/hooks/useTaskList.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/hooks/store';
import { fetchTasks } from '../actions/task.actions';

export const useTaskList = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);

  const handleFetchTasks = useCallback(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return {
    tasks,
    loading,
    error,
    fetchTasks: handleFetchTasks,
  };
};
```

## Step 8: Create UI Components

Create atomic design components:

```typescript
// src/features/tasks/atoms/TaskItem.tsx
import React from 'react';
import { Task } from '../../../data/models/task.model';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => (
  <div className="task-item">
    <input type="checkbox" checked={task.completed} readOnly />
    <span>{task.title}</span>
  </div>
);

// src/features/tasks/organisms/TaskList.tsx
import React from 'react';
import { Task } from '../../../data/models/task.model';
import { TaskItem } from '../atoms/TaskItem';

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => (
  <div className="task-list">
    {tasks.map((task) => (
      <TaskItem key={task.id} task={task} />
    ))}
  </div>
);
```

## Step 9: Create Page Template

Create a page template using the components:

```typescript
// src/features/tasks/templates/TaskListTemplate.tsx
import React from 'react';
import { TaskList } from '../organisms/TaskList';
import { useTaskList } from '../hooks/useTaskList';

export const TaskListTemplate: React.FC = () => {
  const { tasks, loading, error, fetchTasks } = useTaskList();

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="task-list-template">
      <h1>Task List</h1>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && <TaskList tasks={tasks} />}
    </div>
  );
};
```

## Step 10: Configure Routes

Finally, expose the module in the app routes:

```typescript
// src/app/routes.tsx
import { TaskListPage } from '../features/tasks/pages/TaskListPage';

export const routes = [
  {
    path: '/tasks',
    element: <TaskListPage />,
  },
  // ... other routes
];
```

## Conclusion

This guide demonstrates how to:
- Structure data models and state management
- Implement service layer for API communication
- Create feature modules with proper separation of concerns
- Build reusable UI components using atomic design
- Handle async operations with Redux Toolkit
- Implement custom hooks for data layer communication
- Set up routing for the application

The resulting application follows Jaseci Forge's architecture principles and best practices, providing a solid foundation for building scalable frontend applications. 