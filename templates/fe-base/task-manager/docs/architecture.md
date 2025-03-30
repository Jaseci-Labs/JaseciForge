# Application Architecture Documentation

## Overview

This document outlines the architecture of the application, explaining the structure, key modules, and design patterns used.

## Directory Structure

The application follows a modular, feature-based architecture with a clear separation of concerns:

```
├── app                  # Next.js app directory (pages and routing)
├── _core                # Core utilities and configurations
├── ds                   # Design system components
├── modules              # Feature modules
├── nodes                # Data models/types
├── store                # Redux state management
├── styles               # Global styles
└── stories              # Storybook stories
```

## Key Components

### App (`/app`)

The app directory follows Next.js App Router structure:
- `/app/page.tsx` - Main application page
- `/app/layout.tsx` - Root layout with providers
- Feature-specific page routes (e.g., `/auth/login/page.tsx`)

### Core (`/_core`)

Contains application-wide utilities and configurations:
- `api-client.ts` - API client for server communication
- `app-configs.ts` - Application configurations
- `useAppNavigation.ts` - Navigation hook for consistent routing
- `useMaintenanceCheck.ts` - Hook to check app maintenance status

### Design System (`/ds`)

Organized following atomic design principles:
- `/atoms` - Basic UI components (buttons, inputs, etc.)
- `/molecules` - Combinations of atoms (task items, headers, etc.)
- `/organisms` - Complex UI components (forms, lists, etc.)
- `/templates` - Page layouts (two-column, centered, etc.)
- `theme-provider.tsx` - Theme context provider

### Modules (`/modules`)

Feature-based modules that encapsulate related functionality:

#### Users Module (`/modules/users`)
- `auth-service.ts` - Authentication service
- `/hooks` - Custom hooks for authentication
  - `use-auth.ts` - Main authentication hook
  - `use-login-form.ts` - Login form state management
  - `use-register-form.ts` - Registration form state management
- `/pages` - Page components
- `/schemas` - Zod validation schemas

#### Tasks Module (`/modules/tasks`)
- `task-service.ts` - Task management service
- `/hooks` - Task-related hooks
- `/pages` - Task management pages

### Nodes (`/nodes`)

Contains type definitions for data models:
- `user-node.ts` - User data structure
- `task-node.ts` - Task data structure

### Store (`/store`)

Redux store implementation using Redux Toolkit:
- `index.ts` - Store configuration
- `userSlice.ts` - User state management
- `tasksSlice.ts` - Tasks state management
- `useStore.ts` - Custom hooks for accessing the store

## Data Flow

1. **User Interactions**: Handled by components in the design system
2. **Business Logic**: Processed in modules through services and hooks
3. **State Management**: Handled by Redux store using slices
4. **API Communication**: Managed through services using the core API client

## Authentication Flow

1. User enters credentials in login/register forms
2. Form submission is handled by form hooks (`use-login-form.ts`, `use-register-form.ts`)
3. Auth hook (`use-auth.ts`) dispatches actions to Redux
4. `userSlice.ts` processes actions and updates state
5. Success/error states are used for navigation and UI updates

## Design Principles

1. **Separation of Concerns**: Clear boundaries between UI, business logic, and data
2. **Component-Based Architecture**: UI built from composable components
3. **Feature-Based Modules**: Features encapsulated in self-contained modules
4. **Atomic Design**: UI components organized by complexity level
5. **Centralized State Management**: Redux for application-wide state
6. **Form Abstraction**: Form logic extracted to custom hooks