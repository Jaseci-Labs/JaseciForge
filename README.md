# Jaseci Forge

## Overview
Jaseci Forge is a CLI tool designed to quickly set up JaseciStack Front-End projects. It creates a Next.js application pre-configured with TypeScript, Redux Toolkit, ShadCN UI, Tailwind CSS, and includes a TaskForge demo app to help you get started immediately.

## Why Use Jaseci Forge?
- **Quick Setup**: Instantly bootstrap a complete modern front-end stack
- **Best Practices**: Pre-configured with industry standards and optimizations
- **Production Ready**: Includes everything needed for development and deployment
- **Demo Application**: Comes with TaskForge demo to demonstrate architecture and patterns

## Installation & Setup

### Prerequisites
- Node.js (version 16.x or later)
- npm, yarn, or pnpm package manager

### Quick Start
1. Run the CLI using `npx`:

```bash
npx create-jaseci-app my-app
```

2. Answer the CLI prompts to customize your project:
   - Include Storybook? (y/N)
   - Include React Testing Library? (y/N)
   - Which package manager? (npm/yarn/pnpm)

3. Configure your environment:
   - Navigate to the project directory: `cd my-app`
   - Copy the environment template: `cp .env.example .env.local`
   - Update the variables in `.env.local` with your configuration

4. Start the development server:
```bash
npm run dev   # or yarn dev / pnpm dev
```

5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure
```
my-app/
├── _core/              # Core infrastructure and shared utilities
│   ├── api-client.ts   # Centralized API client with interceptors
│   ├── hooks/          # Shared React hooks (useApi, useAuth, etc.)
│   ├── keys.ts         # Environment and configuration keys
│   ├── app-configs.ts  # Application-wide configurations
│   └── utils.ts        # Shared utility functions
│
├── ds/                 # Design System (Presentation Layer)
│   ├── atoms/          # Basic building blocks (buttons, inputs)
│   ├── molecules/      # Combinations of atoms
│   ├── organisms/      # Complex UI components
│   └── templates/      # Page-level components
│
├── app/                # Next.js app router pages
│   ├── (auth)/         # Authentication-related pages
│   ├── (dashboard)/    # Dashboard and main application pages
│   └── layout.tsx      # Root layout configuration
│
├── modules/            # Feature modules (organized by domain)
│   ├── tasks/          # Task management feature
│   │   ├── actions/    # Redux actions and thunks
│   │   ├── hooks/      # Custom hooks connecting to data layer
│   │   ├── pages/      # Pages using DS components
│   │   ├── schemas/    # Zod validation schemas
│   │   ├── services/   # API endpoints and BE integration
│   │   └── utils/      # Module-specific utilities
│   └── users/          # User management feature
│       ├── actions/
│       ├── hooks/
│       ├── pages/
│       ├── schemas/
│       ├── services/
│       └── utils/
│
├── store/              # Data Layer (Redux)
│   ├── slices/         # Redux Toolkit slices
│   │   ├── taskSlice.ts
│   │   └── userSlice.ts
│   └── index.ts        # Store configuration
│
├── nodes/              # Data models and types
│   ├── task-node.ts    # Task data model
│   └── user-node.ts    # User data model
│
├── styles/             # Global styles and Tailwind configuration
├── public/             # Static assets
└── .env.example        # Environment variables template
```

### Layer Responsibilities

#### 1. Presentation Layer (`ds/`)
- **Purpose**: UI components following Atomic Design
- **Location**: `ds/` directory
- **Integration**: 
  - Uses components from Atomic Design system
  - Connects to Data Layer via custom hooks
  - Implements UI logic and user interactions

#### 2. Data Layer (`store/`)
- **Purpose**: State management and data flow
- **Location**: `store/` directory
- **Integration**:
  - Manages application state
  - Handles data transformations
  - Connects Presentation and Service layers

#### 3. Service Layer (`modules/*/services/`)
- **Purpose**: API communication and business logic
- **Location**: Feature-specific services in `modules/`
- **Integration**:
  - Uses `_core/api-client.ts` for HTTP requests
  - Implements business logic
  - Handles API error management

