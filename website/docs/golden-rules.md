# Golden Rules & Best Practices

## Core Layer Abstraction

Always expose third-party libraries through `_core` with our own interfaces. Never use third-party libraries directly in modules or components.

### Examples:
```typescript
// ✅ DO: Use core abstractions
import { useAppNavigation } from '@/core/hooks/useAppNavigation';
import { apiClient } from '@/core/api-client';
import { config } from '@/core/app-configs';

// ❌ DON'T: Use third-party libraries directly
import { useRouter } from 'next/router';
import axios from 'axios';
import { config } from 'some-config-library';
```

## Interface Consistency

- Maintain consistent interfaces across the application
- Use TypeScript interfaces for all core abstractions
- Document interface changes in core layer

## Dependency Management

- All external dependencies should be managed through core layer
- Keep third-party implementation details isolated
- Make it easy to swap implementations if needed
