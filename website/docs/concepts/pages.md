# Pages

Pages are top-level components that represent full screens or routes in the application. They are composed of templates, organisms, molecules, and atoms, and define the structure and content for a specific URL or view.

## Purpose
- Represent complete screens or routes.
- Assemble templates and UI components to deliver a full user experience.

## Example
```jsx
// DashboardPage.jsx
export default function DashboardPage() {
  return (
    <DashboardTemplate>
      <DashboardHeader />
      <StatsCards />
      <RecentActivity />
    </DashboardTemplate>
  );
}
```

Pages are the entry point for navigation and routing in the app. 