# Templates

Templates are reusable layout or page structures in Jaseci Forge. They define the overall arrangement of UI components for specific types of pages, such as dashboards, forms, or detail views.

## Purpose
- Provide consistent layouts across similar pages.
- Reduce code duplication by reusing common structures.
- Separate layout logic from business logic and content.

## Example
```jsx
// DashboardTemplate.jsx
export function DashboardTemplate({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

Templates help maintain a unified user experience and speed up page development. 