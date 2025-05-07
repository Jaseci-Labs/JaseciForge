# Presentation Layer

## Overview
The presentation layer is responsible for the user interface and user interactions. It follows the Atomic Design methodology and is built using Next.js, TypeScript, and Tailwind CSS.

## Directory Structure
```
ds/                 # Design System
├── atoms/          # Basic building blocks
├── molecules/      # Combinations of atoms
├── organisms/      # Complex UI components
└── templates/      # Page-level components

modules/            # Feature modules
├── tasks/          # Task management feature
│   ├── components/ # Module-specific components
│   ├── hooks/      # Custom hooks
│   ├── pages/      # Pages using DS components
│   └── utils/      # Module-specific utilities
└── users/          # User management feature
    ├── components/
    ├── hooks/
    ├── pages/
    └── utils/
```

## Core Components

### 1. Atoms
Basic building blocks of the UI:
- Buttons
- Inputs
- Typography
- Icons

### 2. Molecules
Combinations of atoms:
- Form fields
- Search bars
- Navigation items
- Cards

### 3. Organisms
Complex UI components:
- Navigation bars
- Forms
- Data tables
- Modals

### 4. Templates
Page-level components:
- Layouts
- Grids
- Page structures

## Feature Modules

### Overview
Feature modules are self-contained units that implement specific business functionality. Each module follows a consistent structure and integrates with the design system components.

### Module Structure
```
modules/
└── feature-name/
    ├── components/     # Module-specific components
    │   ├── index.ts    # Component exports
    │   └── Component.tsx
    ├── hooks/          # Custom hooks
    │   ├── index.ts    # Hook exports
    │   └── useFeature.ts
    ├── pages/          # Pages using DS components
    │   ├── index.ts    # Page exports
    │   └── Page.tsx
    └── utils/          # Module-specific utilities
        ├── index.ts    # Utility exports
        └── helpers.ts
```

### Module Components
Module components should:
- Use design system components as building blocks
- Implement module-specific business logic
- Handle module-specific state
- Follow consistent naming conventions
- Be properly typed with TypeScript

Example:
```typescript
// modules/tasks/components/TaskList.tsx
import { Card } from '@/ds/molecules/Card';
import { Button } from '@/ds/atoms/Button';
import { useTaskList } from '../hooks/useTaskList';

export const TaskList = () => {
  const { tasks, loading, error } = useTaskList();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <Card>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </Card>
  );
};
```

### Module Hooks
Module hooks should:
- Encapsulate module-specific logic
- Handle data fetching and state management
- Provide a clean API for components
- Follow React hooks best practices

Example:
```typescript
// modules/tasks/hooks/useTaskList.ts
import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/taskService';

export const useTaskList = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getTasks,
  });
};
```

### Module Pages
Module pages should:
- Use design system templates
- Compose module components
- Handle routing and navigation
- Implement page-level logic

Example:
```typescript
// modules/tasks/pages/TaskPage.tsx
import { PageTemplate } from '@/ds/templates/PageTemplate';
import { TaskList } from '../components/TaskList';
import { TaskFilters } from '../components/TaskFilters';

export const TaskPage = () => {
  return (
    <PageTemplate>
      <TaskFilters />
      <TaskList />
    </PageTemplate>
  );
};
```

### Module Utilities
Module utilities should:
- Provide helper functions
- Handle data transformations
- Implement module-specific logic
- Follow functional programming principles

Example:
```typescript
// modules/tasks/utils/taskHelpers.ts
export const formatTaskDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};
```

## Best Practices

### 1. Component Development
- Use TypeScript for type safety
- Follow atomic design principles
- Implement proper error handling
- Ensure accessibility
- Write comprehensive tests

### 2. State Management
- Use React Query for server state
- Implement proper loading states
- Handle errors gracefully
- Cache data appropriately

### 3. Performance
- Implement code splitting
- Use proper memoization
- Optimize re-renders
- Follow React best practices

### 4. Testing
- Write unit tests for components
- Test user interactions
- Verify accessibility
- Implement integration tests

## Integration with Other Layers

### 1. Data Layer
- Use Redux for global state
- Implement proper selectors
- Handle loading states
- Manage error states

### 2. Service Layer
- Use React Query for data fetching
- Handle API errors
- Implement proper caching
- Manage loading states

### 3. Core Infrastructure
- Use shared utilities
- Implement proper routing
- Handle authentication
- Manage configuration

## Examples

### 1. Component with Data Fetching
```typescript
// modules/tasks/components/TaskDetails.tsx
import { useTask } from '../hooks/useTask';
import { Card } from '@/ds/molecules/Card';
import { LoadingSpinner } from '@/ds/atoms/LoadingSpinner';

export const TaskDetails = ({ taskId }: { taskId: string }) => {
  const { data: task, isLoading } = useTask(taskId);

  if (isLoading) return <LoadingSpinner />;

  return (
    <Card>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
    </Card>
  );
};
```

### 2. Form Component
```typescript
// modules/tasks/components/TaskForm.tsx
import { useForm } from 'react-hook-form';
import { Input } from '@/ds/atoms/Input';
import { Button } from '@/ds/atoms/Button';
import { useCreateTask } from '../hooks/useCreateTask';

export const TaskForm = () => {
  const { register, handleSubmit } = useForm();
  const { mutate: createTask } = useCreateTask();

  return (
    <form onSubmit={handleSubmit(createTask)}>
      <Input {...register('title')} />
      <Button type="submit">Create Task</Button>
    </form>
  );
};
```

### 3. List Component
```typescript
// modules/tasks/components/TaskList.tsx
import { useTaskList } from '../hooks/useTaskList';
import { Card } from '@/ds/molecules/Card';
import { TaskItem } from './TaskItem';

export const TaskList = () => {
  const { data: tasks } = useTaskList();

  return (
    <Card>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </Card>
  );
};
```

## Troubleshooting

### Common Issues

1. **Component Rendering**
   - Check prop types
   - Verify component hierarchy
   - Debug state management
   - Check for infinite loops

2. **Data Fetching**
   - Verify API endpoints
   - Check error handling
   - Debug loading states
   - Verify data caching

3. **State Management**
   - Check Redux store
   - Verify selectors
   - Debug actions
   - Check middleware

### Debugging Tips

1. Use React DevTools:
   - Inspect component hierarchy
   - Check props and state
   - Debug performance
   - Monitor re-renders

2. Check Network Requests:
   - Verify API calls
   - Check response data
   - Debug error handling
   - Monitor loading states

3. Review Console:
   - Check for errors
   - Debug warnings
   - Monitor performance
   - Verify logging 