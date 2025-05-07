# Presentation Layer

## Overview
The presentation layer is responsible for the user interface and user interactions. It follows the Atomic Design methodology and is built using Next.js, TypeScript, and Tailwind CSS.

## Main Components

### 1. Pages (Routing)
The `app/` directory handles all routing and page composition using Next.js 13+ app router. Pages are responsible for:
- Route definitions and navigation
- Page composition using DS components
- Metadata and SEO
- Layout management
- Route protection

### 2. Design System (DS)
The `ds/` directory contains all reusable UI components following Atomic Design principles:
- Atoms: Basic building blocks (buttons, inputs)
- Molecules: Combinations of atoms (search bars, cards)
- Organisms: Complex components (navigation, forms)
- Templates: Page-level components (layouts, grids)

### 3. Modules
The `modules/` directory contains feature-specific logic and integration:
- Custom hooks as the interface to data layer
- Data validation schemas
- Module-specific utilities

## Directory Structure
```
src/
├── app/                # Next.js app router pages
│   ├── (auth)/         # Authentication-related pages
│   │   ├── login/      # Login page
│   │   │   └── page.tsx
│   │   └── register/   # Registration page
│   │       └── page.tsx
│   ├── (dashboard)/    # Dashboard and main application pages
│   │   ├── tasks/      # Task management pages
│   │   │   ├── [id]/   # Dynamic task detail page
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx  # Dashboard layout
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
│
├── ds/                 # Design System
│   ├── atoms/          # Basic building blocks
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   └── Input/
│   │       ├── Input.tsx
│   │       ├── Input.test.tsx
│   │       └── index.ts
│   ├── molecules/      # Combinations of atoms
│   │   ├── SearchBar/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SearchBar.test.tsx
│   │   │   └── index.ts
│   │   └── Card/
│   │       ├── Card.tsx
│   │       ├── Card.test.tsx
│   │       └── index.ts
│   ├── organisms/      # Complex UI components
│   │   ├── TaskList/
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskList.test.tsx
│   │   │   └── index.ts
│   │   └── Navigation/
│   │       ├── Navigation.tsx
│   │       ├── Navigation.test.tsx
│   │       └── index.ts
│   └── templates/      # Page-level components
│       ├── DashboardLayout/
│       │   ├── DashboardLayout.tsx
│       │   ├── DashboardLayout.test.tsx
│       │   └── index.ts
│       └── PageTemplate/
│           ├── PageTemplate.tsx
│           ├── PageTemplate.test.tsx
│           └── index.ts
│
└── modules/            # Feature modules
    ├── tasks/          # Task management feature
    │   ├── pages/      # Pages composing DS components
    │   │   ├── TaskListPage.tsx
    │   │   └── TaskDetailPage.tsx
    │   ├── hooks/      # Business logic and data layer integration
    │   │   ├── useTaskList.ts
    │   │   └── useTaskDetail.ts
    │   ├── schemas/    # Validation schemas
    │   │   ├── task.schema.ts
    │   │   └── types.ts
    │   └── utils/      # Module-specific utilities
    │       └── taskHelpers.ts
    └── users/          # User management feature
        ├── pages/
        │   ├── UserListPage.tsx
        │   └── UserProfilePage.tsx
        ├── hooks/
        │   ├── useUserList.ts
        │   └── useUserProfile.ts
        ├── schemas/
        │   ├── user.schema.ts
        │   └── types.ts
        └── utils/
            └── userHelpers.ts
```

## Detailed Information

### 1. Pages (Routing)

#### App Router Structure
The `app/` directory uses Next.js 13+ app router for file-system based routing. Each route can define:
- `page.tsx`: The UI for the route
- `layout.tsx`: Shared layouts for segments
- `loading.tsx`: Loading UI
- `error.tsx`: Error UI
- `not-found.tsx`: Not found UI

#### Route Groups
Route groups (folders wrapped in parentheses) help organize routes without affecting the URL structure:
- `(auth)`: Authentication-related pages
- `(dashboard)`: Main application pages
- `(marketing)`: Public-facing pages

