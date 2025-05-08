# Stories

Stories are isolated component examples used in Storybook to showcase and test UI components in different states and configurations. They help document the design system and improve component development.

## Purpose
- Provide visual documentation for each component.
- Enable interactive testing and development.
- Facilitate design review and QA.

## Example
```jsx
// Button.stories.jsx
import { Button } from './Button';

export default {
  title: 'Atoms/Button',
  component: Button,
};

export const Primary = () => <Button>Primary</Button>;
export const Disabled = () => <Button disabled>Disabled</Button>;
```

Stories make it easy to explore and validate UI components in isolation. 