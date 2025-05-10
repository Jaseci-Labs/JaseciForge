# Lesson 3.1: Node Customization

Let's enhance our Task node with additional fields and types for better functionality.

## Task Node Definition

```typescript
// nodes/task-node.ts
export interface TaskNode {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

## Node Features

1. **Required Fields**
   - `id`: Unique identifier
   - `title`: Task title
   - `completed`: Completion status
   - `userId`: Owner reference
   - `priority`: Task priority level
   - `createdAt`: Creation timestamp
   - `updatedAt`: Last update timestamp

2. **Optional Fields**
   - `description`: Detailed task description
   - `dueDate`: Task deadline
   - `tags`: Task categorization

3. **Type Safety**
   - Strict typing for all fields
   - Enum for priority levels
   - Array type for tags

## Validation Schema

Create a Zod schema for data validation:

```typescript
// modules/tasks/schemas/task-schema.ts
import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  userId: z.number(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  tags: z.array(z.string()).default([]),
});

export type TaskFormData = z.infer<typeof taskSchema>;
```

## Schema Features

1. **Validation Rules**
   - Required title with minimum length
   - Optional description
   - Default values for completed and priority
   - Array validation for tags

2. **Type Inference**
   - Automatic TypeScript type generation
   - Form data type matching
   - Runtime type checking

## Verify Node Customization

1. Test type safety:
   ```typescript
   const task: TaskNode = {
     id: 1,
     title: "Test Task",
     completed: false,
     userId: 1,
     priority: "medium",
     tags: [],
     createdAt: new Date().toISOString(),
     updatedAt: new Date().toISOString()
   };
   ```

2. Validate data:
   ```typescript
   const result = taskSchema.safeParse(task);
   if (result.success) {
     console.log('Valid task:', result.data);
   }
   ```

## Next Steps

In the next step, we'll:
1. Set up the Redux store
2. Create data management hooks
3. Connect everything together

[Continue to Lesson 3.2: Enhancing Service Layer →](./step3b-service-layer.md) 