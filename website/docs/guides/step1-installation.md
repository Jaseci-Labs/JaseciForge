# Step 1: Installation and Setup

Let's build a Task Manager application using Jaseci Forge. We'll use the Jaseci API for our data.

## Installation

1. Create a new project:
```bash
npx create-jaseci-app task-manager
cd task-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Your application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

After installation, you'll have this structure:
```
task-manager/
├── app/              # Next.js app directory
├── modules/          # Feature modules
├── ds/              # Design system components
├── nodes/           # Node definitions
├── store/           # Redux store
└── _core/           # Core utilities and API clients
```

## Environment Setup

1. Create `.env.local`:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

The application uses two API clients:
- `public_api`: For public endpoints (authentication, registration)
- `private_api`: For protected endpoints (requires authentication)

## Verify Installation

1. Visit [http://localhost:3000](http://localhost:3000)
2. You should see the default landing page
3. Check the console for any errors

## Next Steps

In the next step, we'll:
1. Create our tasks module
2. Set up the node definition
3. Configure the API service

[Continue to Step 2: Module Creation →](./step2-module-creation.md) 