#### 4. Core Infrastructure (`_core/`)
- **Purpose**: Shared functionality and configurations
- **Location**: `_core/` directory
- **Responsibilities**:
  - Centralized API client
  - Shared hooks and utilities
  - Environment configurations
  - Third-party library interfaces

### Feature Module Structure
Each feature module (`modules/*/`) follows a consistent structure:
```
modules/feature-name/
├── actions/       # Redux actions and thunks
│   └── userActions.ts  # Example: User actions
├── hooks/         # Custom hooks connecting to data layer
│   └── useTasks.ts  # Example: Hook for task state management
├── pages/         # Pages using DS components
│   └── index.tsx   # Example: Page using DS organisms
├── schemas/       # Zod validation schemas
│   └── login-schema.ts  # Example: Form validation
├── services/      # API endpoints and BE integration
│   └── taskService.ts  # Example: API endpoints definition
└── utils/         # Module-specific utilities
    └── taskUtils.ts   # Example: Task-specific helpers
```

### Module Component Roles

#### 1. Actions (`modules/*/actions/`)
- **Purpose**: Define Redux actions and async thunks
- **Responsibilities**:
  - Action creators for state modifications
  - Async thunks for API operations
  - Manage error states
- **Example**:
```typescript
// modules/users/actions/userActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../services/auth-service";

export const loginUser = createAsyncThunk(
  "user/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await AuthService.login({ email, password });
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to login"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (
    { name, email, password }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await AuthService.register({ name, email, password });
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to register"
      );
    }
  }
);
```

#### 2. Schemas (`modules/*/schemas/`)
- **Purpose**: Define data validation schemas using Zod
- **Responsibilities**:
  - Form validation rules
  - Type inference
  - Data shape validation
- **Example**:
```typescript
// modules/users/schemas/login-schema.ts
import * as z from "zod";

export const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
```

#### 3. Pages (`modules/*/pages/`)
- **Purpose**: Use Design System components to create feature pages
- **Responsibilities**:
  - Authentication protection using `ProtectedRoute`
  - Layout composition using DS templates
  - Data and actions injection via custom hooks
- **Example**:
```typescript
// modules/tasks/pages/task-manager-page.tsx
import { ProtectedRoute } from "@/ds/wrappers/protected-auth";
import { TaskHeader } from "@/ds/molecules/task-header";
import { TaskSidebar } from "@/ds/molecules/task-sidebar";
import { TaskList } from "@/ds/organisms/task-list";
import { DashboardTemplate } from "@/ds/templates/dashboard-template";
import { useTaskManager } from "../hooks/use-task-manager";

export function TaskManagerPage() {
  // Custom hook provides data and actions
  const { tasks, stats, actions } = useTaskManager();

  return (
    <ProtectedRoute>
      <DashboardTemplate
        header={<TaskHeader />}
        sidebar={<TaskSidebar stats={stats} />}
      >
        <TaskList
          tasks={tasks}
          onAddTask={actions.addTask}
          onUpdateTask={actions.updateTask}
          onDeleteTask={actions.deleteTask}
          onToggleComplete={actions.toggleComplete}
        />
      </DashboardTemplate>
    </ProtectedRoute>
  );
}
```

#### 4. Hooks (`modules/*/hooks/`)
- **Purpose**: Connect DS components to Redux store
- **Responsibilities**:
  - Provide data and actions
  - Encapsulate business logic
- **Example**:
```typescript
// modules/tasks/hooks/use-task-manager.ts
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchTasks } from '@/store/slices/taskSlice';

export const useTaskManager = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);

  const handleAddTask = (taskData: Omit<TaskNode, 'id'>) => {
    dispatch(addTask(taskData));
  };

  const handleToggleComplete = (taskId: string) => {
    dispatch(toggleTaskCompletion(taskId));
  };

  const handleUpdateTask = (task: TaskNode) => {
    dispatch(updateTask(task));
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  return { tasks, stats: { total: tasks.length }, actions: { addTask, toggleComplete, updateTask, deleteTask } };
};
```

#### 5. Services (`modules/*/services/`)
- **Purpose**: Define API endpoints
- **Responsibilities**:
  - Handle BE communication
  - Manage API error handling
