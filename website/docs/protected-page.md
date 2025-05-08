# Protected Pages Guide

Jaseci Forge provides a built-in `ProtectedRoute` wrapper to easily protect your pages from unauthorized access.

## Basic Usage

Wrap your page component with `ProtectedRoute`:

```typescript
// modules/dashboard/pages/DashboardPage.tsx
import { ProtectedRoute } from "@/ds/wrappers/protected-auth";
import { DashboardTemplate } from "@/ds/templates/dashboard-template";

export function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardTemplate>
        {/* Your page content */}
      </DashboardTemplate>
    </ProtectedRoute>
  );
}
```

## Module Creation with Auth

When creating a new module, you can specify whether it should be protected:

```bash
# Create a protected module
npx create-jaseci-app add-module dashboard --auth=yes

# Create a public module
npx create-jaseci-app add-module public --auth=no
```

The `--auth` flag will automatically:
1. Add the `ProtectedRoute` wrapper
2. Set up the necessary imports
3. Configure the page for authentication

## How It Works

The `ProtectedRoute` wrapper:
- Checks authentication status
- Shows a loading state while checking
- Redirects to login if not authenticated
- Renders children only when authenticated

```typescript
// Example of how ProtectedRoute works internally
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

## Real-World Example

Here's a complete example of a protected task manager page:

```typescript
// modules/tasks/pages/TaskManagerPage.tsx
import { ProtectedRoute } from "@/ds/wrappers/protected-auth";
import { DashboardTemplate } from "@/ds/templates/dashboard-template";
import { TaskList } from "@/ds/organisms/task-list";
import { useTaskManager } from "../hooks/use-task-manager";

export function TaskManagerPage() {
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
        />
      </DashboardTemplate>
    </ProtectedRoute>
  );
}
```

## Best Practices

1. **Consistent Protection**
   - Use `--auth=yes` for all authenticated routes
   - Keep public routes explicitly marked with `--auth=no`

2. **Loading States**
   - The wrapper handles loading states automatically
   - Customize the loading UI if needed

3. **Error Handling**
   - The wrapper handles redirects automatically
   - Add custom error handling in your components

4. **Route Organization**
   - Group protected routes together
   - Use route groups for better organization

## Next Steps

<!-- 1. Learn about [Authentication](../concepts/authentication)
2. Explore [Route Protection](../concepts/route-protection)
3. Check out [Loading States](../concepts/loading-states) -->
