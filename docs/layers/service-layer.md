# Service Layer

## Overview
The service layer handles all external communications and business logic. It provides a clean interface for interacting with APIs, managing data transformations, and implementing business rules.

## Directory Structure
```
services/           # Service implementations
├── api/           # API clients and configurations
├── transformers/  # Data transformation utilities
└── validators/    # Data validation utilities
```

## Core Components

### 1. API Services
- HTTP client configuration
- API endpoint definitions
- Request/response handling
- Error management

### 2. Data Transformers
- Data normalization
- Type conversions
- Response formatting
- Request payload preparation

### 3. Validators
- Input validation
- Schema validation
- Business rule validation
- Error reporting

## Implementation

### 1. API Client
```typescript
// services/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2. Service Implementation
```typescript
// services/taskService.ts
import apiClient from './api/client';
import { TaskNode } from '@/types';
import { transformTask } from './transformers/taskTransformer';
import { validateTask } from './validators/taskValidator';

export class TaskService {
  static async getTasks(): Promise<TaskNode[]> {
    const response = await apiClient.get('/tasks');
    return response.data.map(transformTask);
  }

  static async createTask(taskData: Partial<TaskNode>): Promise<TaskNode> {
    const validationResult = validateTask(taskData);
    if (!validationResult.isValid) {
      throw new Error(validationResult.errors.join(', '));
    }

    const response = await apiClient.post('/tasks', taskData);
    return transformTask(response.data);
  }

  static async updateTask(id: string, taskData: Partial<TaskNode>): Promise<TaskNode> {
    const validationResult = validateTask(taskData);
    if (!validationResult.isValid) {
      throw new Error(validationResult.errors.join(', '));
    }

    const response = await apiClient.put(`/tasks/${id}`, taskData);
    return transformTask(response.data);
  }

  static async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  }
}
```

### 3. Data Transformer
```typescript
// services/transformers/taskTransformer.ts
import { TaskNode } from '@/types';

export const transformTask = (data: any): TaskNode => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    dueDate: new Date(data.dueDate),
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
};
```

### 4. Validator
```typescript
// services/validators/taskValidator.ts
import { TaskNode } from '@/types';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateTask = (data: Partial<TaskNode>): ValidationResult => {
  const errors: string[] = [];

  if (!data.title) {
    errors.push('Title is required');
  }

  if (data.title && data.title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }

  if (data.dueDate && new Date(data.dueDate) < new Date()) {
    errors.push('Due date must be in the future');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
```

## Error Handling

### 1. Custom Error Classes
```typescript
// services/errors/ServiceError.ts
export class ServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export class ValidationError extends ServiceError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class NotFoundError extends ServiceError {
  constructor(message: string) {
    super(message, 404, 'NOT_FOUND');
  }
}
```

### 2. Error Handling Middleware
```typescript
// services/middleware/errorHandler.ts
import { ServiceError } from '../errors/ServiceError';

export const handleServiceError = (error: unknown): never => {
  if (error instanceof ServiceError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new ServiceError(
      error.message,
      500,
      'INTERNAL_SERVER_ERROR'
    );
  }

  throw new ServiceError(
    'An unexpected error occurred',
    500,
    'INTERNAL_SERVER_ERROR'
  );
};
```

## Best Practices

1. **API Design**
   - Use consistent endpoint naming
   - Implement proper error handling
   - Use appropriate HTTP methods
   - Follow RESTful principles

2. **Data Transformation**
   - Keep transformations pure
   - Handle edge cases
   - Maintain type safety
   - Document transformations

3. **Validation**
   - Validate early
   - Provide clear error messages
   - Use schema validation
   - Handle all edge cases

4. **Error Handling**
   - Use custom error classes
   - Implement proper error logging
   - Provide meaningful error messages
   - Handle all error cases

## Integration with Data Layer

### 1. Redux Integration
```typescript
// services/taskService.ts
export const fetchTasks = async () => {
  try {
    const tasks = await TaskService.getTasks();
    return tasks;
  } catch (error) {
    handleServiceError(error);
  }
};
```

### 2. Custom Hook Integration
```typescript
// hooks/useTaskService.ts
export const useTaskService = () => {
  const dispatch = useAppDispatch();

  const createTask = async (taskData: Partial<TaskNode>) => {
    try {
      const task = await TaskService.createTask(taskData);
      dispatch(addTask(task));
      return task;
    } catch (error) {
      handleServiceError(error);
    }
  };

  return {
    createTask,
  };
};
``` 