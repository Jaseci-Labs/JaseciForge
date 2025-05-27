# Create App

The `create-app` command is used to generate a new JaseciStack project.

## Usage

```bash
npx create-jaseci-app my-app
```

## Options

- `--example`: Include example task manager app
- `--storybook`: Include Storybook setup
- `--testing`: Include React Testing Library setup
- Package manager selection (npm/yarn/pnpm)

## What it Does

This command creates a new JaseciStack project with:

- Next.js setup with TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- ESLint and Prettier for code quality
- Jest and React Testing Library for testing
- Storybook for component development (optional)
- Example task manager module (optional)
- Authentication setup
- Protected routes
- API integration

## Example

```bash
# Create a new project with default settings
npx create-jaseci-app my-app

# Create a project with example app
npx create-jaseci-app my-app --example

# Create a project with Storybook
npx create-jaseci-app my-app --storybook

# Create a project with testing setup
npx create-jaseci-app my-app --testing
```

## Next Steps

After creating your project:

1. Navigate to the project directory:
   ```bash
   cd my-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

## Project Structure

The generated project follows a modular structure:

```
my-app/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # Shared components
│   ├── modules/          # Feature modules
│   ├── store/           # Redux store configuration
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── tests/              # Test files
```

## Best Practices

1. **Module Organization**
   - Keep related code together in modules
   - Use clear, descriptive module names
   - Follow the established module structure

2. **Component Development**
   - Create reusable components
   - Use TypeScript for type safety
   - Write tests for critical components

3. **State Management**
   - Use Redux Toolkit for global state
   - Keep state minimal and normalized
   - Use local state when appropriate

## Troubleshooting

### Common Issues

1. **Installation Fails**
   - Check Node.js version (v18 or later required)
   - Ensure you have write permissions
   - Clear npm cache if needed

2. **Dependencies Issues**
   - Delete node_modules and reinstall
   - Check for conflicting dependencies
   - Update package manager

### Getting Help

If you encounter any issues:
1. Check the [documentation](https://jaseci-forge.vercel.app/docs)
2. Search [existing issues](https://github.com/Jaseci-Labs/JaseciForge/issues)
3. Create a new issue if needed 