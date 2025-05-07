# Testing Setup

## Overview
Jaseci Forge includes a comprehensive testing setup with React Testing Library, Jest, and TypeScript support. The testing infrastructure is pre-configured to support unit testing, integration testing, and end-to-end testing.

## Features

### Testing Infrastructure
- React Testing Library configuration
- Jest setup with TypeScript support
- Pre-configured test utilities
- Example test cases
- Mock service worker setup
- Custom test renderers
- Test data factories

### Testing Types
- Unit tests
- Integration tests
- Component tests
- Hook tests
- API tests
- E2E tests (optional)

## Implementation

### 1. Test Setup
```typescript
// jest.setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 2. Custom Test Renderer
```typescript
// test-utils.tsx
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';

export function render(
  ui: React.ReactElement,
  {
    preloadedState = {},
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        {children}
      </Provider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}
```

### 3. Mock Service Worker
```typescript
// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
      ])
    );
  }),
];
```

## Usage

### 1. Component Testing
```typescript
// __tests__/components/TaskList.test.tsx
import { render, screen, fireEvent } from '@/test-utils';
import { TaskList } from '@/components/TaskList';

describe('TaskList', () => {
  it('renders tasks correctly', () => {
    const tasks = [
      { id: 1, title: 'Task 1' },
      { id: 2, title: 'Task 2' },
    ];

    render(<TaskList tasks={tasks} />);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('handles task completion', () => {
    const onComplete = jest.fn();
    render(<TaskList tasks={[{ id: 1, title: 'Task 1' }]} onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('checkbox'));
    expect(onComplete).toHaveBeenCalledWith(1);
  });
});
```

### 2. Hook Testing
```typescript
// __tests__/hooks/useTask.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useTask } from '@/hooks/useTask';

describe('useTask', () => {
  it('manages task state correctly', () => {
    const { result } = renderHook(() => useTask());

    act(() => {
      result.current.addTask({ title: 'New Task' });
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('New Task');
  });
});
```

### 3. API Testing
```typescript
// __tests__/api/taskApi.test.ts
import { rest } from 'msw';
import { server } from '@/mocks/server';
import { taskApi } from '@/api/taskApi';

describe('taskApi', () => {
  it('fetches tasks successfully', async () => {
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(
          ctx.json([
            { id: 1, title: 'Task 1' },
            { id: 2, title: 'Task 2' },
          ])
        );
      })
    );

    const tasks = await taskApi.getTasks();
    expect(tasks).toHaveLength(2);
  });
});
```

## Configuration

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
};
```

### Test Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage"
  }
}
```

## Best Practices

1. **Test Organization**
   - Group related tests
   - Use descriptive test names
   - Follow AAA pattern (Arrange, Act, Assert)
   - Keep tests focused and isolated

2. **Component Testing**
   - Test user interactions
   - Verify component rendering
   - Check accessibility
   - Test error states

3. **Hook Testing**
   - Test state changes
   - Verify side effects
   - Test error handling
   - Check cleanup

4. **API Testing**
   - Mock API responses
   - Test error cases
   - Verify data transformation
   - Check loading states

## Testing Utilities

### 1. Test Data Factories
```typescript
// test/factories/taskFactory.ts
export const createTask = (overrides = {}) => ({
  id: Math.random().toString(),
  title: 'Test Task',
  completed: false,
  ...overrides,
});
```

### 2. Custom Matchers
```typescript
// test/matchers/customMatchers.ts
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    return {
      message: () =>
        `expected ${received} to be within range ${floor} - ${ceiling}`,
      pass,
    };
  },
});
```

### 3. Mock Providers
```typescript
// test/providers/TestProviders.tsx
export const TestProviders = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <ThemeProvider>
      <Router>
        {children}
      </Router>
    </ThemeProvider>
  </Provider>
);
```

## Troubleshooting

### Common Issues

1. **Test Environment**
   - Check Jest configuration
   - Verify TypeScript setup
   - Check test utilities
   - Debug test environment

2. **Mocking**
   - Verify mock implementations
   - Check mock data
   - Debug mock responses
   - Test mock cleanup

3. **Async Testing**
   - Handle async operations
   - Use proper wait functions
   - Check timing issues
   - Debug race conditions

### Debugging Tips

1. Use Jest debugger:
   - Run tests in debug mode
   - Use console.log
   - Check test output
   - Review coverage reports

2. Check test setup:
   - Verify test utilities
   - Check mock implementations
   - Review test data
   - Debug test environment

3. Review test results:
   - Check test output
   - Review error messages
   - Check coverage reports
   - Debug failing tests 