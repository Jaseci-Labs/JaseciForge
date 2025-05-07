 # Jaseci Forge

## Overview
Jaseci Forge is a CLI tool designed to quickly set up JaseciStack Front-End projects. It creates a Next.js application pre-configured with TypeScript, Redux Toolkit, ShadCN UI, Tailwind CSS, and includes a TaskForge demo app to help you get started immediately.

## Why Use Jaseci Forge?
- **Quick Setup**: Instantly bootstrap a complete modern front-end stack
- **Best Practices**: Pre-configured with industry standards and optimizations
- **Production Ready**: Includes everything needed for development and deployment
- **Demo Application**: Comes with TaskForge demo to demonstrate architecture and patterns

## Pre-built Features

### Authentication & Authorization
- Complete authentication system with JWT
- Role-based access control (RBAC)
- Protected routes and API endpoints
- Session management
- [Authentication Documentation](docs/features/authentication.md)

### Testing Setup
- React Testing Library configuration
- Jest setup with TypeScript support
- Pre-configured test utilities
- Example test cases
- [Testing Documentation](docs/features/testing.md)

### Component Development
- Storybook configuration
- Component documentation
- Interactive component playground
- Visual regression testing setup
- [Storybook Documentation](docs/features/storybook.md)

## Installation & Setup

### Prerequisites
- Node.js (version 16.x or later)
- npm, yarn, or pnpm package manager

### Quick Start
1. Run the CLI using `npx`:

```bash
npx create-jaseci-app my-app
```

2. Answer the CLI prompts to customize your project:
   - Include Storybook? (y/N)
   - Include React Testing Library? (y/N)
   - Which package manager? (npm/yarn/pnpm)

3. Configure your environment:
   - Navigate to the project directory: `cd my-app`
   - Copy the environment template: `cp .env.example .env.local`
   - Update the variables in `.env.local` with your configuration

4. Start the development server:
```bash
npm run dev   # or yarn dev / pnpm dev
```

5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure
```
my-app/
├── _core/              # Core infrastructure and shared utilities
│   ├── api-client.ts   # Centralized API client with interceptors
│   ├── hooks/          # Shared React hooks (useApi, useAuth, etc.)
│   ├── keys.ts         # Environment and configuration keys
│   ├── app-configs.ts  # Application-wide configurations
│   └── utils.ts        # Shared utility functions
│
├── ds/                 # Design System (Presentation Layer)
│   ├── atoms/          # Basic building blocks (buttons, inputs)
│   ├── molecules/      # Combinations of atoms
│   ├── organisms/      # Complex UI components
│   └── templates/      # Page-level components
│
├── app/                # Next.js app router pages
│   ├── (auth)/         # Authentication-related pages
│   ├── (dashboard)/    # Dashboard and main application pages
│   └── layout.tsx      # Root layout configuration
│
├── modules/            # Feature modules (organized by domain)
│   ├── tasks/          # Task management feature
│   │   ├── actions/    # Redux actions and thunks
│   │   ├── hooks/      # Custom hooks connecting to data layer
│   │   ├── pages/      # Pages using DS components
│   │   ├── schemas/    # Zod validation schemas
│   │   ├── services/   # API endpoints and BE integration
│   │   └── utils/      # Module-specific utilities
│   └── users/          # User management feature
│       ├── actions/
│       ├── hooks/
│       ├── pages/
│       ├── schemas/
│       ├── services/
│       └── utils/
│
├── store/              # Data Layer (Redux)
│   ├── slices/         # Redux Toolkit slices
│   │   ├── taskSlice.ts
│   │   └── userSlice.ts
│   └── index.ts        # Store configuration
│
├── nodes/              # Data models and types
│   ├── task-node.ts    # Task data model
│   └── user-node.ts    # User data model
│
├── styles/             # Global styles and Tailwind configuration
├── public/             # Static assets
└── .env.example        # Environment variables template
```

## Architecture
The application follows a layered architecture pattern with clear separation of concerns. For detailed documentation on each layer, see:

- [Architecture Overview](docs/architecture.md)
- [Presentation Layer](docs/layers/presentation-layer.md)
- [Data Layer](docs/layers/data-layer.md)
- [Service Layer](docs/layers/service-layer.md)
- [Core Infrastructure](docs/layers/core-infrastructure.md)

### Golden Rules

1. **Core Layer Abstraction**
   - Always expose third-party libraries through `_core` with our own interfaces
   - Never use third-party libraries directly in modules or components
   - Examples:
     ```typescript
     // ✅ DO: Use core abstractions
     import { useAppNavigation } from '@/core/hooks/useAppNavigation';
     import { apiClient } from '@/core/api-client';
     import { config } from '@/core/app-configs';

     // ❌ DON'T: Use third-party libraries directly
     import { useRouter } from 'next/router';
     import axios from 'axios';
     import { config } from 'some-config-library';
     ```

2. **Interface Consistency**
   - Maintain consistent interfaces across the application
   - Use TypeScript interfaces for all core abstractions
   - Document interface changes in core layer

3. **Dependency Management**
   - All external dependencies should be managed through core layer
   - Keep third-party implementation details isolated
   - Make it easy to swap implementations if needed

### Key Features
- Three-layer architecture (Presentation, Data, Service)
- Atomic Design implementation
- Redux Toolkit for state management
- Type-safe development with TypeScript
- Centralized API client with interceptors
- Core infrastructure for shared functionality

## Available Commands
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Run the production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests (if testing library was included)
- `npm run storybook` - Start Storybook (if Storybook was included)

## Environment Configuration
The `.env.example` file contains templates for all required environment variables. Copy this file to `.env.local` and update the values according to your needs:

```
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_AUTH_PROVIDER=local

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [ShadCN UI Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Troubleshooting
If you encounter any issues during setup or development:
1. Ensure Node.js is properly installed and up to date
2. Verify that all environment variables are correctly set
3. Check that your package manager is correctly installed
4. Clear your browser cache if you experience UI issues

## Contributing
Contributions to Jaseci Forge are welcome! Please refer to our contribution guidelines for more information.