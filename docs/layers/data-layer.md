# Data Layer

## Overview
The data layer manages application state and data flow using Redux Toolkit. It provides a centralized store for managing application state and implements actions and reducers for state modifications.

## Directory Structure
```
store/              # Redux store configuration
├── slices/         # Redux slices
├── hooks/          # Custom Redux hooks
└── middleware/     # Redux middleware
```

## Core Concepts

### 1. Redux Store
- Centralized state management
- Single source of truth
- Predictable state updates
- DevTools integration

### 2. Redux Slices
- Modular state management
- Action creators
- Reducers
- Selectors

### 3. Custom Hooks
- Type-safe state access
- Action dispatching
- State selectors
- Memoized values

## Implementation

### 1. Store Configuration
```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(customMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 2. Slice Example
```typescript
// store/slices/tasksSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskNode } from '@/types';

interface TasksState {
  items: TaskNode[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<TaskNode[]>) => {
      state.items = action.payload;
    },
    addTask: (state, action: PayloadAction<TaskNode>) => {
      state.items.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<TaskNode>) => {
      const index = state.items.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
});

export const { setTasks, addTask, updateTask } = tasksSlice.actions;
export default tasksSlice.reducer;
```

### 3. Custom Hooks
```typescript
// store/hooks/useAppDispatch.ts
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../index';

export const useAppDispatch = () => useDispatch<AppDispatch>();

// store/hooks/useAppSelector.ts
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../index';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## State Management Patterns

### 1. Async Actions
```typescript
// store/slices/tasksSlice.ts
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    const response = await api.getTasks();
    return response.data;
  }
);

const tasksSlice = createSlice({
  // ... other reducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
```

### 2. Selectors
```typescript
// store/selectors/taskSelectors.ts
export const selectAllTasks = (state: RootState) => state.tasks.items;
export const selectTaskById = (state: RootState, taskId: string) =>
  state.tasks.items.find(task => task.id === taskId);
export const selectTasksByStatus = (state: RootState, status: string) =>
  state.tasks.items.filter(task => task.status === status);
```

## Best Practices

1. **State Structure**
   - Normalize state shape
   - Keep state minimal
   - Use proper typing
   - Implement proper error handling

2. **Performance**
   - Use memoized selectors
   - Implement proper loading states
   - Optimize re-renders
   - Use proper middleware

3. **Type Safety**
   - Use TypeScript
   - Define proper interfaces
   - Use proper action types
   - Implement proper error types

4. **Testing**
   - Test reducers
   - Test selectors
   - Test async actions
   - Test middleware

## Integration with Service Layer

### 1. API Integration
```typescript
// store/slices/tasksSlice.ts
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: TaskNode, { rejectWithValue }) => {
    try {
      const response = await api.createTask(taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### 2. Error Handling
```typescript
// store/middleware/errorMiddleware.ts
export const errorMiddleware = () => (next) => (action) => {
  if (action.type.endsWith('/rejected')) {
    // Handle error
    console.error(action.payload);
  }
  return next(action);
};
``` 