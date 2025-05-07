# Core Infrastructure

## Overview
The core infrastructure provides essential utilities, configurations, and shared functionality that support the entire application. It includes authentication, routing, state management, and other foundational services.

## Directory Structure
```
core/               # Core infrastructure
├── auth/          # Authentication utilities
├── config/        # Application configuration
├── router/        # Routing configuration
├── store/         # State management
└── utils/         # Shared utilities
```

## Core Components

### 1. Authentication
- User authentication
- Session management
- Token handling
- Authorization

### 2. Configuration
- Environment variables
- Feature flags
- API endpoints
- Application settings

### 3. Routing
- Route definitions
- Navigation guards
- Route parameters
- Layout management

### 4. State Management
- Store configuration
- Middleware setup
- Action creators
- Selectors

## Implementation

### 1. Authentication
```typescript
// core/auth/authService.ts
import { User } from '@/types';

export class AuthService {
  static async login(email: string, password: string): Promise<User> {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return user;
  }

  static async logout(): Promise<void> {
    localStorage.removeItem('token');
    await apiClient.post('/auth/logout');
  }

  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
```

### 2. Configuration
```typescript
// core/config/appConfig.ts
export const appConfig = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
  },
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
  },
  features: {
    enableNotifications: true,
    enableAnalytics: false,
  },
  routes: {
    home: '/',
    login: '/login',
    register: '/register',
    dashboard: '/dashboard',
  },
} as const;

// core/config/env.ts
export const env = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;
```

### 3. Routing
```typescript
// core/router/routes.ts
import { RouteConfig } from '@/types';

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: HomePage,
    public: true,
  },
  {
    path: '/login',
    component: LoginPage,
    public: true,
  },
  {
    path: '/dashboard',
    component: DashboardPage,
    public: false,
    children: [
      {
        path: 'tasks',
        component: TasksPage,
      },
      {
        path: 'profile',
        component: ProfilePage,
      },
    ],
  },
];

// core/router/guards.ts
export const authGuard = async (to: Route, from: Route, next: Function) => {
  if (!to.meta.public && !AuthService.isAuthenticated()) {
    next('/login');
    return;
  }
  next();
};
```

### 4. State Management
```typescript
// core/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import { tasksReducer } from './slices/tasksSlice';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger, errorHandler),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Shared Utilities

### 1. API Client
```typescript
// core/utils/apiClient.ts
import axios from 'axios';
import { appConfig } from '../config/appConfig';

const apiClient = axios.create({
  baseURL: appConfig.api.baseUrl,
  timeout: appConfig.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(appConfig.auth.tokenKey);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### 2. Error Handling
```typescript
// core/utils/errorHandler.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown): never => {
  if (error instanceof AppError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new AppError(
      error.message,
      'INTERNAL_ERROR',
      500
    );
  }

  throw new AppError(
    'An unexpected error occurred',
    'UNKNOWN_ERROR',
    500
  );
};
```

### 3. Logger
```typescript
// core/utils/logger.ts
export const logger = {
  info: (message: string, ...args: any[]) => {
    if (env.isDevelopment) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
};
```

## Best Practices

1. **Authentication**
   - Implement proper token management
   - Handle token refresh
   - Secure storage
   - Proper error handling

2. **Configuration**
   - Use environment variables
   - Type-safe configuration
   - Feature flags
   - Centralized settings

3. **Routing**
   - Type-safe routes
   - Proper guards
   - Lazy loading
   - Error boundaries

4. **State Management**
   - Proper store structure
   - Type-safe actions
   - Memoized selectors
   - Middleware usage

## Integration with Other Layers

### 1. Service Layer Integration
```typescript
// core/services/apiService.ts
import apiClient from '../utils/apiClient';
import { handleError } from '../utils/errorHandler';

export class ApiService {
  static async request<T>(config: RequestConfig): Promise<T> {
    try {
      const response = await apiClient.request(config);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  }
}
```

### 2. Presentation Layer Integration
```typescript
// core/hooks/useAuth.ts
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AuthService } from '../auth/authService';
import { setUser } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();

  const login = useCallback(async (email: string, password: string) => {
    const user = await AuthService.login(email, password);
    dispatch(setUser(user));
    return user;
  }, [dispatch]);

  return {
    login,
  };
};
``` 