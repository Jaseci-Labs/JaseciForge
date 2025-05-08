# Organisms

Organisms are complex UI components composed of atoms and molecules. They represent distinct sections of an interface, such as navigation bars, cards, or forms, and can contain business logic and layout.

## Purpose
- Combine atoms and molecules into reusable, functional UI sections.
- Encapsulate more complex logic and structure.

## Example
```jsx
// Card organism example
export function Card({ title, content }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div>{content}</div>
    </div>
  );
}
```

Organisms help build consistent, higher-level UI patterns. 