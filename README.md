# JaseciForge

A CLI tool for generating JaseciStack Front-End templates and modules.

## Installation

```bash
npm install -g jaseci-forge
```

## Usage

### Create a New Application

```bash
jaseci-forge my-app
```

This will create a new Next.js application with:
- TypeScript support
- Atomic Design structure
- Redux Toolkit for state management
- ShadCN UI components
- Tailwind CSS for styling
- Optional Storybook integration
- Optional React Testing Library setup

### Add a New Module

```bash
jaseci-forge add-module users --node User --path dashboard/users --apis list,get,create,update,delete --node-type "id:string,name:string,email:string,role:admin|user" --auth yes
```

Options:
- `--node`: Name of the node (defaults to module name)
- `--path`: Custom route path
- `--apis`: Comma-separated list of API endpoints
- `--node-type`: Custom node type definition
- `--auth`: Whether to use authentication (default: yes)
- `--api-base`: Base path for API endpoints

## Features

- **Application Generation**
  - Next.js with TypeScript
  - Atomic Design structure
  - Redux Toolkit integration
  - ShadCN UI components
  - Tailwind CSS styling
  - Optional Storybook setup
  - Optional testing setup

- **Module Generation**
  - TypeScript interfaces
  - Redux slice with actions
  - API service layer
  - React hooks
  - Zod schemas
  - Basic page template
  - Route configuration

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Link the package:
   ```bash
   npm link
   ```
4. Run the CLI:
   ```bash
   jaseci-forge
   ```

## License

MIT