# Module Creation Guide

The `add-module` command is a powerful tool that helps you rapidly create new modules in your JaseciStack application. It follows our established architecture patterns and creates all necessary files and configurations.

## Basic Usage

```bash
npx create-jaseci-app add-module <module_name>
```

This creates a new module with the default structure and a route at `/<module_name>`.

## Command Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `module_name` | string | Yes | - | The name of the module to create. This will be used for the module directory, route path, and node name unless overridden by other parameters. |
| `--node` | string | No | - | Custom node name for the module. This affects the generated TypeScript interface name and related files. Useful when you want a different name for your node than the module name. |
| `--path` | string | No | - | Custom route path for the module. Supports Next.js route groups (using parentheses) and nested routes. Example: `dashboard/products` or `(admin)/users`. |
| `--node-type` | string | No | - | Defines the structure of your node with field definitions. Supports basic types (string, number, boolean), optional fields (using ?), and union types (using \|). Example: `id:string,name:string,price:number,status:active\|inactive\|pending`. |
| `--apis` | string | No | - | Comma-separated list of API endpoints to generate. Available options: `list`, `get`, `create`, `update`, `delete`, `search`, `filter`. You can specify any combination of these endpoints. |
| `--auth` | `yes\|no` | No | `yes` | Controls authentication and API client type. When `yes` (default), uses `private_api` and wraps the page with `ProtectedRoute`. When `no`, uses `public_api` and creates a public route. |
| `--api-base` | string | No | - | Base path for API endpoints. This is the prefix used for all API calls. Example: `/api/v1/users` or `/todos`. |

### Parameter Details

- **module_name**: The only required parameter. Determines the base name for the module, routes, and files. This name will be used throughout the generated code unless overridden by other parameters.

- **--node**: Optional parameter that lets you specify a different name for the node interface and related files. This is useful when you want your TypeScript interface to have a different name than your module. For example, if your module is named "inventory" but you want the node to be called "Product".

- **--path**: Optional parameter for custom routing paths. Supports Next.js route groups (using parentheses) and nested routes. This gives you flexibility in organizing your application's URL structure. For example, you can create admin-only routes or group related features together.

- **--node-type**: Optional parameter for defining the structure of your node. This is where you specify the fields and their types that your node will have. Supports:
  - Basic types: `string`, `number`, `boolean`
  - Optional fields: Add `?` after the type
  - Union types: Use `|` to specify multiple possible values
  - Date fields: Use `date` type for timestamps

- **--apis**: Optional parameter to specify which API endpoints to generate. You can choose from standard CRUD operations or add custom endpoints. This gives you control over which API methods are available in your module.

- **--auth**: Optional parameter that controls whether the module should be protected and which API client to use. This is important for security and access control in your application.

- **--api-base**: Optional parameter to customize the base path for API endpoints. This is useful when you need to match an existing API structure or when working with third-party APIs.

## Command Options

### `--node <node_name>`
Specify a custom node name for the module. If not provided, the module name is used.

```bash
npx create-jaseci-app add-module inventory --node=Product
```

### `--path <route_path>`
Specify a custom route path. Supports nested routes and route groups.

```bash
# Nested route
npx create-jaseci-app add-module products --path=dashboard/products

# Route group
npx create-jaseci-app add-module users --path="(admin)/users"

# Combined with node
npx create-jaseci-app add-module orders --node=Order --path=dashboard/orders
```

### `--node-type <type_definition>`
Define a custom node type structure. Supports basic types, optional fields, and union types.

```bash
# Basic types
npx create-jaseci-app add-module products --node-type="id:string,name:string,price:number"

# With optional fields
npx create-jaseci-app add-module products --node-type="id:string,name:string,description:string?,price:number"

# With union types
npx create-jaseci-app add-module products --node-type="id:string,name:string,status:active|inactive|pending"

# Complete example
npx create-jaseci-app add-module products --node-type="id:string,name:string,description:string?,price:number,status:active|inactive|pending,created_at:date,updated_at:date"
```

### `--apis <endpoints>`
Specify custom API endpoints for the module. Defaults to standard CRUD operations if not provided.

```bash
# Default CRUD endpoints
npx create-jaseci-app add-module products

# Custom endpoints
npx create-jaseci-app add-module products --apis="list,get,create,update,delete"

# Minimal endpoints
npx create-jaseci-app add-module products --apis="list,get"

# Extended endpoints
npx create-jaseci-app add-module products --apis="list,get,create,update,delete,search,filter"
```

