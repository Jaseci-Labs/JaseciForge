# Jaseci Forge

[![npm version](https://badge.fury.io/js/jaseci-forge.svg)](https://badge.fury.io/js/create-jaseci-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful CLI tool for rapidly bootstrapping modern front-end applications with Next.js, TypeScript, Redux Toolkit, and ShadCN UI.

## 📚 Documentation

For detailed documentation, visit our [documentation website](https://jaseci-forge.vercel.app/docs).

## 🚀 Quick Start

```bash
npx create-jaseci-app my-app
```

## ✨ Features

- **Modern Stack**: Next.js, TypeScript, Redux Toolkit, ShadCN UI, Tailwind CSS
- **Production Ready**: Complete setup with best practices and optimizations
- **Demo App**: TaskForge demo application included
- **Type Safety**: Full TypeScript support
- **Testing**: Jest and React Testing Library setup
- **Component Development**: Storybook integration
- **Authentication**: JWT-based auth system with RBAC
- **Code Quality**: ESLint, Prettier, and Husky pre-configured
- **Module System**: Rapid module creation with full CRUD, routing, and state management

## 📦 Installation

```bash
# Using npm
npm install -g jaseci-forge

# Using yarn
yarn global add jaseci-forge

# Using pnpm
pnpm add -g jaseci-forge
```

## 🛠️ Usage

1. Create a new project:
```bash
npx create-jaseci-app my-app
```

2. Follow the CLI prompts to customize your project:
   - Include Storybook? (y/N)
   - Include React Testing Library? (y/N)
   - Choose package manager (npm/yarn/pnpm)

3. Start development:
```bash
cd my-app
npm run dev
```

4. Create new modules:
```bash
# Create a basic module
npx create-jaseci-app add-module products

# Create a module with custom node
npx create-jaseci-app add-module inventory --node=Product

# Create a module with custom route path
npx create-jaseci-app add-module users --path="(admin)/users"

# Create a module with custom node type
npx create-jaseci-app add-module products --node-type="id:string,name:string,price:number,description:string?,status:active|inactive"

# Create a module with custom API endpoints
npx create-jaseci-app add-module products --apis="list,get,create,update,delete"

# Create a module without authentication
npx create-jaseci-app add-module public --auth=no

# Create a complete module with all options
npx create-jaseci-app add-module inventory \
  --node=Product \
  --path=dashboard/inventory \
  --node-type="id:string,name:string,price:number,description:string?,status:active|inactive" \
  --apis="list,get,create,update,delete" \
  --auth=yes
```

### Module Creation Options

- `--node <name>`: Specify a custom node name (defaults to module name)
- `--path <path>`: Custom route path (e.g., "dashboard/products" or "(admin)/users")
- `--node-type <type>`: Custom node type definition (e.g., "id:string,name:string,price:number,status:active|inactive")
- `--apis <endpoints>`: Comma-separated list of API endpoints (e.g., "list,get,create,update,delete")
- `--auth <yes|no>`: Whether to wrap the page with ProtectedRoute (default: yes)

Each module comes with:
- Complete CRUD operations
- Redux state management
- Type-safe API services
- Zod validation schemas
- Custom React hooks
- Route configuration
- Basic UI components
- Authentication protection (optional)

## 🏗️ Project Structure

```
my-app/
├── _core/              # Core infrastructure
├── ds/                 # Design System
├── app/                # Next.js app router
├── modules/            # Feature modules
│   └── products/       # Example module
│       ├── actions/    # Redux actions
│       ├── hooks/      # Custom hooks
│       ├── pages/      # Page components
│       ├── schemas/    # Validation schemas
│       ├── services/   # API services
│       └── utils/      # Utilities
├── store/              # Redux store
├── nodes/              # Data models
└── styles/             # Global styles
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run storybook` - Start Storybook

## 🌐 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_AUTH_PROVIDER=local

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [ShadCN UI Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Documentation](https://jaseci-forge.netlify.app/)
- [GitHub Repository](https://github.com/yourusername/jaseci-forge)
- [Issue Tracker](https://github.com/yourusername/jaseci-forge/issues)
- [npm Package](https://www.npmjs.com/package/create-jaseci-app)