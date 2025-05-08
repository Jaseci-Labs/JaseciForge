# Routing

Routing determines how users navigate between different pages or views in your application. Jaseci Forge uses frameworks like Next.js or React Router to handle routing.

## Purpose
- Enable navigation between screens or modules.
- Map URLs to components or pages.
- Support deep linking and browser navigation.

## Example (Next.js)
```js
// pages/dashboard.jsx
export default function Dashboard() {
  return <div>Dashboard Page</div>;
}
// Navigating programmatically
import { useRouter } from 'next/router';
function GoHomeButton() {
  const router = useRouter();
  return <button onClick={() => router.push('/')}>Go Home</button>;
}
```

Routing is essential for building multi-page applications. 