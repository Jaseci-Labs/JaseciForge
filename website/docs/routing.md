# Routing Guide

Jaseci Forge uses Next.js App Router for routing and provides a custom navigation hook for enhanced routing capabilities.

## Next.js App Router

The App Router uses file-system based routing. Your files inside the `app` directory automatically become routes:

```
app/
├── page.tsx              # Home page (/)
├── about/
│   └── page.tsx         # About page (/about)
├── dashboard/
│   ├── page.tsx         # Dashboard page (/dashboard)
│   └── settings/
│       └── page.tsx     # Settings page (/dashboard/settings)
└── (auth)/
    ├── login/
    │   └── page.tsx     # Login page (/login)
    └── register/
        └── page.tsx     # Register page (/register)
```

### Route Groups
Route groups (folders wrapped in parentheses) help organize routes without affecting the URL structure:

```
app/
├── (marketing)/
│   ├── about/
│   └── contact/
└── (dashboard)/
    ├── products/
    └── orders/
```

## Navigation Hook

We provide a custom `useAppNavigation` hook for enhanced navigation capabilities:

```typescript
import { useAppNavigation } from '@/hooks/useAppNavigation';

function MyComponent() {
  const {
    navigate,
    goBack,
    goForward,
    replace,
    prefetch,
    refresh,
    getCurrentPath,
    getQueryParams,
    isActive,
    pushWithScroll
  } = useAppNavigation();

  // Basic navigation
  const handleClick = () => {
    navigate('/dashboard');
  };

  // Navigation with query parameters
  const handleSearch = (query: string) => {
    navigate('/search', { q: query, page: 1 });
  };

  // Replace current route
  const handleLogin = () => {
    replace('/dashboard');
  };

  // Check active route
  const isDashboardActive = isActive('/dashboard');

  return (
    <div>
      <button onClick={handleClick}>Go to Dashboard</button>
      <button onClick={goBack}>Go Back</button>
      {isDashboardActive && <span>Dashboard is active</span>}
    </div>
  );
}
```

### Hook Features

1. **Basic Navigation**
```typescript
// Navigate to a route
navigate('/dashboard');

// Navigate with query parameters
navigate('/products', { category: 'electronics', sort: 'price' });

// Replace current route
replace('/dashboard');

// Go back/forward
goBack();
goForward();
```

2. **Query Parameters**
```typescript
// Get current query parameters
const params = getQueryParams();
console.log(params.category); // 'electronics'

// Navigate with query parameters
navigate('/products', { 
  category: 'electronics',
  sort: 'price',
  page: 1
});
```

3. **Route Prefetching**
```typescript
// Prefetch a route for faster navigation
prefetch('/dashboard');
```

4. **Scroll Control**
```typescript
// Navigate with scroll control
pushWithScroll('/products', { category: 'electronics' }, false);
```

5. **Route Status**
```typescript
// Check if route is active
const isActive = isActive('/dashboard');

// Check exact match
const isExactMatch = isActive('/dashboard', true);
```

## Best Practices

1. **Route Organization**
   - Use route groups for logical organization
   - Keep related routes together
   - Use descriptive folder names

2. **Navigation**
   - Use `useAppNavigation` hook for all navigation
   - Prefetch important routes
   - Handle loading states during navigation

3. **Query Parameters**
   - Use consistent parameter names
   - Validate parameters before use
   - Handle parameter changes in components

4. **Route Protection**
   - Use middleware for route protection
   - Handle authentication state
   - Redirect unauthorized access

## Example: Protected Dashboard Route

```typescript
// app/dashboard/layout.tsx
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { navigate, isActive } = useAppNavigation();
  const isAuthenticated = useAuth(); // Your auth hook

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { redirect: '/dashboard' });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <nav>
        <Link href="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
          Dashboard
        </Link>
        <Link href="/dashboard/settings" className={isActive('/dashboard/settings') ? 'active' : ''}>
          Settings
        </Link>
      </nav>
      {children}
    </div>
  );
}
```

<!-- ## Next Steps -->

<!-- 1. Learn about [Dynamic Routes](../concepts/dynamic-routes)
2. Explore [Route Handlers](../concepts/route-handlers)
3. Check out [Middleware](../concepts/middleware)
4. Review [Layouts and Templates](../concepts/layouts) -->
