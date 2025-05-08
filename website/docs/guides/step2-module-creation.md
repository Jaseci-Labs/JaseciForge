# Step 2: Module Creation

Let's create our tasks module with all necessary components.

## Create the Module

```bash
npx create-jaseci-app add-module tasks \
  --node=Task \
  --path=dashboard/tasks \
  --node-type="id:number,title:string,completed:boolean,userId:number" \
  --apis="list,get,create,update,delete" \
  --auth=yes
```

This command will:
1. Create a tasks module
2. Set up a Task node
3. Create a protected route at `/dashboard/tasks`
4. Configure CRUD API endpoints
5. Set up authentication

## Generated Structure

```
modules/tasks/
├── actions/          # Redux actions
├── hooks/           # Custom hooks
├── pages/           # Page components
├── schemas/         # Validation schemas
├── services/        # API services
└── utils/           # Utility functions
```

## Node Definition

The Task node is automatically created:

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

The API service is configured to use the private_api client for protected endpoints:

```typescript
// modules/tasks/services/task-service.ts
import { private_api } from "../../_core/api-client";
import type { TaskNode } from "@/nodes/task-node";

export const TasksApi = {
  getUserTasks: async () => {
    const response = await private_api.post("/walker/tasks");
    return response.data;
  },

  createTask: async (task: Omit<TaskNode, "id">) => {
    const response = await private_api.post("/walker/tasks", task);
    return response.data;
  },

  updateTask: async (id: string, task: Partial<TaskNode>) => {
    const response = await private_api.post(`/walker/tasks/${id}`, task);
    return response.data;
  },

  deleteTask: async (id: string) => {
    const response = await private_api.post(`/walker/tasks/${id}`);
    return response.data;
  },

  toggleTaskCompletion: async (id: string) => {
    const response = await private_api.post(`/walker/tasks/${id}/toggle`);
    return response.data;
  },
};
```

## Redux Slice

The Redux slice is automatically created:

```typescript
// store/taskSlice.ts
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
2. Verify the route is accessible at `/dashboard/tasks`
3. Confirm the Redux store is updated

## Next Steps

In the next step, we'll:
1. Customize the Task node
2. Add validation schemas
3. Implement custom hooks

[Continue to Step 3: Node Customization →](./step3-node-customization.md) 