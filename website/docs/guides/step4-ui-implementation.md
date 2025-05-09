# Step 4: UI Implementation

Let's create the UI components for our Task Manager using the design system components following Atomic Design principles.

## Adding shadcn/ui Components

Before implementing our components, we need to add the required shadcn/ui components to our design system. Follow these steps:

1. Visit [shadcn/ui Components](https://ui.shadcn.com/docs/components)
2. Find the component you need (e.g., Alert, Skeleton)
3. Use the CLI to add the component:

```bash
# Add Alert component
npx shadcn@latest add alert

# Add Skeleton component
npx shadcn@latest add skeleton
```

<!-- if this fail foolow their manual installation -->




The CLI will:
- Add the component to `ds/atoms/`
- Add necessary dependencies
- Update your `components.json`

> If the CLI installation fails, you can manually install components:

1. Create the component file in `ds/atoms/`:
2. Add the component form their website manually
3. make sure to change the `@/lib/utils` to `@/_core/utils` when adding manually.

For example, to add the Alert component:
1. Go to [Alert Documentation](https://ui.shadcn.com/docs/components/alert)
2. Run `npx shadcn@latest add alert`
3. Import and use in your components:
```typescript
import { Alert, AlertDescription } from "@/ds/atoms/alert";
```

## Utility Functions

Before creating components, let's set up utility functions that can be used across the project.

### Core Utilities

For utilities that are used across multiple modules, add them to the core utils:

```typescript
// @/_core/utils/date.ts
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function isOverdue(date: string | Date): boolean {
  return new Date(date) < new Date();
}
```

### Module-Specific Utilities

For utilities specific to a module, keep them in the module's utils folder:

```typescript
// modules/tasks/utils/index.ts
import { TaskNode } from '@/nodes/task-node';

export function getTaskStatus(task: TaskNode): 'completed' | 'pending' | 'overdue' {
  if (task.completed) return 'completed';
  if (task.dueDate && new Date(task.dueDate) < new Date()) return 'overdue';
  return 'pending';
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-yellow-500';
    case 'low': return 'text-green-500';
    default: return 'text-gray-500';
  }
}
```

## Create Task Components

### Task Card (Organism)

```typescript
// ds/organisms/TaskCard.tsx
import { Card, CardContent, CardHeader, CardFooter } from "@/ds/atoms/card";
import { Badge } from "@/ds/atoms/badge";
import { Button } from "@/ds/atoms/button";
import { Checkbox } from "@/ds/atoms/checkbox";
import { TaskNode } from "@/nodes/task-node";
import { formatDate } from '@/_core/utils/date';

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

### Task List (Organism)

```typescript
// ds/organisms/TaskList.tsx
import { useTaskManager } from "@/modules/tasks/hooks/use-task-manager";
import { TaskCard } from '@/ds/organisms/TaskCard';
import { Skeleton } from '@/ds/atoms/skeleton';
import { Alert, AlertDescription } from '@/ds/atoms/alert';

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

### Task Form (Organism)

```typescript
// ds/organisms/TaskForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/ds/atoms/Button';
import { Input } from '@/ds/atoms/Input';
import { Textarea } from '@/ds/atoms/Textarea';
import { Select } from '@/ds/atoms/Select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/ds/molecules/Form';
import { TaskFormData, taskSchema } from '@/modules/tasks/schemas/task-schema';
import { useTaskManager } from '@/modules/tasks/hooks/use-task-manager';

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

### Task Stats (Organism)

```typescript
// ds/organisms/TaskStats.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/ds/molecules/Card';
import { useTaskStats } from '@/modules/tasks/hooks/use-task-stats';

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
import { TaskManagerTemplate } from '@/ds/templates/TaskManagerTemplate';
import { TaskList } from '@/ds/organisms/TaskList';
import { TaskForm } from '@/ds/organisms/TaskForm';
import { Button } from '@/ds/atoms/Button';

export default function TaskManagerPage() {
  return (
    <TaskManagerTemplate
      description="Manage your tasks efficiently"
      actions={
        <Button variant="outline">
          Export Tasks
        </Button>
      }
    >
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
    </TaskManagerTemplate>
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
1. Create and customize templates
2. Implement proper layout structure
3. Add template-specific features

[Continue to Step 5: Template Customization →](./step5-advanced-features.md) 