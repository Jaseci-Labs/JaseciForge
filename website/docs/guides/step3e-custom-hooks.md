# Lesson 3.6: Custom Hooks Implementation

In this guide, we'll learn how to create custom hooks that bridge the gap between our data layer and presentation layer, making it easy to access and manipulate data in our components.

## Understanding Custom Hooks

Custom hooks are functions that encapsulate reusable logic and state management. They provide a clean interface for components to interact with our data layer.

## Creating Post Management Hooks

Let's implement our post management hook that connects to our Redux store:

```typescript
// modules/posts/hooks/index.ts
import { useAppDispatch, useAppSelector } from "@/store/useStore";
import { useEffect } from "react";

import {
  createPost,
  deletePostAction,
  fetchPosts,
  updatePostAction,
} from "../actions";
import { PostFormData, postSchema } from "../schemas";

export function usePosts() {
  const dispatch = useAppDispatch();
  const {
    items: posts,
    isLoading,
    error,
  } = useAppSelector((state) => state.post);

  // Load posts
  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  const loadPosts = async () => {
    dispatch(fetchPosts());
  };

  // Add post
  const addPost = async (data: PostFormData) => {
    const validated = postSchema.parse(data);
    dispatch(createPost(validated));
  };
  // Update post
  const updatePost = async (id: number, data: Partial<PostFormData>) => {
    const validated = postSchema.partial().parse(data);
    dispatch(updatePostAction({ id, data: validated as PostFormData }));
  };

  // Delete post
  const deletePost = async (id: number) => {
    dispatch(deletePostAction(id));
  };

  // Toggle complete
  const toggleComplete = async (id: number) => {
    const post = posts.find((p) => p.id === id);
    if (post) {
      dispatch(
        updatePostAction({
          id,
          data: { ...post, completed: !post.completed },
        })
      );
    }
  };

  return {
    posts,
    isLoading,
    error,
    refresh: loadPosts,
    actions: {
      loadPosts,
      addPost,
      updatePost,
      deletePost,
      toggleComplete,
    },
  };
}
```

## Understanding the Hook Implementation

1. **Store Connection**
   - `useAppDispatch`: Provides access to the Redux dispatch function
   - `useAppSelector`: Selects specific pieces of state from the store
   - Automatic loading of posts on component mount

2. **Data Validation**
   - Uses Zod schema validation (`postSchema`)
   - Validates data before dispatching actions
   - Type-safe data handling

3. **Action Methods**
   - `loadPosts`: Fetches all posts
   - `addPost`: Creates a new post with validation
   - `updatePost`: Updates existing post with partial data
   - `deletePost`: Removes a post by ID

## Best Practices

1. **Hook Organization**
   - Keep hooks focused and single-purpose
   - Group related functionality
   - Use clear, descriptive names

2. **State Management**
   - Use typed selectors for type safety
   - Handle loading and error states
   - Implement proper validation

3. **Performance**
   - Use proper memoization
   - Avoid unnecessary re-renders
   - Implement proper cleanup

4. **Error Handling**
   - Validate data before dispatching
   - Handle API errors gracefully
   - Provide meaningful error messages

## Next Steps

Now that we have implemented our custom hooks, we can move on to implementing the UI components and connecting everything together.

[Continue to Lesson 3.7: UI Implementation](./step3f-ui-implementation.md) 