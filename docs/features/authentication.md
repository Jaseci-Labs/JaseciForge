# Authentication & Authorization

## Overview
Jaseci Forge includes a complete authentication and authorization system built on top of Next.js and JWT. The system provides secure user authentication, role-based access control, and protected routes.

## Features

### Authentication
- JWT-based authentication
- Secure token storage
- Automatic token refresh
- Session management
- Login/Logout functionality
- Password reset flow
- Email verification

### Authorization
- Role-based access control (RBAC)
- Protected routes
- API endpoint protection
- Permission management
- User roles and permissions

## Implementation

### 1. Authentication Service
```typescript
// _core/auth/authService.ts
export class AuthService {
  static async login(email: string, password: string): Promise<User> {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return user;
  }

  static async logout(): Promise<void> {
    localStorage.removeItem('token');
    await apiClient.post('/auth/logout');
  }

  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
}
```

### 2. Protected Routes
```typescript
// _core/auth/ProtectedRoute.tsx
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
```

### 3. Role-Based Access
```typescript
// _core/auth/usePermissions.ts
export const usePermissions = () => {
  const { user } = useAuth();
  
  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) ?? false;
  };

  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) ?? false;
  };

  return { hasPermission, hasRole };
};
```

## Usage

### 1. Protecting Routes
```typescript
// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
```

### 2. Role-Based Components
```typescript
// components/AdminPanel.tsx
export const AdminPanel = () => {
  const { hasRole } = usePermissions();

  if (!hasRole('admin')) {
    return null;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      {/* Admin content */}
    </div>
  );
};
```

### 3. API Protection
```typescript
// _core/api-client.ts
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_AUTH_PROVIDER=local
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token
NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY=refresh_token
```

### Auth Provider Configuration
```typescript
// _core/auth/config.ts
export const authConfig = {
  tokenKey: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY,
  refreshTokenKey: process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY,
  tokenExpiry: 3600, // 1 hour
  refreshTokenExpiry: 604800, // 7 days
};
```

## Best Practices

1. **Token Management**
   - Store tokens securely
   - Implement token refresh
   - Handle token expiration
   - Clear tokens on logout

2. **Route Protection**
   - Protect sensitive routes
   - Implement role-based access
   - Handle loading states
   - Provide fallback UI

3. **Error Handling**
   - Handle authentication errors
   - Implement retry logic
   - Show user-friendly messages
   - Log security events

4. **Security**
   - Use HTTPS
   - Implement CSRF protection
   - Sanitize user input
   - Follow OWASP guidelines

## Testing

### 1. Authentication Tests
```typescript
// __tests__/auth.test.tsx
describe('Authentication', () => {
  it('should login successfully', async () => {
    const { getByLabelText, getByRole } = render(<LoginPage />);
    
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });
});
```

### 2. Authorization Tests
```typescript
// __tests__/authorization.test.tsx
describe('Authorization', () => {
  it('should show admin panel for admin users', () => {
    const { getByText } = render(
      <AuthProvider user={{ roles: ['admin'] }}>
        <AdminPanel />
      </AuthProvider>
    );
    
    expect(getByText('Admin Panel')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Common Issues

1. **Token Expiration**
   - Check token expiry time
   - Implement refresh token logic
   - Handle token refresh errors

2. **Route Protection**
   - Verify route configuration
   - Check role permissions
   - Debug authentication state

3. **API Integration**
   - Verify API endpoints
   - Check request headers
   - Debug network requests

### Debugging Tips

1. Use browser dev tools to inspect:
   - Network requests
   - Local storage
   - Console errors

2. Check authentication state:
   - Token presence
   - User data
   - Role permissions

3. Verify API responses:
   - Status codes
   - Error messages
   - Response data 