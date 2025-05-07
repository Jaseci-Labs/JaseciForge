# Presentation Layer

## Overview
The presentation layer is responsible for the user interface and user interactions. It follows the Atomic Design methodology and is built using Next.js components.

## Directory Structure
```
ds/                 # Design System
├── atoms/          # Basic building blocks
├── molecules/      # Combinations of atoms
├── organisms/      # Complex UI components
└── templates/      # Page-level components
```

## Components

### 1. Atoms
- Basic UI elements
- Highly reusable
- No business logic
- Examples:
  - Buttons
  - Inputs
  - Typography
  - Icons

### 2. Molecules
- Combinations of atoms
- Simple interactions
- Limited business logic
- Examples:
  - Form fields
  - Search bars
  - Navigation items

### 3. Organisms
- Complex UI components
- Business logic integration
- State management
- Examples:
  - Task lists
  - User profiles
  - Data tables

### 4. Templates
- Page layouts
- Component composition
- Layout structure
- Examples:
  - Dashboard template
  - Auth template
  - Error template

## Integration with Data Layer

### Custom Hooks
```typescript
// Example of a custom hook connecting to data layer
export const useTaskManager = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);

  return {
    tasks,
    actions: {
      addTask: (task) => dispatch(addTask(task)),
      updateTask: (task) => dispatch(updateTask(task)),
    },
  };
};
```

### Component Usage
```typescript
// Example of a component using custom hooks
export const TaskList = () => {
  const { tasks, actions } = useTaskManager();

  return (
    <div>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdate={actions.updateTask}
        />
      ))}
    </div>
  );
};
```

## Best Practices

1. **Component Design**
   - Keep components focused and single-responsibility
   - Use TypeScript for type safety
   - Implement proper prop validation
   - Follow atomic design principles

2. **State Management**
   - Use custom hooks for data access
   - Keep UI state local when possible
   - Use Redux for global state
   - Implement proper loading states

3. **Performance**
   - Implement proper memoization
   - Use lazy loading for large components
   - Optimize re-renders
   - Follow React best practices

4. **Accessibility**
   - Use semantic HTML
   - Implement ARIA attributes
   - Ensure keyboard navigation
   - Follow WCAG guidelines

## Examples

### 1. Atomic Component
```typescript
// ds/atoms/button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = ({ variant, children, onClick }: ButtonProps) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### 2. Organism Component
```typescript
// ds/organisms/task-list.tsx
interface TaskListProps {
  tasks: TaskNode[];
  onUpdate: (task: TaskNode) => void;
}

export const TaskList = ({ tasks, onUpdate }: TaskListProps) => {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};
```

### 3. Template Component
```typescript
// ds/templates/dashboard-template.tsx
interface DashboardTemplateProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export const DashboardTemplate = ({
  header,
  sidebar,
  children,
}: DashboardTemplateProps) => {
  return (
    <div className="dashboard">
      <header>{header}</header>
      <div className="dashboard-content">
        <aside>{sidebar}</aside>
        <main>{children}</main>
      </div>
    </div>
  );
};
``` 