- **Example**:
```typescript
// modules/tasks/services/taskService.ts
import { apiClient } from '@/_core/api-client';

export const taskService = {
  getTasks: () => apiClient.get('/tasks'),
  createTask: (data) => apiClient.post('/tasks', data),
};
```

#### 6. Utils (`modules/*/utils/`)
- **Purpose**: Provide module-specific utilities
- **Responsibilities**:
  - Handle feature-specific logic
  - Support business operations
- **Example**:
```typescript
// modules/tasks/utils/taskUtils.ts
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchTasks } from '@/store/slices/taskSlice';

const TaskList = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    // Render tasks using atomic components
  );
};
```

### Integration Flow
1. **Actions** (`modules/*/actions/`)
   - Define state modifications
   - Handle async operations
   - Manage error states

2. **Schemas** (`modules/*/schemas/`)
   - Validate form data
   - Ensure type safety
   - Define data contracts

3. **Pages** (`modules/*/pages/`)
   - Authentication protection
   - Template-based layout
   - Component composition
   - Data and actions injection

4. **Hooks** (`modules/*/hooks/`)
   - Connect DS components to Redux store
   - Provide data and actions
   - Encapsulate business logic

5. **Services** (`modules/*/services/`)
   - Define API endpoints
   - Handle BE communication
   - Manage API error handling

6. **Utils** (`modules/*/utils/`)
   - Provide module-specific utilities
   - Handle feature-specific logic
   - Support business operations

## Architecture

### Core Architecture Principles
Jaseci Forge follows a modular, scalable architecture designed for maintainability and scalability. The architecture is built around several key principles:

1. **Three-Layer Architecture**: Clear separation between Presentation, Data, and Service layers
2. **Atomic Design**: UI components organized following atomic design principles
3. **State Management**: Centralized state management using Redux Toolkit
4. **Type Safety**: Full TypeScript support throughout the application
5. **API Integration**: Structured API client with interceptors and error handling
6. **Core Infrastructure**: Centralized configuration and utilities through `_core`

### Three-Layer Architecture

#### 1. Presentation Layer (UI)
- **Location**: `ds/` directory
- **Pattern**: Atomic Design System
- **Components**:
  - Atoms: Basic building blocks (buttons, inputs)
  - Molecules: Combinations of atoms
  - Organisms: Complex UI components
  - Templates: Page-level components
- **Integration**: Connected to Data Layer through custom hooks

#### 2. Data Layer (State Management)
- **Location**: `store/` directory
- **Technology**: Redux Toolkit
- **Components**:
  - Slices: Feature-specific state management
  - Selectors: State access patterns
  - Actions: State modifications
- **Integration**: 
  - Connected to Presentation Layer via custom hooks
  - Connected to Service Layer through async thunks

#### 3. Service Layer (API)
- **Location**: `_core/api-client.ts` and feature-specific services
- **Technology**: Axios
- **Components**:
  - API Client: Centralized HTTP client
  - Interceptors: Request/response handling
  - Services: Feature-specific API calls
- **Integration**: Connected to Data Layer through async thunks

### Core Infrastructure (`_core/`)

The `_core` directory serves as the central hub for shared functionality and third-party integrations:

```
_core/
├── api-client.ts    # Centralized API client configuration
├── hooks/           # Shared React hooks
├── keys.ts         # Environment and configuration keys
├── app-configs.ts  # Application-wide configurations
└── utils.ts        # Shared utility functions
```

#### Key Responsibilities

1. **API Client Management**
```typescript
// _core/api-client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // Global configurations
});

// Interceptors for authentication, error handling, etc.
apiClient.interceptors.request.use(/* ... */);
apiClient.interceptors.response.use(/* ... */);
```

2. **Shared Hooks**
```typescript
// _core/hooks/useApi.ts
export const useApi = () => {
  // Common API hook logic
};

// _core/hooks/useAuth.ts
export const useAuth = () => {
  // Authentication hook logic
};
```

3. **Configuration Management**
```typescript
// _core/keys.ts
export const API_KEYS = {
  // API endpoints
};

export const APP_CONFIG = {
  // Application settings
};
```

