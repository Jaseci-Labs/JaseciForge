# Cleanup

The `cleanup` command removes the example task manager app and prepares your project for development.

## Usage

```bash
npx create-jaseci-app cleanup
```

## What it Does

This command performs the following actions:

1. Removes the example task manager module
2. Removes example task manager files
3. Creates a clean home page
4. Cleans up store configuration

## When to Use

Use this command when you want to:
- Start fresh with your own modules
- Remove the example code
- Clean up the project structure

## Example

```bash
# Clean up the example app
npx create-jaseci-app cleanup
```

## After Cleanup

After running the cleanup command:

1. Your project will have a clean structure
2. The home page will be empty and ready for customization
3. The Redux store will be configured but empty
4. You can start adding your own modules

## Project Structure After Cleanup

```
my-app/
├── src/
│   ├── app/              # Next.js app directory
│   │   └── page.tsx     # Clean home page
│   ├── components/       # Shared components
│   ├── modules/          # Empty modules directory
│   ├── store/           # Clean store configuration
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── tests/              # Test files
```

## Best Practices

1. **Module Development**
   - Start with a clear module structure
   - Follow the established patterns
   - Keep modules focused and cohesive

2. **State Management**
   - Add only necessary state
   - Use proper TypeScript types
   - Follow Redux best practices

3. **Component Organization**
   - Create reusable components
   - Follow the component hierarchy
   - Use proper naming conventions

## Troubleshooting

### Common Issues

1. **Cleanup Fails**
   - Ensure you're in the project directory
   - Check file permissions
   - Verify project structure

2. **Missing Files**
   - Check if files were properly removed
   - Verify new files were created
   - Check for any error messages

### Getting Help

If you encounter any issues:
1. Check the [documentation](https://jaseci-forge.vercel.app/docs)
2. Search [existing issues](https://github.com/Jaseci-Labs/JaseciForge/issues)
3. Create a new issue if needed 