# Lesson 3.5: Store and Reducers Implementation

In this guide, we'll learn how to implement the Redux store and reducers to manage our application state effectively, using our post management system as an example.

## Understanding the Store

The Redux store is the central state container for our application. It holds the complete state tree and provides methods to:
- Access the state
- Dispatch actions
- Subscribe to state changes

## Creating the Post Slice

We'll use Redux Toolkit's `createSlice` to define our post state management:

```typescript
// store/postSlice.ts
import { PostNode } from "@/nodes/post-node";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  createPost,
  deletePostAction,
  fetchPosts,
  updatePostAction,
} from "../modules/post/actions";

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
  name: "post",
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
      state.successMessage = "Posts fetched successfully";
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
    // add case for create post
    builder.addCase(createPost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.items.push(action.payload);
      state.success = true;
      state.successMessage = "Post created successfully";
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(createPost.rejected, (state, action) => {
      state.error = action.payload as string;
      state.success = false;
    });
    // add case for update post
    builder.addCase(updatePostAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(updatePostAction.fulfilled, (state, action) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
      state.success = true;
      state.successMessage = "Post updated successfully";
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(updatePostAction.rejected, (state, action) => {
      state.error = action.payload as string;
      state.success = false;
    });
    // add case for delete post
    builder.addCase(deletePostAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(deletePostAction.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.success = true;
      state.successMessage = "Post deleted successfully";
      state.isLoading = false;
      state.error = null;
      state.items = state.items.filter((item) => item.id !== action.payload);
    });
    builder.addCase(deletePostAction.rejected, (state, action) => {
      state.error = action.payload as string;
      state.success = false;
    });
  },
});

export const { setItems, setLoading, setError, resetSuccess } =
  postSlice.actions;
export default postSlice.reducer;
```

## Configuring the Store: automatically done by our `add-moule` tool

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { postSlice } from './postSlice';

export const store = configureStore({
  reducer: {
    post: postSlice.reducer,
    // Add more reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```


## Understanding State Updates

1. **Synchronous Updates**
   - Direct state mutations through reducers
   - Immediate UI updates
   - Used for simple state changes

2. **Asynchronous Updates**
   - Handled through extra reducers
   - Three states: pending, fulfilled, rejected
   - Manages loading and error states

3. **Optimistic Updates**
   - Immediate UI updates before server response
   - Rollback on failure
   - Better user experience

## Best Practices

1. **State Structure**
   - Keep state normalized
   - Use proper typing with TypeScript
   - Include loading and error states

2. **Reducer Design**
   - Use createSlice for simpler code
   - Handle all action states
   - Implement proper error handling

3. **Performance**
   - Use selectors for derived data
   - Implement proper memoization
   - Avoid unnecessary re-renders

4. **Type Safety**
   - Define proper interfaces
   - Use TypeScript for type checking
   - Leverage type inference

## Next Steps

In the next guide, we'll learn how to create custom hooks to access our data layer from the presentation layer.

[Continue to Lesson 3.6: Custom Hooks Implementation](./step3e-custom-hooks.md) 