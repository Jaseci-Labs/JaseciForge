# Step 1: Installation and Setup

Let's build a Task Manager application using Jaseci Forge. We'll use JSONPlaceholder API for our data.

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

1. Rename `.env.example` to `.env.local` on the root:
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com

# Other environment variables
```

The application uses JSONPlaceholder API for our task management:
- Base URL: `https://jsonplaceholder.typicode.com`
- Endpoints:
  - GET `/todos` - List all tasks
  - GET `/todos/:id` - Get a specific task
  - POST `/todos` - Create a new task
  - PUT `/todos/:id` - Update a task
  - DELETE `/todos/:id` - Delete a task

Note: JSONPlaceholder is a fake REST API for testing and prototyping. It doesn't actually persist data, but it's perfect for our guide.

## Verify Installation

1. Visit [http://localhost:3000](http://localhost:3000)
2. You should see the default landing page
3. Check the console for any errors
4. Test the API connection:
```typescript
// You can test the API in your browser console
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(json => console.log(json))
```

## Next Steps

In the next step, we'll:
1. Create our tasks module
2. Set up the node definition
3. Configure the API service

[Continue to Step 2: Module Creation →](./step2-module-creation.md) 