### Layer Integration Example

```typescript
// 1. Service Layer (API)
// modules/tasks/services/taskService.ts
import { apiClient } from '@/_core/api-client';

export const taskService = {
  getTasks: () => apiClient.get('/tasks'),
  createTask: (data) => apiClient.post('/tasks', data),
};

// 2. Data Layer (Redux)
// store/slices/taskSlice.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '@/modules/tasks/services/taskService';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    const response = await taskService.getTasks();
    return response.data;
  }
);

// 3. Presentation Layer (UI)
// modules/tasks/components/TaskList.tsx
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchTasks } from '@/store/slices/taskSlice';

const TaskList = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    // Render tasks using atomic components
  );
};
```

### Best Practices for Layer Integration

1. **Presentation Layer**
   - Use atomic design components from `ds/`
   - Access state through custom hooks
   - Keep UI logic separate from business logic

2. **Data Layer**
   - Organize state by feature
   - Use TypeScript for type safety
   - Implement proper error handling

3. **Service Layer**
   - Centralize API calls in services
   - Use the `_core` API client
   - Implement proper error handling and retries

4. **Core Infrastructure**
   - Keep third-party library usage in `_core`
   - Provide type-safe interfaces
   - Document shared utilities and hooks

### Directory Structure & Responsibilities

```
my-app/
├── _core/           # Core application infrastructure
│   ├── api/         # API client, interceptors, and base configurations
│   ├── hooks/       # Shared React hooks
│   └── utils/       # Utility functions and helpers
│
├── app/             # Next.js app router pages and layouts
│   ├── (auth)/      # Authentication-related pages
│   ├── (dashboard)/ # Dashboard and main application pages
│   └── layout.tsx   # Root layout configuration
│
├── ds/              # Design System (Atomic Design)
│   ├── atoms/       # Basic building blocks (buttons, inputs)
│   ├── molecules/   # Combinations of atoms
│   ├── organisms/   # Complex UI components
│   └── templates/   # Page-level components
│
├── modules/         # Feature modules
│   ├── tasks/       # Task management feature
│   │   ├── actions/   # Redux actions and thunks
│   │   ├── hooks/     # Feature-specific hooks
│   │   ├── pages/     # Feature-specific pages
│   │   └── services/  # API services for the feature
│   └── users/       # User management feature
│
├── nodes/           # Data models and types
│   ├── task-node.ts # Task data model
│   └── user-node.ts # User data model
│
├── store/           # Redux store configuration
│   ├── slices/      # Redux Toolkit slices
│   └── index.ts     # Store configuration
│
├── styles/          # Global styles and Tailwind configuration
└── public/          # Static assets
```

### Key Architectural Components

#### 1. Core Infrastructure (`_core/`)
- **API Client**: Centralized API handling with interceptors for authentication and error handling
- **Hooks**: Reusable React hooks for common functionality
- **Utils**: Shared utility functions and constants

#### 2. Design System (`ds/`)
- **Atomic Design**: Components organized in a hierarchical structure
- **Reusability**: Components designed for maximum reusability
- **Consistency**: Maintained through shared styling and behavior patterns

#### 3. Feature Modules (`modules/`)
- **Self-Contained**: Each module contains its own logic, UI, and services
- **Scalable**: Easy to add new features without affecting existing ones
- **Maintainable**: Clear boundaries between different features

#### 4. State Management (`store/`)
- **Redux Toolkit**: Centralized state management
- **Slices**: Feature-specific state slices
- **Middleware**: Custom middleware for side effects

### Redux Implementation & Data Flow

#### Store Configuration
```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    // Add your reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(/* your middleware */),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

#### Redux Data Flow Pattern

1. **State Definition**
```typescript
// store/slices/taskSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskNode } from '@/nodes/task-node';

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
    addTask: (state, action: PayloadAction<Omit<TaskNode, 'id'>>) => {
      const newTask = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.tasks.push(newTask);
    },
    toggleTaskCompletion: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    updateTask: (state, action: PayloadAction<TaskNode>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
  },
});

