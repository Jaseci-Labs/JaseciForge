# Module Creation Guide

The `add-module` command is a powerful tool that helps you rapidly create new modules in your JaseciStack application. It follows our established architecture patterns and creates all necessary files and configurations.

## Basic Usage

```bash
npx create-jaseci-app add-module <module_name>
```

This creates a new module with the default structure and a route at `/<module_name>`.

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
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive';
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

## Example Usage

1. Create a basic module:
```bash
npx create-jaseci-app add-module products
```

2. Create a module with custom node:
```bash
npx create-jaseci-app add-module inventory --node=Product
```

3. Create a module with custom route:
```bash
npx create-jaseci-app add-module users --path="(admin)/users"
```

4. Create a complete module:
```bash
npx create-jaseci-app add-module orders --node=Order --path=dashboard/orders
```

## Next Steps

After creating a module:

1. Customize the node interface in `nodes/<node_name>-node.ts`
2. Implement your module's specific functionality
3. Add more actions and reducers as needed
4. Customize the UI components
5. Add tests for your module 