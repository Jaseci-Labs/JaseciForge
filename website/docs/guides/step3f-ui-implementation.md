# Lesson 3.7: UI Implementation

Let's create the UI components for our Task Manager using the design system components following Atomic Design principles.

## Adding shadcn/ui Components

Before implementing our components, we need to add the required shadcn/ui components to our design system. Follow these steps:

1. Visit [shadcn/ui Components](https://ui.shadcn.com/docs/components)
2. Find the component you need (e.g., Alert, Skeleton)
3. Use the CLI to add the component:

```bash
# Add Alert component
npx shadcn@latest add alert

# Add Skeleton component
npx shadcn@latest add skeleton
```

<!-- if this fail foolow their manual installation -->




The CLI will:
- Add the component to `ds/atoms/`
- Add necessary dependencies
- Update your `components.json`

> If the CLI installation fails, you can manually install components:

1. Create the component file in `ds/atoms/`:
2. Add the component form their website manually
3. make sure to change the `@/lib/utils` to `@/_core/utils` when adding manually.

For example, to add the Alert component:
1. Go to [Alert Documentation](https://ui.shadcn.com/docs/components/alert)
2. Run `npx shadcn@latest add alert`
3. Import and use in your components:
```typescript
import { Alert, AlertDescription } from "@/ds/atoms/alert";
```

## Utility Functions

Before creating components, let's set up utility functions that can be used across the project.

### Core Utilities

For utilities that are used across multiple modules, add them to the core utils:

```typescript
// @/_core/utils/date.ts
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function isOverdue(date: string | Date): boolean {
  return new Date(date) < new Date();
}
```

### Module-Specific Utilities

For utilities specific to a module, keep them in the module's utils folder:

```typescript
// modules/tasks/utils/index.ts
import { TaskNode } from '@/nodes/task-node';

export function getTaskStatus(task: TaskNode): 'completed' | 'pending' | 'overdue' {
  if (task.completed) return 'completed';
  if (task.dueDate && new Date(task.dueDate) < new Date()) return 'overdue';
  return 'pending';
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-yellow-500';
    case 'low': return 'text-green-500';
    default: return 'text-gray-500';
  }
}
```

## Create Task Components

### Task Card (Organism)

```typescript
// ds/organisms/post-card.tsx
import { Card, CardContent, CardHeader, CardFooter } from "@/ds/atoms/card";
import { Badge } from "@/ds/atoms/badge";
import { Button } from "@/ds/atoms/button";
import { Checkbox } from "@/ds/atoms/checkbox";
import { formatDate } from "@/_core/utils/date";
import { PostNode } from "@/nodes/post-node";

interface PostCardProps {
  post: PostNode;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export function PostCard({ post, onToggleComplete, onDelete }: PostCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={post.completed}
            onCheckedChange={() => onToggleComplete(post.id)}
          />
          <h3
            className={`text-lg font-semibold ${
              post.completed ? "line-through" : ""
            }`}
          >
            {post.title}
          </h3>
        </div>
        <Badge variant={post.completed === true ? "destructive" : "default"}>
          {post.completed ? "Completed" : "Pending"}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{post.description}</p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(post.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### Task List (Organism)

```typescript
// ds/organisms/post-list.tsx
"use client";
import { PostCard } from "@/ds/organisms/post-card";
import { Skeleton } from "@/ds/atoms/skeleton";
import { usePosts } from "@/modules/post";
import { Alert, AlertDescription } from "../atoms/alert";
import { useEffect, useState } from "react";

export function PostList() {
  const { posts, isLoading, error, actions } = usePosts();
  const [formattedPosts, setFormattedPosts] = useState(posts);

  useEffect(() => {
    setFormattedPosts(
      posts.map((post) => ({
        ...post,
        createdAt: new Date(post.createdAt).toLocaleDateString(),
        updatedAt: new Date(post.updatedAt).toLocaleDateString(),
      }))
    );
  }, [posts]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {formattedPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onToggleComplete={actions.toggleComplete}
          onDelete={actions.deletePost}
        />
      ))}
    </div>
  );
}
```

### Task Form (Organism)

```typescript
// ds/organisms/post-form.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePosts } from "@/modules/post";
import { PostFormData, postSchema } from "@/modules/post/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../atoms/form";
import { Input } from "../atoms/input";
import { Textarea } from "../atoms/textarea";
import { Select } from "../atoms/select";
import { Button } from "../atoms/button";

export function PostForm() {
  const { actions } = usePosts();
  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      tags: [],
    },
  });

  const onSubmit = async (data: PostFormData) => {
    await actions.addPost(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Add Post</Button>
      </form>
    </Form>
  );
}
```

## Using and Creating Templates

Templates provide a consistent layout structure for your pages. You can either use existing templates from our design system or create custom ones.

### Using Existing Templates

Our design system comes with several pre-built templates that you can usef rom `ds/templates `. For our tutorial, let's build a custom template `PostManagerTemplate`

### Creating Custom Templates

You can create custom templates by extending the base template structure. Here's an example of a custom post manager template:

```typescript
// ds/templates/post-manager-template.tsx
import React, { ReactNode } from "react";

interface PostManagerTemplateProps {
  children: ReactNode;
  description: string;
  actions?: ReactNode;
}

function PostManagerTemplate({
  children,
  description,
  actions,
}: PostManagerTemplateProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">{description}</p>
          {actions}
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

export default PostManagerTemplate;
```

Key features of this template:
- Sticky header with description and optional actions
- Flexible main content area
- Responsive layout
- Consistent spacing and styling

You can customize this template by:
1. Adding more sections (sidebar, footer, etc.)
2. Modifying the styling
3. Including additional props for more flexibility
4. Adding template-specific features


## Update Task Manager Page

Now we have created the template and necessary organisms, its time to plug them in to template and build our module.

```typescript
// modules/post/pages/index.tsx
i// modules/post/pages/index.tsx

import { Button } from "@/ds/atoms/button";
import { PostForm } from "@/ds/organisms/post-form";
import { PostList } from "@/ds/organisms/post-list";
import PostManagerTemplate from "@/ds/templates/post-manager-template";

export default function PostManagerPage() {
  return (
    <PostManagerTemplate
      description="Manage your tasks efficiently"
      actions={<Button variant="outline">Export Tasks</Button>}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
          <PostForm />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          <PostList />
        </div>
      </div>
    </PostManagerTemplate>
  );
}
```

## Verify UI Implementation

1. Check that all components render correctly
2. Test form validation
3. Verify task creation and updates
4. Confirm stats update in real-time
5. Test responsive layout

## Next Steps

In the next step, we'll:
1. Create and customize templates
2. Implement proper layout structure
3. Add template-specific features

[Continue to Summary and Best practices →](./summary.md) 