export const { addTask, toggleTaskCompletion, updateTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
```

2. **Component Usage**
```typescript
// components/TaskList.tsx
import { useAppDispatch, useAppSelector } from '@/store';
import { addTask, toggleTaskCompletion, updateTask, deleteTask } from '@/store/slices/taskSlice';

const TaskList = () => {
  const dispatch = useAppDispatch();
  const { tasks, isLoading, error } = useAppSelector((state) => state.tasks);

  // Dispatch actions
  const handleAddTask = (taskData: Omit<TaskNode, 'id'>) => {
    dispatch(addTask(taskData));
  };

  const handleToggleComplete = (taskId: string) => {
    dispatch(toggleTaskCompletion(taskId));
  };

  const handleUpdateTask = (task: TaskNode) => {
    dispatch(updateTask(task));
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  return (
    // Component JSX
  );
};
```

#### Redux Best Practices

1. **Type Safety**
   - Use `useAppDispatch` and `useAppSelector` for type-safe Redux operations
   - Define proper TypeScript interfaces for state and actions
   - Leverage Redux Toolkit's built-in TypeScript support
   - Use `PayloadAction` type for action payloads

2. **State Organization**
   - Organize state by feature using slices
   - Keep related state together in the same slice
   - Include loading and error states for async operations
   - Use normalized state shape for complex data

3. **Action Patterns**
   - Use Redux Toolkit's `createSlice` for simpler action creation
   - Implement atomic actions for each state modification
   - Keep actions focused and single-purpose
   - Use proper TypeScript types for action payloads

4. **Performance Optimization**
   - Use selective state subscription with `useAppSelector`
   - Implement memoization for expensive computations
   - Leverage Redux Toolkit's built-in immutability
   - Use proper state updates to trigger minimal re-renders

#### Example Feature Implementation

```typescript
// store/slices/taskSlice.ts
export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Synchronous actions
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Async action handling
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
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

// Async action creator
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    const response = await api.getTasks();
    return response.data;
  }
);
```

#### 5. Data Models (`nodes/`)
- **Type Safety**: Strongly typed data models
- **Validation**: Runtime type checking and validation
- **Consistency**: Shared data structures across the application

### Authentication Flow
1. **Token Management**: JWT tokens stored securely
2. **Protected Routes**: Route protection using Next.js middleware
3. **API Integration**: Automatic token injection in API requests

### API Integration
1. **Base Configuration**: Centralized API client setup
2. **Interceptors**: Request/response interceptors for common operations
3. **Error Handling**: Consistent error handling across the application

### Development Workflow
1. **Component Development**: Using Storybook for isolated development
2. **Testing**: Unit and integration testing with React Testing Library
3. **Type Safety**: TypeScript for compile-time type checking

## Available Commands
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Run the production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests (if testing library was included)
- `npm run storybook` - Start Storybook (if Storybook was included)

## Environment Configuration
The `.env.example` file contains templates for all required environment variables. Copy this file to `.env.local` and update the values according to your needs:

```
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_AUTH_PROVIDER=local

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [ShadCN UI Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Troubleshooting
If you encounter any issues during setup or development:
1. Ensure Node.js is properly installed and up to date
2. Verify that all environment variables are correctly set
3. Check that your package manager is correctly installed
4. Clear your browser cache if you experience UI issues

## Contributing
Contributions to Jaseci Forge are welcome! Please refer to our contribution guidelines for more information.

## How To: Creating a New Feature

This guide demonstrates how to create a new feature following our layered architecture approach, from service layer to presentation layer.

### 1. Define Node Types
First, define your data types in the `nodes` folder to match your backend models:

```typescript
// nodes/task-node.ts
export interface TaskNode {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// nodes/user-node.ts
export interface UserNode {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}
```

These node types will be used throughout the application to ensure type safety and consistency with the backend.

### 2. Service Layer: Define API Endpoints
Next, define your API endpoints in the service layer:

```typescript
// modules/tasks/services/taskService.ts
import { apiClient } from '@/_core/api-client';

export const taskService = {
  // Define all API endpoints
  getTasks: () => apiClient.get('/api/tasks'),
  createTask: (data) => apiClient.post('/api/tasks', data),
  updateTask: (id, data) => apiClient.put(`/api/tasks/${id}`, data),
  deleteTask: (id) => apiClient.delete(`/api/tasks/${id}`),
};
```

### 3. Data Layer: Create Actions and Redux Store
Next, create actions that will trigger the API calls and update the store:

```typescript
// modules/tasks/actions/taskActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '../services/taskService';
import { TaskNode } from '@/nodes/task-node';

// Create async thunks for API operations
export const fetchTasks = createAsyncThunk<TaskNode[]>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskService.getTasks();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add more actions for other operations
export const createTask = createAsyncThunk<TaskNode, Omit<TaskNode, 'id'>>(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await taskService.createTask(taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Redux slice with extra reducers
interface TasksState {
  items: TaskNode[];
  isLoading: boolean;
  error: string | null;
}

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  } as TasksState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});
```

### 4. Presentation Layer: Create Custom Hooks
Create custom hooks to connect the data layer with the presentation layer:

```typescript
// modules/tasks/hooks/useTaskManager.ts
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchTasks, createTask } from '../actions/taskActions';
import { TaskNode } from '@/nodes/task-node';

export const useTaskManager = () => {
  const dispatch = useAppDispatch();
  const { items: tasks, isLoading, error } = useAppSelector((state) => state.tasks);

  // Actions
  const loadTasks = () => dispatch(fetchTasks());
  const addTask = (taskData: Omit<TaskNode, 'id'>) => dispatch(createTask(taskData));

  return {
    tasks,
    isLoading,
    error,
    actions: {
      loadTasks,
      addTask,
    },
  };
};
```

### 5. Create Design System Components
Create the necessary organisms in the design system:

```typescript
// ds/organisms/task-list.tsx
import { TaskCard } from '@/ds/molecules/task-card';
import { TaskNode } from '@/nodes/task-node';

interface TaskListProps {
  tasks: TaskNode[];
  onAddTask: (task: Omit<TaskNode, 'id'>) => void;
  onUpdateTask: (task: TaskNode) => void;
}

export const TaskList = ({ tasks, onAddTask, onUpdateTask }: TaskListProps) => {
  return (
    <div>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdate={onUpdateTask}
        />
      ))}
    </div>
  );
};
```

### 6. Create the Page Component
Create the page component using the template and custom hook:

```typescript
// modules/tasks/pages/task-manager-page.tsx
import { ProtectedRoute } from "@/ds/wrappers/protected-auth";
import { TaskList } from "@/ds/organisms/task-list";
import { DashboardTemplate } from "@/ds/templates/dashboard-template";
import { useTaskManager } from "../hooks/useTaskManager";

export function TaskManagerPage() {
  const { tasks, isLoading, actions } = useTaskManager();

  return (
    <ProtectedRoute>
      <DashboardTemplate
        header={<TaskHeader />}
        sidebar={<TaskSidebar />}
      >
        <TaskList
          tasks={tasks}
          onAddTask={actions.addTask}
          onUpdateTask={actions.updateTask}
        />
      </DashboardTemplate>
    </ProtectedRoute>
  );
}
```

### 7. Add Route Configuration
Finally, add the page to your Next.js routes:

```typescript
// app/page.tsx
import { TaskManagerPage } from "@/modules/tasks/pages/task-manager-page";

export default function Home() {
  return <TaskManagerPage />;
}
```

### Complete Flow
1. **Node Types** (`nodes/`)
   - Define data types
   - Match backend models
   - Ensure type safety

2. **Service Layer** (`services/`)
   - Define API endpoints
   - Handle API communication
   - Manage error handling

3. **Data Layer** (`actions/` + `store/`)
   - Create async thunks
   - Define Redux slice
   - Handle state updates

4. **Presentation Layer** (`hooks/` + `pages/`)
   - Create custom hooks
   - Connect to Redux store
   - Compose UI components

5. **Design System** (`ds/`)
   - Create organisms
   - Use atomic design
   - Maintain consistency

6. **Routing** (`app/`)
   - Configure routes
   - Add page components
   - Handle navigation

This layered approach ensures:
- Clear separation of concerns
- Type safety throughout the application
- Reusable components and logic
- Maintainable and scalable codebase
- Consistent data structures with backend