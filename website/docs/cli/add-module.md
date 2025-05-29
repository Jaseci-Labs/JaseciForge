# Add Module

The `add-module` command lets you add a new module to your JaseciStack project, with support for multiple nodes and advanced configuration options.

## Usage

```bash
npx create-jaseci-app add-module <module_name> [options]
```

## Options

- `--node <node_name>`: Specify a custom node name (defaults to module name)
- `--path <route_path>`: Custom route path (e.g., "dashboard/products" or "(admin)/users")
- `--apis <endpoints>`: Comma-separated list of API endpoints (e.g., "list,get,create,update,delete")
- `--node-type <type_definition>`: Custom node type definition (e.g., "id:string,name:string,price:number,status:active|inactive")
- `--auth <yes|no>`: Whether to wrap the page with ProtectedRoute and use private_api (default: yes)
- `--api-base <base_path>`: Base path for API endpoints (e.g., "/todos" for JSONPlaceholder)

## Default Node Type

If no custom node type is specified, the following default type is used:

```typescript
{
  id: string;
  name: string;
  description: string?;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive';
}
```

## Default API Endpoints

If no custom APIs are specified, the following endpoints are generated:

- `getAll`: Get all items
- `getById`: Get a specific item by ID
- `create`: Create a new item
- `update`: Update an existing item
- `delete`: Delete an item

## What it Creates

The command generates a complete module structure:

1. **Module Directory Structure**
   ```
   modules/
   └── <module_name>/
       ├── actions/        # Redux actions
       ├── hooks/         # React hooks
       ├── pages/         # Page components
       ├── schemas/       # Zod schemas
       ├── services/      # API services
       └── utils/         # Utility functions
   ```

2. **Node Definition**
   - Creates a TypeScript interface in `nodes/<node_name>-node.ts`
   - Generates Zod schema for validation
   - Supports custom type definitions

3. **API Integration**
   - Generates API service methods based on specified endpoints
   - Integrates with authentication (private_api/public_api)
   - Handles error cases and loading states

4. **State Management**
   - Creates Redux slice with actions and reducers
   - Implements loading, error, and success states
   - Provides type-safe state management

5. **Page Components**
   - Generates a basic page component with authentication wrapper
   - Implements data fetching and display
   - Includes loading and error states

6. **Route Configuration**
   - Creates Next.js route in app directory
   - Generates page.tsx and layout.tsx
   - Configures metadata and layout options

## Examples

```bash
# Basic module creation
npx create-jaseci-app add-module users

# Custom node type and APIs
npx create-jaseci-app add-module products \
  --node-type="id:string,name:string,price:number,status:active|inactive" \
  --apis="getAll,create,update,delete" \
  --api-base="/api/products"

# Custom route path
npx create-jaseci-app add-module users \
  --path="dashboard/users" \
  --auth="yes"

# Public module without authentication
npx create-jaseci-app add-module blog \
  --auth="no" \
  --api-base="/api/posts"
```

## Best Practices

1. **Module Naming**
   - Use plural nouns (e.g., `users`, `products`)
   - Use kebab-case for directory names
   - Use PascalCase for component names

2. **Node Type Definitions**
   - Use descriptive field names
   - Specify proper types (string, number, boolean)
   - Use optional fields with `?` suffix
   - Use union types with `|` for enums

3. **API Integration**
   - Use consistent endpoint patterns
   - Implement proper error handling
   - Follow RESTful conventions

4. **Route Organization**
   - Use meaningful route paths
   - Consider nested routes
   - Use route groups when needed

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