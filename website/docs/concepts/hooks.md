# Hooks

Hooks are reusable functions in React that let you use state, side effects, and other features in functional components. Custom hooks encapsulate logic that can be shared across multiple components.

## Purpose
- Reuse logic across components.
- Keep components clean and focused.
- Abstract away complex or repetitive code.

## Example
```jsx
// useToggle.js
import { useState } from 'react';
export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  return [value, toggle];
}
```

Hooks help keep your code DRY and maintainable. 