### `--auth <yes|no>`
Control whether the page should be wrapped with `ProtectedRoute` and which API client to use. Defaults to `yes`.
- When `yes` (default): Uses `private_api` and wraps the page with `ProtectedRoute`
- When `no`: Uses `public_api` and creates a public route

```bash
# Protected route with private_api (default)
npx create-jaseci-app add-module products

# Protected route with private_api (explicit)
npx create-jaseci-app add-module products --auth=yes

# Public route with public_api
npx create-jaseci-app add-module public --auth=no
```

### `--api-base <base_path>`
Specify the base path for API endpoints. Defaults to `/<module_name>s`.

```bash
# Custom API base path
npx create-jaseci-app add-module post --api-base=/todos

# Nested API path
npx create-jaseci-app add-module users --api-base=/api/v1/users

# Combined with other options
npx create-jaseci-app add-module post \
  --auth=no \
  --api-base=/todos \
  --node-type="id:number,title:string,completed:boolean"
```

## Generated Structure

Each module comes with a complete structure:

```
modules/<module_name>/
├── actions/          # Redux actions and thunks
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── schemas/         # Zod validation schemas
├── services/        # API services
└── utils/           # Utility functions
```

### Key Files

1. **Node Definition** (`nodes/<node_name>-node.ts`):
```typescript
export interface ProductNode {
  id: string;
  name: string;
  description?: string;
  price: number;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}
```

2. **Redux Slice** (`store/<node_name>Slice.ts`):
```typescript
interface ProductState {
  items: ProductNode[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
  successMessage: string | null;
}
```

3. **Service Layer** (`modules/<module_name>/services/index.ts`):
```typescript
export class ProductService {
  static async getAll(): Promise<ProductNode[]>;
  static async getById(id: string): Promise<ProductNode>;
  static async create(data: Omit<ProductNode, 'id'>): Promise<ProductNode>;
  static async update(id: string, data: Partial<ProductNode>): Promise<ProductNode>;
  static async delete(id: string): Promise<void>;
}
```

4. **Route Configuration** (`app/<route_path>/page.tsx`):
```typescript
import { ProductPage } from '@/modules/products/pages/ProductPage';

export default function Page() {
  return <ProductPage />;
}
```

## Features

Each generated module includes:

1. **Complete CRUD Operations**
   - Type-safe API services
   - Redux actions and thunks
   - Error handling

2. **State Management**
   - Redux slice with proper state structure
   - Loading and error states
   - Success messages

3. **Type Safety**
   - TypeScript interfaces
   - Zod validation schemas
   - Type-safe API calls

4. **Route Integration**
   - Next.js app router setup
   - Layout with metadata
   - Page component
   - Optional authentication protection

5. **UI Components**
   - Integration with design system
   - Loading states
   - Error handling
   - Basic CRUD interface

## Best Practices

1. **Module Organization**
   - Keep module-specific code within the module directory
   - Use the provided structure for consistency
   - Follow the established patterns

2. **Type Safety**
   - Extend the generated node interface as needed
   - Use Zod schemas for validation
   - Keep types in sync across the module

3. **State Management**
   - Use the provided hooks for data access
   - Follow Redux best practices
   - Handle loading and error states

4. **Route Configuration**
   - Use route groups for organization
   - Keep routes consistent with module structure
   - Use proper metadata
   - Consider authentication requirements

## Example Usage

1. Create a basic module:
```bash
npx create-jaseci-app add-module products
```

2. Create a module with custom node and type:
```bash
npx create-jaseci-app add-module inventory \
  --node=Product \
  --node-type="id:string,name:string,price:number,description:string?,status:active|inactive"
```

3. Create a module with custom route and auth:
```bash
npx create-jaseci-app add-module users \
  --path="(admin)/users" \
  --auth=yes
```

4. Create a complete module with public API:
```bash
npx create-jaseci-app add-module post \
  --node=Task \
  --path=dashboard/tasks \
  --node-type="id:number,title:string,completed:boolean,userId:number" \
  --apis="list,get,create,update,delete" \
  --auth=no \
  --api-base=/todos
```

## Next Steps

After creating a module:

1. Customize the node interface in `nodes/<node_name>-node.ts`
2. Implement your module's specific functionality
3. Add more actions and reducers as needed
4. Customize the UI components
5. Add tests for your module 