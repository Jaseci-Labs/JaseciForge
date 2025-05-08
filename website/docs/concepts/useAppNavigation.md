# useAppNavigation

`useAppNavigation` is a custom React hook in Jaseci Forge that provides programmatic navigation within the application. It abstracts routing logic and offers a simple API for navigating between pages or modules.

## Purpose
- Simplify navigation logic in components.
- Provide a consistent way to handle redirects and route changes.

## Example
```jsx
import { useAppNavigation } from 'your-app/hooks';

function MyButton() {
  const navigate = useAppNavigation();
  return (
    <button onClick={() => navigate('/dashboard')}>
      Go to Dashboard
    </button>
  );
}
```

This hook helps keep navigation logic clean and reusable. 