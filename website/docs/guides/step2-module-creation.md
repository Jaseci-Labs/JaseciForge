# Lesson 2: Module Creation

Our magic `add-module` tool will handle all the configurations and create files for all the layers (presentation, service, data) with basic implementations. You'll just need to modify them according to your needs. Since each layer has a single responsibility, you can leverage LLMs to help generate the content for each layer file after our tool gernates automatcially those files and configs - they excel at handling focused, single-purpose tasks like this.

## Create the Module

```bash
npx create-jaseci-app add-module post \
  --node=Post \
  --path=dashboard/posts \
  --node-type="id:number,title:string,completed:boolean,userId:number" \
  --apis="list,get,create,update,delete" \
  --auth=no \
  --api-base=/todos
```

Let's understand each parameter:

1. `post` (module_name):
   - The base name for our module
   - Creates the module directory at `modules/posts/`
   - Used as the default route path unless overridden

2. `--node=Post`:
   - Custom node name for the module
   - Generates `PostNode` interface instead of `PostNode`
   - Used in TypeScript types and Redux state

3. `--path=dashboard/posts`:
   - Custom route path for the module
   - Page will be accessible at `/dashboard/posts`
   - Supports nested routes and route groups

4. `--node-type="id:number,title:string,completed:boolean,userId:number"`:
   - Defines the Post node structure
   - Each field is defined as `name:type`
   - Matches JSONPlaceholder's todo structure
   - Supports basic types (string, number, boolean)

5. `--apis="list,get,create,update,delete"`:
   - Standard CRUD operations to generate
   - Each endpoint will be implemented in the service layer
   - Used to interact with the API

6. `--auth=no`:
   - Uses `public_api` instead of `private_api`
   - Makes the page publicly accessible
   - No authentication required
   - Suitable for public APIs like JSONPlaceholder

7. `--api-base=/todos`:
   - Base path for API endpoints
   - All API calls will be prefixed with `/todos`
   - Matches JSONPlaceholder's API structure

This command will:
1. Create a tasks module
2. Set up a Post node matching JSONPlaceholder's todo structure
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

The Post node is automatically created to match JSONPlaceholder's todo structure:

```typescript
// nodes/post-node.ts
export interface PostNode {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}
```

## API Service

The API service is configured to use the public_api client (since `--auth=no`) for JSONPlaceholder endpoints:

```typescript
// modules/posts/services/post-service.ts
import { PostNode } from '@/nodes/post-node';
import { public_api } from '@/_core/api-client';

export const PostApi = {
  // Get all posts
  getPosts: async () => {
    const response = await public_api.get('/todos');
    return response.data;
  },

  // Get a specific post
  getPost: async (id: number) => {
    const response = await public_api.get(`/todos/${id}`);
    return response.data;
  },

  // Create a new post
  createPost: async (data: Omit<PostNode, 'id'>) => {
    const response = await public_api.post('/todos', data);
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
  }
};
```

## Redux Slice

The Redux slice is automatically created:

```typescript
// store/postslice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { PostNode } from '@/nodes/post-node';
import { fetchPosts } from '../modules/post/actions';

interface PostState {
  items: PostNode[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
  successMessage: string | null;
}

const initialState: PostState = {
  items: [],
  isLoading: false,
  error: null,
  success: false,
  successMessage: null,
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<PostNode[]>) => {
      state.items = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.success = false;
    },
    resetSuccess: (state) => {
      state.success = false;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
      state.success = true;
      state.successMessage = 'Posts fetched successfully';
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
  },
});

export const { setItems, setLoading, setError, resetSuccess } = postSlice.actions;
export default postSlice.reducer;
```

## Verify Module Creation

1. Check that all files are created
2. Verify the route is accessible at `http://localhost:3001/dashboard/posts`

## Next Steps

In the next step, we'll:
1. Customize the Post node
2. Add validation schemas
3. Implement custom hooks

[Continue to Lesson 3: Customize layers →](./step3-customize-layers.md) 