#### Layouts
Layouts define shared UI for multiple pages:
```typescript
// app/(dashboard)/layout.tsx
import { DashboardLayout } from '@/ds/templates/DashboardLayout';
import { AuthGuard } from '@/modules/auth/components/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
```

#### Metadata
Each route can define metadata for SEO and browser behavior:
```typescript
// app/(dashboard)/tasks/[id]/page.tsx
import { TaskDetails } from '@/modules/tasks/components/TaskDetails';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const task = await getTask(params.id);
  
  return {
    title: `${task.title} | Task Details`,
    description: task.description,
  };
}
```

### 2. Design System (DS)

#### Atomic Design Implementation
The design system follows Atomic Design principles:

1. **Atoms**
   - Basic building blocks
   - Self-contained components
   - No business logic
   - Example: Button, Input, Typography

2. **Molecules**
   - Combinations of atoms
   - Simple interactions
   - Example: SearchBar, Card, FormField

3. **Organisms**
   - Complex UI components
   - Business logic integration
   - Example: Navigation, TaskList, DataTable

4. **Templates**
   - Page-level components
   - Layout structure
   - Example: DashboardLayout, PageTemplate

#### Component Structure
Each component follows a consistent structure:
```typescript
// ds/atoms/Button/Button.tsx
import { cn } from '@/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ 
  variant = 'primary',
  size = 'md',
  className,
  ...props 
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'button',
        `button-${variant}`,
        `button-${size}`,
        className
      )}
      {...props}
    />
  );
};
```

### 3. Modules

#### Module Structure
Each module is organized into:
- `pages/`: Page compositions using DS components
- `hooks/`: Business logic and data layer integration
- `schemas/`: Data validation rules
- `utils/`: Module-specific utilities

#### Custom Hooks
Custom hooks serve as the interface between the presentation layer and data layer. They use `useAppSelector` to access state and `useAppDispatch` to dispatch actions:

```typescript
// modules/tasks/hooks/useTaskList.ts
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks } from '@/store/taskSlice';
import { TaskSchema } from '../schemas/types';

export const useTaskList = () => {
  // useAppDispatch provides access to dispatch function
  const dispatch = useAppDispatch();
  
  // useAppSelector provides access to Redux state
  const { tasks, isLoading, error } = useAppSelector(state => state.tasks);

  // Dispatch action to fetch data
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Return validated data and state
  return {
    tasks: TaskSchema.array().parse(tasks),
    isLoading,
    error
  };
};
```

#### Data Layer Integration
Modules interact with the data layer through custom hooks that dispatch actions and select state:

```typescript
// modules/tasks/hooks/useCreateTask.ts
import { useAppDispatch } from '@/store/hooks';
import { createTask } from '@/store/taskSlice';
import { CreateTaskSchema } from '../schemas/types';

export const useCreateTask = () => {
  // Get dispatch function to send actions to data layer
  const dispatch = useAppDispatch();

  const createNewTask = async (data: unknown) => {
    // Validate data before sending to data layer
    const validatedData = CreateTaskSchema.parse(data);
    // Dispatch action to create task
    return dispatch(createTask(validatedData));
  };

  return { createTask: createNewTask };
};
```

## Best Practices

### 1. Page Organization
- Keep pages focused on composition
- Use route groups for organization
- Implement proper layouts
- Handle loading and error states

### 2. Component Development
- Follow atomic design principles
- Implement proper testing
- Ensure accessibility
- Maintain consistent styling

### 3. Module Development
- Use custom hooks as the interface to data layer
- Implement proper data validation with schemas
- Use useAppSelector to access state
- Use useAppDispatch to modify state
- Keep utilities module-specific

## Integration with Other Layers

### 1. Data Layer
- Use custom hooks as the interface to data layer
- Access state with useAppSelector
- Modify state with useAppDispatch
- Handle loading and error states
- Never connect directly to service layer

### 2. Core Infrastructure
- Use shared utilities
- Implement proper routing
- Handle authentication
- Manage configuration 

## Practical Guide

### 1. Creating a New Feature

#### Step 1: Create Module Structure
```bash
src/modules/your-feature/
├── pages/          # Page compositions
├── hooks/          # Custom hooks
├── schemas/        # Validation schemas
└── utils/          # Module utilities
```

