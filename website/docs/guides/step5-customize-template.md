# Step 5: Template Customization

Let's customize our Task Manager by creating and using proper templates following Atomic Design principles.

## Create Base Templates

### Dashboard Template

```typescript
// ds/templates/DashboardTemplate.tsx
import { ReactNode } from 'react';
import { Sidebar } from '@/ds/organisms/Sidebar';
import { Header } from '@/ds/organisms/Header';

interface DashboardTemplateProps {
  children: ReactNode;
  sidebar?: ReactNode;
  header?: ReactNode;
}

export function DashboardTemplate({ 
  children, 
  sidebar = <Sidebar />, 
  header = <Header /> 
}: DashboardTemplateProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {sidebar}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Page Template

```typescript
// ds/templates/PageTemplate.tsx
import { ReactNode } from 'react';
import { Card } from '@/ds/molecules/Card';

interface PageTemplateProps {
  children: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageTemplate({ 
  children, 
  title, 
  description, 
  actions 
}: PageTemplateProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <Card className="p-6">
        {children}
      </Card>
    </div>
  );
}
```

## Create Task-Specific Templates

### Task Manager Template

```typescript
// ds/templates/TaskManagerTemplate.tsx
import { ReactNode } from 'react';
import { DashboardTemplate } from './DashboardTemplate';
import { PageTemplate } from './PageTemplate';
import { TaskStats } from '@/ds/organisms/TaskStats';

interface TaskManagerTemplateProps {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export function TaskManagerTemplate({
  children,
  title = "Task Manager",
  description,
  actions
}: TaskManagerTemplateProps) {
  return (
    <DashboardTemplate>
      <PageTemplate
        title={title}
        description={description}
        actions={actions}
      >
        <div className="space-y-6">
          <TaskStats />
          {children}
        </div>
      </PageTemplate>
    </DashboardTemplate>
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

## Create Task Detail Template

```typescript
// ds/templates/TaskDetailTemplate.tsx
import { ReactNode } from 'react';
import { TaskManagerTemplate } from './TaskManagerTemplate';
import { Button } from '@/ds/atoms/Button';
import { ArrowLeft } from 'lucide-react';

interface TaskDetailTemplateProps {
  children: ReactNode;
  taskId: string;
  onBack: () => void;
}

export function TaskDetailTemplate({
  children,
  taskId,
  onBack
}: TaskDetailTemplateProps) {
  return (
    <TaskManagerTemplate
      title={`Task #${taskId}`}
      actions={
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tasks
        </Button>
      }
    >
      {children}
    </TaskManagerTemplate>
  );
}
```

## Verify Template Implementation

1. Check that all templates render correctly
2. Verify responsive layout
3. Test template composition
4. Confirm proper spacing and alignment
5. Verify template props work as expected

## Next Steps

You've now completed the template customization! Here's what you can do next:

1. Add more templates:
   - List template for consistent list views
   - Form template for standardized forms
   - Modal template for dialogs
   - Settings template for configuration pages

2. Enhance templates:
   - Add breadcrumb navigation
   - Implement tabbed layouts
   - Add collapsible sections
   - Create grid layouts

3. Improve accessibility:
   - Add proper ARIA labels
   - Implement keyboard navigation
   - Add focus management
   - Ensure proper heading hierarchy

4. Add animations:
   - Page transitions
   - Loading states
   - Error states
   - Success feedback

[Back to Overview →](../index.md) 