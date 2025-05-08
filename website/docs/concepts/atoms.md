# Atoms

Atoms are the smallest building blocks in the Jaseci Forge design system. They represent fundamental UI elements that cannot be broken down further without losing their meaning. Examples include buttons, input fields, labels, icons, and other basic HTML elements.

## Purpose
- Provide reusable, consistent, and isolated UI primitives.
- Serve as the foundation for building more complex components (molecules and organisms).

## Example
```jsx
// Button atom example
export function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}
```

Atoms should be simple, focused, and styleable via the design system. 