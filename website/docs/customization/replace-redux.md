# Replace Redux

You can replace Redux with another state management solution such as React Context API or Zustand in your Jaseci Forge project.

## 1. Using React Context API

- Create a context and provider for your state:

```jsx
import { createContext, useContext, useState } from 'react';
const CounterContext = createContext();
export function CounterProvider({ children }) {
  const [count, setCount] = useState(0);
  return (
    <CounterContext.Provider value={{ count, setCount }}>
      {children}
    </CounterContext.Provider>
  );
}
export function useCounter() {
  return useContext(CounterContext);
}
```

- Wrap your app with the provider and use the hook in components.

## 2. Using Zustand

- Install Zustand:

```bash
npm install zustand
```

- Create a store:

```js
import create from 'zustand';
export const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

- Use the store in your components:

```jsx
const count = useCounterStore((state) => state.count);
const increment = useCounterStore((state) => state.increment);
```

Choose the solution that best fits your app's complexity and needs. 