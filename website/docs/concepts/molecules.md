# Molecules

Molecules are UI components composed of two or more atoms (or other molecules) that work together as a functional unit. They represent slightly more complex building blocks, such as input groups, form fields with labels, or a button with an icon.

## Purpose
- Combine atoms to create reusable, meaningful UI patterns.
- Encapsulate simple logic and layout.

## Example
```jsx
// InputWithLabel molecule example
export function InputWithLabel({ label, ...props }) {
  return (
    <label>
      {label}
      <input {...props} />
    </label>
  );
}
```

Molecules should remain simple and focused, but can contain basic logic or layout. 