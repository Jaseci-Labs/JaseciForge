# Replace Axios-Based Service Layer

You can replace the default Axios-based service layer in Jaseci Forge with another data fetching solution, such as the Fetch API, React Query, or SWR.

## 1. Using Fetch API

Replace Axios calls with the native Fetch API:

```js
// services/api.js
export async function getData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Network error');
  return response.json();
}
```

## 2. Using React Query

- Install React Query:

```bash
npm install @tanstack/react-query
```

- Use the `useQuery` hook:

```js
import { useQuery } from '@tanstack/react-query';
function MyComponent() {
  const { data, error, isLoading } = useQuery(['data'], () => fetch('/api/data').then(res => res.json()));
  // ...
}
```

## 3. Using SWR

- Install SWR:

```bash
npm install swr
```

- Use the `useSWR` hook:

```js
import useSWR from 'swr';
const fetcher = (url) => fetch(url).then(res => res.json());
function MyComponent() {
  const { data, error } = useSWR('/api/data', fetcher);
  // ...
}
```

Choose the approach that best fits your app's needs and complexity. 