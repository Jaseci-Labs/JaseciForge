# Jaseci Forge

## Overview
Jaseci Forge is a CLI tool designed to quickly set up JaseciStack Front-End projects. It creates a Next.js application pre-configured with TypeScript, Redux Toolkit, ShadCN UI, Tailwind CSS, and includes a TaskForge demo app to help you get started immediately.

## Why Use Jaseci Forge?
- **Quick Setup**: Instantly bootstrap a complete modern front-end stack
- **Best Practices**: Pre-configured with industry standards and optimizations
- **Production Ready**: Includes everything needed for development and deployment
- **Demo Application**: Comes with TaskForge demo to demonstrate architecture and patterns

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
├── components/       # Reusable UI components
├── app/              # Next.js app router pages and layouts
├── features/         # Feature-specific components and logic
├── lib/              # Utility functions and shared code
├── public/           # Static assets
├── redux/            # Redux store configuration and slices
├── styles/           # Global styles and Tailwind configuration
├── types/            # TypeScript type definitions
└── .env.example      # Environment variables template
```

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