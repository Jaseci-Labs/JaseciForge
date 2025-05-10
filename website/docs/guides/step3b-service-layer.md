# Lesson 3.2: Service Layer Implementation

Let's implement the service layer for our Task Manager using JSONPlaceholder API.

## Task Service Implementation

```typescript
// modules/tasks/services/index.ts
import { PostNode } from "@/nodes/post-node";
import { public_api } from "@/_core/api-client";
import { PostFormData } from "../schemas";

export const PostApi = {
  // Get all posts
  getPosts: async () => {
    const response = await public_api.get("/todos");
    return response.data;
  },

  // Get a specific post
  getPost: async (id: number) => {
    const response = await public_api.get(`/todos/${id}`);
    return response.data;
  },

  // Create a new post
  createPost: async (data: PostFormData) => {
    const postData: Omit<PostNode, "id"> = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const response = await public_api.post("/todos", postData);
    return response.data;
  },

  // Update an existing post
  updatePost: async (id: number, data: Partial<PostNode>) => {
    const response = await public_api.put(`/todos/${id}`, data);
    return response.data;
  },

  // Delete a post
  deletePost: async (id: number) => {
    const response = await public_api.delete(`/todos/${id}`);
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

## Next Steps

Now that we have our service layer set up, we can move on to:
1. Creating the data layer
2. Implementing state management
3. Building the UI components

[Continue to Lesson 3.3: Actions - The Bridge Between Service and Data Layers →](./step3c-actions-and-interfaces.md) 