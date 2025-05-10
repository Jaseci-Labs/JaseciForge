# Lesson 3.3: Actions - The Bridge Between Service and Data Layers

Now that we have created our service layer, we need to connect it to our data layer (Redux). This is where actions come in - they serve as the crucial bridge between these two layers.

## Understanding the Role of Actions

Actions in our architecture serve as the connection point between:
- **Service Layer**: Handles API calls and external data fetching
- **Data Layer**: Manages application state through Redux

## Actions implementation
Here's a practical example of how an action bridges these layers:

```typescript
import { createAsyncThunk } from "@reduxjs/toolkit";
import { PostApi } from "../services";
import { PostFormData } from "../schemas";

// Example action
export const fetchPosts = createAsyncThunk(
  "post/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await PostApi.getPosts();
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch Posts"
      );
    }
  }
);

export const createPost = createAsyncThunk(
  "post/create",
  async (data: PostFormData, { rejectWithValue }) => {
    try {
      const response = await PostApi.createPost(data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create Post"
      );
    }
  }
);

export const updatePostAction = createAsyncThunk(
  "post/update",
  async (
    { id, data }: { id: number; data: PostFormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await PostApi.updatePost(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update Post"
      );
    }
  }
);

export const deletePostAction = createAsyncThunk(
  "post/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await PostApi.deletePost(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete Post"
      );
    }
  }
);

export const getPostAction = createAsyncThunk(
  "post/get",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await PostApi.getPost(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to get Post"
      );
    }
  }
);
```

## How It Works

1. **Service Layer Connection**
   - The action calls methods from our service layer (PostApi)
   - Service layer handles the actual API communication
   - Raw data comes back through the service layer

2. **Data Layer Connection**
   - The action receives the response from the service layer
   - It processes the data if needed
   - Returns the data to Redux (data layer)
   - Redux then updates the application state

3. **Error Handling**
   - Actions handle errors from the service layer
   - Errors are formatted and passed to the data layer
   - Data layer can then update state with error information

## Best Practices

1. **Keep Actions Focused**
   - Each action should handle one specific operation
   - Clear naming that reflects the operation
   - Proper error handling and type safety

2. **Type Safety**
   - Use TypeScript interfaces for all data
   - Define clear types for action payloads
   - Ensure proper error typing

3. **Error Handling**
   - Always handle errors from service layer
   - Provide meaningful error messages
   - Use rejectWithValue for error propagation

## Next Steps

In the next guide, we'll explore how to implement the Redux store and reducers to complete our data layer implementation.

[Continue to Lesson 3.4: Data Layer Integration](./step3c-data-layer.md) 