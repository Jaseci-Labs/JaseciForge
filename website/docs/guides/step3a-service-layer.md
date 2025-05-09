# Step 3a: Service Layer Implementation

Let's implement the service layer for our Task Manager using JSONPlaceholder API.

## Task Service Implementation

```typescript
// modules/tasks/services/task-service.ts
import { public_api } from "../../_core/api-client";
import type { TaskNode } from "@/nodes/task-node";

export const TasksApi = {
  // Get all tasks
  getUserTasks: async () => {
    const response = await public_api.get("/todos");
    return response.data;
  },

  // Get a specific task
  getTask: async (id: number) => {
    const response = await public_api.get(`/todos/${id}`);
    return response.data;
  },

  // Create a new task
  createTask: async (task: Omit<TaskNode, "id">) => {
    const response = await public_api.post("/todos", {
      ...task,
      userId: 1, // JSONPlaceholder requires userId
    });
    return response.data;
  },

  // Update an existing task
  updateTask: async (id: number, task: Partial<TaskNode>) => {
    const response = await public_api.put(`/todos/${id}`, {
      ...task,
      userId: 1, // JSONPlaceholder requires userId
    });
    return response.data;
  },

  // Delete a task
  deleteTask: async (id: number) => {
    const response = await public_api.delete(`/todos/${id}`);
    return response.data;
  },

  // Toggle task completion status
  toggleTaskCompletion: async (id: number) => {
    const task = await TasksApi.getTask(id);
    const response = await public_api.put(`/todos/${id}`, {
      ...task,
      completed: !task.completed,
    });
    return response.data;
  },
};
```

## Service Layer Features

1. **RESTful Endpoints**
   - Uses JSONPlaceholder's `/todos` endpoints
   - Standard HTTP methods (GET, POST, PUT, DELETE)
   - Clean and consistent API structure

2. **Type Safety**
   - Full TypeScript integration
   - Proper type definitions for requests and responses
   - Type-safe error handling

3. **Error Handling**
   - Consistent error response format
   - Type-safe error handling
   - Proper error propagation

## Verify Service Layer

1. Test API endpoints:
   ```typescript
   // Example usage
   const tasks = await TasksApi.getUserTasks();
   const newTask = await TasksApi.createTask({
     title: "New Task",
     completed: false,
     userId: 1
   });
   ```

2. Check error handling:
   ```typescript
   try {
     await TasksApi.createTask(invalidTask);
   } catch (error) {
     console.error("Failed to create task:", error);
   }
   ```

## Next Steps

Now that we have our service layer set up, we can move on to:
1. Creating the data layer
2. Implementing state management
3. Building the UI components

[Continue to Step 3b: Node Customization →](./step3b-node-customization.md) 