#### Step 2: Define Data Schema
```typescript
// modules/your-feature/schemas/types.ts
import { z } from 'zod';

export const YourFeatureSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  // ... other fields
});

export type YourFeature = z.infer<typeof YourFeatureSchema>;
```

#### Step 3: Create Custom Hook
```typescript
// modules/your-feature/hooks/useYourFeature.ts
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchYourFeature } from '@/store/yourFeatureSlice';
import { YourFeatureSchema } from '../schemas/types';

export const useYourFeature = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading, error } = useAppSelector(state => state.yourFeature);

  useEffect(() => {
    dispatch(fetchYourFeature());
  }, [dispatch]);

  return {
    data: YourFeatureSchema.parse(data),
    isLoading,
    error
  };
};
```

#### Step 4: Create Page
```typescript
// modules/your-feature/pages/YourFeaturePage.tsx
import { PageTemplate } from '@/ds/templates/PageTemplate';
import { Card } from '@/ds/molecules/Card';
import { useYourFeature } from '../hooks/useYourFeature';

export const YourFeaturePage = () => {
  const { data, isLoading, error } = useYourFeature();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <PageTemplate>
      <Card>
        {/* Your feature UI */}
      </Card>
    </PageTemplate>
  );
};
```

#### Step 5: Add Route
```typescript
// app/(dashboard)/your-feature/page.tsx
import { YourFeaturePage } from '@/modules/your-feature/pages/YourFeaturePage';

export default function Page() {
  return <YourFeaturePage />;
}
```

### 2. Using Design System Components

#### Step 1: Import Components
```typescript
import { Button } from '@/ds/atoms/Button';
import { Card } from '@/ds/molecules/Card';
import { PageTemplate } from '@/ds/templates/PageTemplate';
```

#### Step 2: Compose Components
```typescript
export const YourComponent = () => {
  return (
    <PageTemplate>
      <Card>
        <Button variant="primary">Click Me</Button>
      </Card>
    </PageTemplate>
  );
};
```

### 3. Working with Data Layer

#### Step 1: Create Custom Hook
```typescript
// modules/your-feature/hooks/useYourFeature.ts
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { yourFeatureActions } from '@/store/yourFeatureSlice';

export const useYourFeature = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(state => state.yourFeature.data);

  const updateData = (newData: unknown) => {
    dispatch(yourFeatureActions.update(newData));
  };

  return { data, updateData };
};
```

#### Step 2: Use Hook in Component
```typescript
export const YourComponent = () => {
  const { data, updateData } = useYourFeature();

  return (
    <Button onClick={() => updateData(newData)}>
      Update Data
    </Button>
  );
};
```

### 4. Common Patterns

#### Form Handling
```typescript
// modules/your-feature/hooks/useYourFeatureForm.ts
import { useAppDispatch } from '@/store/hooks';
import { yourFeatureActions } from '@/store/yourFeatureSlice';
import { YourFeatureSchema } from '../schemas/types';

export const useYourFeatureForm = () => {
  const dispatch = useAppDispatch();

  const handleSubmit = async (data: unknown) => {
    try {
      const validatedData = YourFeatureSchema.parse(data);
      await dispatch(yourFeatureActions.create(validatedData));
    } catch (error) {
      // Handle validation error
    }
  };

  return { handleSubmit };
};
```

#### List Handling
```typescript
// modules/your-feature/hooks/useYourFeatureList.ts
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { yourFeatureActions } from '@/store/yourFeatureSlice';

export const useYourFeatureList = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading } = useAppSelector(state => state.yourFeature);

  const refreshList = () => {
    dispatch(yourFeatureActions.fetchAll());
  };

  return { items, isLoading, refreshList };
};
```

### 5. Best Practices Checklist

- [ ] Create proper module structure
- [ ] Define data schemas
- [ ] Implement custom hooks
- [ ] Use design system components
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Implement proper validation
- [ ] Follow atomic design principles
- [ ] Write tests for components
- [ ] Write tests for hooks
- [ ] Document your code
- [ ] Handle edge cases
- [ ] Implement proper error boundaries
- [ ] Follow accessibility guidelines
- [ ] Optimize performance 