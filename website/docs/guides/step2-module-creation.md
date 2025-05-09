# Step 2: Module Creation

Let's create our tasks module with all necessary components.

## Create the Module

```bash
npx create-jaseci-app add-module post \
  --node=Task \
  --path=dashboard/posts \
  --node-type="id:number,title:string,completed:boolean,userId:number" \
  --apis="list,get,create,update,delete" \
  --auth=no \
  --api-base=/todos
```

This command will:
1. Create a tasks module
2. Set up a Task node matching JSONPlaceholder's todo structure
3. Create a route at `/dashboard/posts`
4. Configure CRUD API endpoints using public API (since `--auth=no`)
5. Set up API base path to `/todos`

## Generated Structure

```
modules/posts/
├── actions/          # Redux actions
├── hooks/           # Custom hooks
├── pages/           # Page components
├── schemas/         # Validation schemas
├── services/        # API services
└── utils/           # Utility functions
```

## Node Definition

The Task node is automatically created to match JSONPlaceholder's todo structure:

```typescript
// nodes/task-node.ts
export interface TaskNode {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}
```

## API Service

The API service is configured to use the public_api client (since `--auth=no`) for JSONPlaceholder endpoints:

```typescript
// modules/posts/services/task-service.ts
import { public_api } from "../../_core/api-client";
import type { TaskNode } from "@/nodes/task-node";

export const TasksApi = {
  getUserTasks: async () => {
    const response = await public_api.get("/todos");
    return response.data;
  },

  createTask: async (task: Omit<TaskNode, "id">) => {
    const response = await public_api.post("/todos", {
      ...task,
      userId: 1, // JSONPlaceholder requires userId
    });
    return response.data;
  },

  updateTask: async (id: number, task: Partial<TaskNode>) => {
    const response = await public_api.put(`/todos/${id}`, {
      ...task,
      userId: 1, // JSONPlaceholder requires userId
    });
    return response.data;
  },

  deleteTask: async (id: number) => {
    const response = await public_api.delete(`/todos/${id}`);
    return response.data;
  },

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

## Redux Slice

The Redux slice is automatically created:

```typescript
// store/postslice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskNode } from '@/nodes/task-node';

interface TaskState {
  items: TaskNode[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  items: [],
  isLoading: false,
  error: null,
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // ... reducers
  },
});
```

## Verify Module Creation

1. Check that all files are created
2. Verify the route is accessible at `/dashboard/posts`
3. Test the API connection:
```typescript
// Test the API in your browser console
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(json => console.log(json))
```

## Next Steps

In the next step, we'll:
1. Customize the Task node
2. Add validation schemas
3. Implement custom hooks

[Continue to Step 3: Node Customization →](./step3-node-customization.md) 