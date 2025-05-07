# Service Layer

## Overview
The service layer handles all external communications and business logic. It provides a clean interface for interacting with APIs, managing data transformations, and implementing business rules.

> **Note**: By default, we use Axios for HTTP requests, but the service layer is designed to be backend-agnostic. You can easily adapt it to use other technologies like GraphQL, React Query, or Firebase without changing any other layers of the application. This is achieved through our service abstraction pattern, where all external communication is encapsulated within the service layer.

## Directory Structure
```
src/
├── _core/                # Core infrastructure
│   ├── api-client.ts     # Base API client configuration
│   └── ...              # Other core utilities
│
├── modules/             # Feature modules
│   ├── auth/           # Authentication module
│   │   ├── services/   # Auth-specific services
│   │   └── ...
│   │
│   ├── tasks/          # Tasks module
│   │   ├── services/   # Task-specific services
│   │   └── ...
│   │
│   └── users/          # Users module
│       ├── services/   # User-specific services
│       └── ...
```

## Core Components

### 1. Core API Client
```typescript
// src/_core/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors, error handling, etc.
export default apiClient;
```

### 2. Module-Specific Services
```typescript
// src/modules/tasks/services/taskService.ts
import apiClient from '@/core/api-client';
import { TaskNode } from '../types';
import { transformTask } from './transformers/taskTransformer';
import { validateTask } from './validators/taskValidator';

export class TaskService {
  static async getTasks(): Promise<TaskNode[]> {
    const response = await apiClient.get('/tasks');
    return response.data.map(transformTask);
  }

  // ... other methods
}
```

## Implementation Guidelines

1. **Module Organization**
   - Each module should have its own `services` directory
   - Services should be scoped to their module's functionality
   - Share common utilities through `_core`

2. **Core Technology Usage**
   - Always use `_core/api-client` for HTTP requests
   - Don't create new API client instances in modules
   - Extend core functionality when needed

3. **Service Implementation**
   - Keep services focused on module-specific logic
   - Use transformers and validators within the module
   - Handle module-specific errors

## Example Module Structure

```
modules/tasks/
├── services/
│   ├── taskService.ts
│   ├── transformers/
│   │   └── taskTransformer.ts
│   └── validators/
│       └── taskValidator.ts
├── types/
│   └── index.ts
└── index.ts
```

## Best Practices

1. **Module Isolation**
   - Keep services within their module
   - Don't share services between modules
   - Use types from the module's types directory

2. **Core Integration**
   - Use `_core` utilities consistently
   - Don't duplicate core functionality
   - Follow core patterns and conventions

3. **Error Handling**
   - Use module-specific error types
   - Handle errors at the service level
   - Propagate errors appropriately

## Usage Example

```typescript
// modules/tasks/actions/taskActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TaskService } from '../services/taskService';
import { TaskNode } from '../types';

// Action to fetch tasks
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

// Action to create task
export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData: Partial<TaskNode>, { rejectWithValue }) => {
    try {
      const task = await TaskService.createTask(taskData);
      return task;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create task'
      );
    }
  }
);

// Action to update task
export const updateTask = createAsyncThunk(
  'tasks/update',
  async (
    { id, data }: { id: string; data: Partial<TaskNode> },
    { rejectWithValue }
  ) => {
    try {
      const task = await TaskService.updateTask(id, data);
      return task;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update task'
      );
    }
  }
);
```

### Using Actions in Components
```typescript
// modules/tasks/components/TaskList.tsx
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { fetchTasks } from '../actions/taskActions';

export const TaskList = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
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

## Integration with Other Layers

1. **Data Layer Integration**
   - Services are called exclusively through Redux actions
   - Actions act as the bridge between service and data layers
   - Redux handles state management and side effects
   - Components dispatch actions to trigger service calls

2. **Presentation Layer Integration**
   - Components use Redux hooks to access state
   - Components dispatch actions to trigger service calls
   - UI logic is completely separated from service logic
   - Loading and error states are managed by Redux

3. **Core Layer Integration**
   - Services use core utilities consistently
   - Actions use core hooks (useAppDispatch, useAppSelector)
   - Maintain separation of concerns
   - Follow unidirectional data flow

## Best Practices

1. **Service Layer**
   - Keep services focused on API communication
   - Handle data transformation and validation
   - Throw appropriate errors for action handling

2. **Action Layer**
   - Create actions for all service operations
   - Handle errors using rejectWithValue
   - Provide meaningful error messages
   - Keep action logic minimal

3. **Component Layer**
   - Never call services directly
   - Use actions for all data operations
   - Handle loading and error states
   - Keep UI logic separate 