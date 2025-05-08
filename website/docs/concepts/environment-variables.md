# Environment Variables

Environment variables are key-value pairs used to configure your application without hardcoding sensitive or environment-specific data. They are typically defined in `.env` files or through deployment settings.

## Purpose
- Store secrets, API keys, and configuration values securely.
- Support different settings for development, staging, and production.
- Keep sensitive data out of source code.

## Example
```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_AUTH_ENABLED=true
```

Access environment variables in your code using `process.env` (Node.js) or framework-specific methods. 