# CLI Tools

Jaseci Forge provides several CLI tools to help you build and manage your application. Here's a comprehensive guide to all available commands.

## Available Commands

### Create a New Project

```bash
npx create-jaseci-app my-app
```

Creates a new JaseciStack project with the following options:
- `--storybook`: Include Storybook setup
- `--testing`: Include React Testing Library setup
- Package manager selection (npm/yarn/pnpm)

### Clean Up Example App

```bash
npx create-jaseci-app cleanup
```

Removes the example task manager app and prepares your project for development:
- Removes the example task manager module
- Removes example task manager files
- Creates a clean home page
- Cleans up store configuration

### Convert to Tauri App

```bash
npx create-jaseci-app taurify [options]
```

Converts your Next.js app to a Tauri desktop application:

Options:
- `--package-manager <manager>`: Package manager to use (npm/yarn/pnpm, default: npm)

This command will:
- Check for Tauri prerequisites (Rust and Cargo)
- Install Tauri CLI
- Update Next.js configuration for static exports
- Initialize Tauri in your project
- Configure Tauri for Next.js
- Add Tauri scripts to package.json

Prerequisites:
- Rust and Cargo installed (https://rustup.rs/)
- A Next.js project

After running this command, you can:
1. Start development: `npm run tauri dev`
2. Build for production: `npm run tauri build`

### Add a New Module

```bash
npx create-jaseci-app add-module <module_name> [options]
```

Creates a new module with the following options:

#### Basic Options
- `--node <node_name>`: Specify a custom node name
- `--path <route_path>`: Set a custom route path (e.g., "dashboard/products" or "(admin)/users")
- `--auth <yes|no>`: Whether to wrap the page with ProtectedRoute (default: yes)

#### API Options
- `--apis <endpoints>`: Comma-separated list of API endpoints (e.g., "list,get,create,update,delete")
- `--api-base <base_path>`: Base path for API endpoints (e.g., '/todos' for JSONPlaceholder)

#### Node Type Options
- `--node-type <type_definition>`: Custom node type definition (e.g., "id:string,name:string,price:number,status:active|inactive")

## Examples

### Basic Module Creation
```bash
# Create a simple products module
npx create-jaseci-app add-module products
```

### Module with Custom Node
```bash
# Create a module with a custom node name
npx create-jaseci-app add-module inventory --node=Product
```

### Module with Custom Route
```bash
# Create a module with a custom route path
npx create-jaseci-app add-module users --path=dashboard/users
```

### Module with API Integration
```bash
# Create a module with specific API endpoints
npx create-jaseci-app add-module products --apis="list,get,create,update,delete"
```

### Module with Custom Node Type
```bash
# Create a module with a custom node type
npx create-jaseci-app add-module post --node-type="id:string,title:string,status:active|pending|completed"
```

### Module with Public API
```bash
# Create a module that uses public API endpoints
npx create-jaseci-app add-module public --auth=no
```

## Best Practices

1. **Module Naming**
   - Use kebab-case for module names
   - Choose descriptive names that reflect the module's purpose
   - Avoid generic names like "common" or "utils"

2. **Route Organization**
   - Use route groups (parentheses) for logical grouping
   - Keep routes consistent with module structure
   - Consider authentication requirements when planning routes

3. **Node Type Definitions**
   - Define all required fields
   - Use optional fields (with ?) when appropriate
   - Use proper type annotations (string, number, boolean)
   - Use enums for fixed value sets (e.g., status:active|inactive)

4. **API Integration**
   - Choose appropriate API endpoints for your needs
   - Consider authentication requirements
   - Use proper API base paths
   - Handle errors appropriately

## Troubleshooting

### Common Issues

1. **Module Creation Fails**
   - Check if the module name is valid
   - Ensure you have write permissions
   - Verify that the target directory exists

2. **Route Conflicts**
   - Check for existing routes
   - Verify route group syntax
   - Ensure path is properly formatted

3. **Type Definition Errors**
   - Verify type syntax
   - Check for valid type names
   - Ensure proper enum formatting

### Getting Help

If you encounter any issues:
1. Check the [documentation](https://jaseci-forge.vercel.app/docs)
2. Search [existing issues](https://github.com/Jaseci-Labs/JaseciForge/issues)
3. Create a new issue if needed 