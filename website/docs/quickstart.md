# Quickstart Guide

Welcome to Jaseci Forge! This guide will help you get started quickly.

## Getting Started

1. [Installation and Setup](./guides/step1-installation.md)
2. [Module Creation](./guides/step2-module-creation.md)
3. [Layer Customization](./guides/step3-customize-layers.md)

## Architecture Overview

Learn about our [Architecture](./architecture.md) and how different layers work together.

## Best Practices

Check out our [Best Practices](./guides/summary.md#best-practices) guide for tips on building robust applications.

## Next Steps

After completing the quickstart, you can:
1. Explore more advanced features
2. Build custom modules
3. Contribute to the project

## Basic Commands

### Create a New Project

```bash
# Create a new project
npx create-jaseci-app my-app

# Navigate to project directory
cd my-app
```

### Optional: Clean Up Example App

If you included the example task manager app during project creation and want to remove it:

```bash
# Remove the example task manager app and its related files
npx create-jaseci-app cleanup
```

This command will:
- Remove the example task manager module
- Remove example task manager files
- Create a clean home page
- Clean up store configuration

### Start Development Server

```bash
# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Your application will be available at [http://localhost:3000](http://localhost:3000)

## Common Workflows

### 1. Creating a New Module

```bash
# Basic module creation
npx create-jaseci-app add-module products

# Module with custom node
npx create-jaseci-app add-module inventory --node=Product

# Module with custom route
npx create-jaseci-app add-module users --path=dashboard/users
```

### 2. Working with Nodes

```bash
# Create a node with basic fields
npx create-jaseci-app add-module post --node-type="id:string,title:string,status:active|pending|completed"

# Create a node with optional fields
npx create-jaseci-app add-module products --node-type="id:string,name:string,description:string?,price:number"
```

### 3. Setting Up Authentication

1. Enable authentication in `.env.local`:
```env
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_AUTH_PROVIDER=local
```

2. Create an auth module:
```bash
npx create-jaseci-app add-module auth --path="(auth)" --auth=no
```

### 4. Adding API Integration

1. Configure your API URL in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

2. Create a module with API endpoints:
```bash
npx create-jaseci-app add-module products --apis="list,get,create,update,delete"
```

## Project Structure

```
my-app/
├── app/              # Next.js app directory
├── modules/          # Feature modules
├── ds/              # Design system components
├── nodes/           # Node definitions
└── store/           # Redux store
```

## Common Tasks

### Adding a New Page

1. Create a new module:
```bash
npx create-jaseci-app add-module dashboard --path=dashboard
```

2. The page will be available at `/dashboard`

### Adding State Management

1. Create a module with Redux slice:
```bash
npx create-jaseci-app add-module products
```

2. Use the generated hooks in your components:
```typescript
import { useProducts } from '@/modules/products/hooks/useProducts';

function MyComponent() {
  const { products, isLoading, error } = useProducts();
  // ...
}
```

### Adding Form Validation

1. Create a module with Zod schema:
```bash
npx create-jaseci-app add-module products --node-type="id:string,name:string,price:number"
```

2. Use the generated schema in your forms:
```typescript
import { productSchema } from '@/modules/products/schemas/productSchema';

// Validate form data
const result = productSchema.safeParse(formData);
```
