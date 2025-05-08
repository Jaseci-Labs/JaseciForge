# Utilities

Utilities (or helpers) are small, reusable functions that perform common tasks across your application. They help keep your code DRY and organized.

## Purpose
- Encapsulate common logic or calculations.
- Avoid code duplication.
- Improve readability and maintainability.

## Example
```js
// formatDate.js
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}
```

Utilities are typically placed in a `utils` or `helpers` directory. 