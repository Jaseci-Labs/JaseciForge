# Step 3a: Service Layer Implementation

Let's implement the service layer for our Task Manager using the private_api client.

## Task Service Implementation

```typescript
// modules/tasks/services/task-service.ts
import { private_api } from "../../_core/api-client";
import type { TaskNode } from "@/nodes/task-node";

export const TasksApi = {
  // Get all tasks for the current user
  getUserTasks: async () => {
    const response = await private_api.post("/walker/tasks");
    return response.data;
  },

  // Create a new task
  createTask: async (task: Omit<TaskNode, "id">) => {
    const response = await private_api.post("/walker/tasks", task);
    return response.data;
  },

  // Update an existing task
  updateTask: async (id: string, task: Partial<TaskNode>) => {
    const response = await private_api.post(`/walker/tasks/${id}`, task);
    return response.data;
  },

  // Delete a task
  deleteTask: async (id: string) => {
    const response = await private_api.post(`/walker/tasks/${id}`);
    return response.data;
  },

  // Toggle task completion status
  toggleTaskCompletion: async (id: string) => {
    const response = await private_api.post(`/walker/tasks/${id}/toggle`);
    return response.data;
  },
};
```

## Service Layer Features

1. **Protected Endpoints**
   - All endpoints use `private_api` for authentication
   - Requests automatically include auth tokens
   - Handles unauthorized access

2. **Error Handling**
   - Network errors are caught and propagated
   - API errors are properly formatted
   - Response data is typed

3. **Type Safety**
   - Input parameters are properly typed
   - Response data matches TaskNode interface
   - Partial updates are handled correctly

## Verify Service Layer

1. Test API endpoints:
   ```typescript
   // Example test
   const tasks = await TasksApi.getUserTasks();
   console.log('Tasks:', tasks);
   ```

2. Check error handling:
   ```typescript
   try {
     await TasksApi.createTask(invalidTask);
   } catch (error) {
     console.error('Error:', error);
   }
   ```

3. Verify response types:
   ```typescript
   const task = await TasksApi.createTask(newTask);
   // TypeScript should recognize task as TaskNode
   ```

## Next Steps

In the next step, we'll:
1. Customize the Task node
2. Add validation schemas
3. Set up the data layer

[Continue to Step 3b: Node Customization →](./step3b-node-customization.md) 