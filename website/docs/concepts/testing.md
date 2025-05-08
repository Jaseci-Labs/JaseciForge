# Testing

Testing ensures your code works as expected and helps prevent bugs. Jaseci Forge supports unit, integration, and end-to-end (E2E) testing using tools like Jest and React Testing Library.

## Purpose
- Catch bugs early and improve code quality.
- Enable safe refactoring and confident releases.
- Document expected behavior.

## Example (React Testing Library)
```js
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

Testing is essential for building reliable, maintainable applications. 