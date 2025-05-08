# Step 5: Advanced Features

Let's enhance our Task Manager with advanced features for better user experience and reliability.

## Add Error Boundary

```typescript
// modules/tasks/components/error-boundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class TaskErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {this.state.error?.message || 'An unexpected error occurred'}
          </AlertDescription>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </Button>
        </Alert>
      );
    }

    return this.props.children;
  }
}
```

## Implement Optimistic Updates

```typescript
// modules/tasks/hooks/use-optimistic-tasks.ts
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { TaskNode } from '@/nodes/task-node';
import { taskSlice } from '@/store/taskSlice';

export function useOptimisticTasks() {
  const dispatch = useDispatch();

  const optimisticUpdate = useCallback(async (
    id: number,
    updateFn: (task: TaskNode) => Partial<TaskNode>,
    apiCall: () => Promise<TaskNode>
  ) => {
    // Get current task
    const currentTask = dispatch(taskSlice.actions.getTask(id));
    if (!currentTask) return;

    // Create optimistic update
    const optimisticTask = {
      ...currentTask,
      ...updateFn(currentTask),
    };

    // Update UI immediately
    dispatch(taskSlice.actions.updateItem(optimisticTask));

    try {
      // Make API call
      const updatedTask = await apiCall();
      // Update with real data
      dispatch(taskSlice.actions.updateItem(updatedTask));
    } catch (error) {
      // Revert on error
      dispatch(taskSlice.actions.updateItem(currentTask));
      throw error;
    }
  }, [dispatch]);

  return { optimisticUpdate };
}
```

## Add Animations

```typescript
// modules/tasks/components/animated-task-card.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { TaskCard } from './task-card';
import { TaskNode } from '@/nodes/task-node';

interface AnimatedTaskCardProps {
  task: TaskNode;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export function AnimatedTaskCard(props: AnimatedTaskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <TaskCard {...props} />
    </motion.div>
  );
}
```

## Update Task List with Animations

```typescript
// modules/tasks/components/animated-task-list.tsx
import { AnimatePresence } from 'framer-motion';
import { useTaskManager } from '../hooks/use-task-manager';
import { AnimatedTaskCard } from './animated-task-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AnimatedTaskList() {
  const { tasks, isLoading, error, actions } = useTaskManager();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <div className="space-y-4">
        {tasks.map((task) => (
          <AnimatedTaskCard
            key={task.id}
            task={task}
            onToggleComplete={actions.toggleComplete}
            onDelete={actions.deleteTask}
          />
        ))}
      </div>
    </AnimatePresence>
  );
}
```

## Add Loading States

```typescript
// modules/tasks/components/loading-states.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function TaskCardSkeleton() {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}

export function TaskStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-4 border rounded-lg">
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}
```

## Update Task Manager Page

```typescript
// modules/tasks/pages/task-manager-page.tsx
import { DashboardTemplate } from '@/templates/dashboard-template';
import { AnimatedTaskList } from '../components/animated-task-list';
import { TaskForm } from '../components/task-form';
import { TaskStats } from '../components/task-stats';
import { TaskErrorBoundary } from '../components/error-boundary';

export default function TaskManagerPage() {
  return (
    <DashboardTemplate>
      <TaskErrorBoundary>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Task Manager</h1>
          
          <TaskStats />
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
              <TaskForm />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Tasks</h2>
              <AnimatedTaskList />
            </div>
          </div>
        </div>
      </TaskErrorBoundary>
    </DashboardTemplate>
  );
}
```

## Verify Advanced Features

1. Test error boundary by simulating errors
2. Verify optimistic updates work correctly
3. Check animations and transitions
4. Test loading states
5. Verify error handling and recovery

## Next Steps

You've now completed the Task Manager implementation! Here's what you can do next:

1. Add more features:
   - Task filtering and sorting
   - Task categories and labels
   - Due date reminders
   - Task sharing

2. Enhance the UI:
   - Add dark mode support
   - Implement drag-and-drop reordering
   - Add task search functionality
   - Create task detail view

3. Improve performance:
   - Implement virtual scrolling for large lists
   - Add data caching
   - Optimize bundle size
   - Add service worker for offline support

4. Add testing:
   - Unit tests for hooks and utilities
   - Integration tests for components
   - End-to-end tests for workflows
   - Performance testing

[Back to Overview →](../index.md) 