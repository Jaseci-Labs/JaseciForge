# Module Creation

Jaseci Forge provides a powerful module creation system that allows you to create feature modules with multiple nodes. This feature helps you organize your application's functionality into logical, reusable components.

## Basic Usage

Create a new module with a single node:

```bash
npx jaseci-forge add-module my-module
```

This creates a basic module with:
- A single node (defaults to module name)
- Standard CRUD operations
- Basic UI components
- Redux integration

## Multi-Node Modules

Create a module with multiple nodes:

```bash
npx jaseci-forge add-module my-module --node task --node project --node user
```

Each node in a multi-node module gets:
- Its own service layer
- Dedicated Redux slice
- Custom hooks
- Type definitions
- API integrations

### Node Configuration

Each node can be configured independently:

```bash
# Customize node APIs
npx jaseci-forge add-module my-module \
  --node task \
  --node project \
  --taskApis getAll,create,update \
  --projectApis getAll,getById,delete

# Customize node types
npx jaseci-forge add-module my-module \
  --node task \
  --node project \
  --taskType id:string,name:string,status:active|inactive \
  --projectType id:string,title:string,description:string?

# Customize API base paths
npx jaseci-forge add-module my-module \
  --node task \
  --node project \
  --taskApiBase /api/tasks \
  --projectApiBase /api/projects
```

## Module Structure

A module created with `add-module` has the following structure:

```
modules/
└── my-module/
    ├── actions/
    │   ├── index.ts
    │   ├── task.ts
    │   ├── project.ts
    │   └── user.ts
    ├── hooks/
    │   ├── index.ts
    │   ├── task.ts
    │   ├── project.ts
    │   └── user.ts
    ├── pages/
    │   └── my-module/
    │       ├── page.tsx
    │       └── layout.tsx
    ├── services/
    │   ├── index.ts
    │   ├── task.ts
    │   ├── project.ts
    │   └── user.ts
    └── utils/
        └── index.ts
```

## Node Components

Each node in a module includes:

### 1. Service Layer
- API client integration
- CRUD operations
- Type-safe API calls
- Error handling

### 2. Redux Integration
- Dedicated slice
- State management
- Action creators
- Selectors

### 3. Custom Hooks
- Data fetching
- State access
- Loading states
- Error handling

### 4. Type Definitions
- Node interface
- API response types
- State types
- Action types

## Page Component

The module's page component:
- Displays all nodes in a single view
- Handles loading states
- Manages errors
- Provides refresh functionality
- Supports authentication

Example page structure:
```tsx
export default function MyModulePage() {
  const taskData = useTasks();
  const projectData = useProjects();
  const userData = useUsers();

  return (
    <div className="p-4">
      {/* Task Section */}
      <div className="mb-8">
        <h1>Tasks</h1>
        {/* Task list */}
      </div>

      {/* Project Section */}
      <div className="mb-8">
        <h1>Projects</h1>
        {/* Project list */}
      </div>

      {/* User Section */}
      <div className="mb-8">
        <h1>Users</h1>
        {/* User list */}
      </div>
    </div>
  );
}
```

## Best Practices

1. **Node Organization**
   - Keep related nodes in the same module
   - Use clear, descriptive node names
   - Maintain consistent naming conventions

2. **Type Safety**
   - Define clear interfaces for each node
   - Use TypeScript throughout
   - Leverage type inference

3. **State Management**
   - Keep node state isolated
   - Use proper action naming
   - Implement proper loading states

4. **Error Handling**
   - Handle API errors gracefully
   - Provide user feedback
   - Log errors appropriately

5. **Performance**
   - Implement proper caching
   - Use optimistic updates
   - Handle loading states efficiently

## Next Steps

After creating a module:
1. Customize node types and APIs
2. Implement business logic
3. Add UI components
4. Configure authentication
5. Add tests

## Related Documentation
- [Service Layer](../layers/service-layer.md)
- [Data Layer](../layers/data-layer.md)
- [Presentation Layer](../layers/presentation-layer.md)
- [Core Infrastructure](../layers/core-infrastructure.md) 