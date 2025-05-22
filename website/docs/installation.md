# Installation Guide

This guide will help you install and set up Jaseci Forge CLI tool for your development environment.

## Prerequisites

Before installing Jaseci Forge, ensure you have:

- Node.js 18.x or later
- npm 9.x or later (or yarn/pnpm)
- Git

## Creating Your First Project

Create a new JaseciStack project:

```bash
npx create-jaseci-app my-app
```

During project creation, you'll be prompted to:
1. Choose whether to include Storybook
2. Choose whether to include React Testing Library
3. Select your preferred package manager (npm/yarn/pnpm)

## Cleaning Up Example App

After creating your project, you can remove the example task manager app:

```bash
cd my-app
npx create-jaseci-app cleanup
```

This will:
- Remove the example task manager module and its files
- Create a clean home page
- Clean up the Redux store configuration
- Prepare your app for your own modules

## Development Setup

1. Install dependencies:
```bash
npm install
# or
yarn
# or
pnpm install
```

2. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Configure your environment variables:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_AUTH_PROVIDER=local

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Troubleshooting

### Common Issues

1. **Permission Errors**
   ```bash
   # If you encounter permission errors during global installation
   sudo npm install -g create-jaseci-app
   ```

2. **Version Conflicts**
   ```bash
   # Clear npm cache if you encounter version conflicts
   npm cache clean --force
   ```

3. **Node Version Issues**
   ```bash
   # Check your Node.js version
   node --version
   
   # If needed, update Node.js using nvm
   nvm install 18
   nvm use 18
   ```

### Getting Help

If you encounter any issues:

1. Check the [documentation](https://jaseci-forge.vercel.app/docs)
2. Search [existing issues](https://github.com/yourusername/jaseci-forge/issues)
3. Create a new issue if needed

## Next Steps

After installation:

1. Read the [Quick Start Guide](./quickstart) to learn about basic usage
2. Check out the [Architecture Overview](./architecture) to understand the project structure
3. Explore the [Module Creation Guide](./module-creation) to start building your application
