# Data Layer

## Overview
The data layer manages application state and data flow using Redux Toolkit. It follows a clear pattern:
1. Models/entities are defined in `nodes`
2. State is managed in Redux `store`
3. Actions connect to service layer for backend data
4. Extra reducers automatically update store on action completion
5. Presentation layer uses hooks to access and modify state

## Directory Structure
```
src/
├── nodes/           # Entity definitions
│   ├── task-node.ts
│   └── user-node.ts
│
├── store/           # Redux store
│   ├── slices/      # Redux slices
│   └── index.ts     # Store configuration
│
└── modules/         # Feature modules
    └── tasks/
        ├── actions/ # Redux actions
        └── ...
```

## Core Components

### 1. Entity Definitions (Nodes)
```typescript
// nodes/task-node.ts
export interface TaskNode {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Store Configuration
```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 3. Slice with Extra Reducers
```typescript
// store/slices/tasksSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { TaskNode } from '@/nodes/task-node';
import { fetchTasks, createTask } from '@/modules/tasks/actions/taskActions';

interface TasksState {
  tasks: TaskNode[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  isLoading: false,
  error: null,
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Local state modifications
    toggleTaskCompletion: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
  },
  extraReducers: (builder) => {
    // Handle async actions
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Handle other async actions...
  },
});
```

### 4. Actions (Service Layer Integration)
```typescript
// modules/tasks/actions/taskActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TaskService } from '../services/taskService';
import { TaskNode } from '@/nodes/task-node';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const tasks = await TaskService.getTasks();
      return tasks;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch tasks'
      );
    }
  }
);
```

### 5. Presentation Layer Integration
```typescript
// modules/tasks/components/TaskList.tsx
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { fetchTasks } from '../actions/taskActions';

export const TaskList = () => {
  const dispatch = useAppDispatch();
  const { tasks, isLoading, error } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};
```

## Data Flow

1. **Entity Definition**
   - Define models in `nodes` directory
   - Use TypeScript interfaces
   - Keep models pure and focused

2. **State Management**
   - Store state in Redux slices
   - Define initial state
   - Handle loading and error states
   - Use proper typing

3. **Service Integration**
   - Actions connect to service layer
   - Handle async operations
   - Proper error handling
   - Type-safe parameters

4. **State Updates**
   - Extra reducers handle async actions
   - Automatic state updates
   - Loading state management
   - Error handling

5. **Presentation Layer**
   - Use `useAppSelector` to read state
   - Use `useAppDispatch` to trigger actions
   - Handle loading states
   - Display errors

## Best Practices

1. **Entity Definitions**
   - Keep models in `nodes` directory
   - Use TypeScript interfaces
   - Document model properties
   - Keep models focused

2. **State Management**
   - Normalize state shape
   - Handle loading states
   - Proper error handling
   - Use proper typing

3. **Actions**
   - Connect to service layer
   - Handle errors properly
   - Use TypeScript
   - Keep actions focused

4. **Presentation Layer**
   - Use hooks consistently
   - Handle loading states
   - Display errors
   - Keep UI logic separate 