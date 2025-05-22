# Add Module

The `add-module` command creates a new module in your JaseciStack project with a complete structure including components, API integration, and state management.

## Usage

```bash
npx create-jaseci-app add-module <module_name> [options]
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--route` | Custom route path | `/<module_name>` |
| `--node-type` | Custom node type name | `<ModuleName>Node` |
| `--api-path` | Custom API endpoint path | `/<module_name>` |
| `--package-manager` | Package manager to use | `npm` |

## What it Creates

The command generates a complete module structure:

1. **Module Directory**
   - Components
   - API integration
   - State management
   - Type definitions

2. **API Integration**
   - API client setup
   - Type definitions
   - Error handling

3. **State Management**
   - Redux slice
   - Actions and reducers
   - Type definitions

4. **Components**
   - Main module component
   - List component
   - Form component
   - Type definitions

## Examples

```bash
# Basic module creation
npx create-jaseci-app add-module users

# Custom route
npx create-jaseci-app add-module users --route /admin/users

# Custom node type
npx create-jaseci-app add-module users --node-type UserNode

# Custom API path
npx create-jaseci-app add-module users --api-path /api/v1/users

# Using yarn
npx create-jaseci-app add-module users --package-manager yarn
```

## Module Structure

```
src/
├── modules/
│   └── users/                    # Module directory
│       ├── components/           # React components
│       │   ├── UserList.tsx     # List component
│       │   ├── UserForm.tsx     # Form component
│       │   └── index.tsx        # Main component
│       ├── api/                 # API integration
│       │   ├── usersApi.ts      # API client
│       │   └── types.ts         # API types
│       ├── store/              # State management
│       │   ├── usersSlice.ts   # Redux slice
│       │   └── types.ts        # State types
│       └── types.ts            # Shared types
```

## Best Practices

1. **Module Naming**
   - Use plural nouns (e.g., `users`, `products`)
   - Use kebab-case for directory names
   - Use PascalCase for component names

2. **Route Organization**
   - Use meaningful route paths
   - Follow RESTful conventions
   - Consider nested routes

3. **Node Type Definitions**
   - Use descriptive names
   - Follow naming conventions
   - Include proper documentation

4. **API Integration**
   - Use consistent endpoint patterns
   - Implement proper error handling
   - Follow API best practices

## Troubleshooting

### Common Issues

1. **Module Creation Fails**
   - Check module name validity
   - Verify directory permissions
   - Check for existing modules

2. **Route Conflicts**
   - Check for existing routes
   - Verify route path format
   - Check for special characters

3. **Type Definition Errors**
   - Check TypeScript configuration
   - Verify type imports
   - Check for circular dependencies

### Getting Help

If you encounter any issues:
1. Check the [documentation](https://jaseci-forge.vercel.app/docs)
2. Search [existing issues](https://github.com/Jaseci-Labs/JaseciForge/issues)
3. Create a new issue if needed 