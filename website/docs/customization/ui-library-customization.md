# UI Library Customization

You can use a different UI component library (such as Material UI, Chakra UI, or Ant Design) in place of the default design system in Jaseci Forge.

## How to Use a Different UI Library

### 1. Install the Library
Use your package manager to install the desired UI library:

```bash
npm install @mui/material @emotion/react @emotion/styled
# or
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

### 2. Configure the Provider
Wrap your app with the library's provider in your main entry file (e.g., `_app.js` or `app/layout.tsx`):

```jsx
// Example for Chakra UI
import { ChakraProvider } from '@chakra-ui/react';

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
```

### 3. Replace Components
Swap out default components with equivalents from your chosen library:

```jsx
// Replace
<Button>Click me</Button>
// With
<ChakraButton colorScheme="orange">Click me</ChakraButton>
```

## Tips
- Remove unused styles and components from the original design system.
- Follow the new library's documentation for advanced usage and theming.

Customizing the UI library lets you match your team's preferences and requirements. 