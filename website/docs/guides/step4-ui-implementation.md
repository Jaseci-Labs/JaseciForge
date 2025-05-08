# Step 4: UI Implementation

Let's create the UI components for our Task Manager using the design system components.

## Create Task Components

### Task Card Component

```typescript
// modules/tasks/components/task-card.tsx
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TaskNode } from '@/nodes/task-node';
import { formatDate } from '@/utils/date';

interface TaskCardProps {
  task: TaskNode;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TaskCard({ task, onToggleComplete, onDelete }: TaskCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
          />
          <h3 className={`text-lg font-semibold ${task.completed ? 'line-through' : ''}`}>
            {task.title}
          </h3>
        </div>
        <Badge variant={task.priority === 'high' ? 'destructive' : 'default'}>
          {task.priority}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{task.description}</p>
        {task.dueDate && (
          <p className="text-sm text-gray-500 mt-2">
            Due: {formatDate(task.dueDate)}
          </p>
        )}
        <div className="flex gap-2 mt-2">
          {task.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### Task List Component

```typescript
// modules/tasks/components/task-list.tsx
import { useTaskManager } from '../hooks/use-task-manager';
import { TaskCard } from './task-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function TaskList() {
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
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={actions.toggleComplete}
          onDelete={actions.deleteTask}
        />
      ))}
    </div>
  );
}
```

### Task Form Component

```typescript
// modules/tasks/components/task-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { TaskFormData, taskSchema } from '../schemas/task-schema';
import { useTaskManager } from '../hooks/use-task-manager';

export function TaskForm() {
  const { actions } = useTaskManager();
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      tags: [],
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    await actions.addTask(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Add Task</Button>
      </form>
    </Form>
  );
}
```

## Create Task Stats Component

```typescript
// modules/tasks/components/task-stats.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskStats } from '../hooks/use-task-stats';

export function TaskStats() {
  const stats = useTaskStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.total}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.completed}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.pending}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>High Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.highPriority}</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Update Task Manager Page

```typescript
// modules/tasks/pages/task-manager-page.tsx
import { DashboardTemplate } from '@/templates/dashboard-template';
import { TaskList } from '../components/task-list';
import { TaskForm } from '../components/task-form';
import { TaskStats } from '../components/task-stats';

export default function TaskManagerPage() {
  return (
    <DashboardTemplate>
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
            <TaskList />
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
}
```

## Verify UI Implementation

1. Check that all components render correctly
2. Test form validation
3. Verify task creation and updates
4. Confirm stats update in real-time
5. Test responsive layout

## Next Steps

In the next step, we'll:
1. Add error boundaries
2. Implement optimistic updates
3. Add animations and transitions

[Continue to Step 5: Advanced Features →](./step5-advanced-features.md) 