# Storybook Setup

## Overview
Jaseci Forge includes a pre-configured Storybook setup for component development, documentation, and visual testing. The setup supports TypeScript, Tailwind CSS, and includes various addons for enhanced development experience.

## Features

### Storybook Configuration
- TypeScript support
- Tailwind CSS integration
- Component documentation
- Interactive component playground
- Visual regression testing
- Accessibility testing
- Responsive design testing

### Addons
- Controls
- Actions
- Viewport
- Accessibility
- Docs
- Backgrounds
- Responsive

## Implementation

### 1. Storybook Configuration
```javascript
// .storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
};
```

### 2. Tailwind Integration
```javascript
// .storybook/preview.js
import '../src/styles/globals.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
```

### 3. Component Documentation
```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};
```

## Usage

### 1. Creating Stories
```typescript
// TaskCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TaskCard } from './TaskCard';

const meta: Meta<typeof TaskCard> = {
  title: 'Organisms/TaskCard',
  component: TaskCard,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

export const Default: Story = {
  args: {
    task: {
      id: '1',
      title: 'Complete documentation',
      description: 'Write comprehensive documentation for the project',
      status: 'in-progress',
    },
  },
};

export const Completed: Story = {
  args: {
    task: {
      id: '2',
      title: 'Setup testing',
      description: 'Configure Jest and React Testing Library',
      status: 'completed',
    },
  },
};
```

### 2. Component Documentation
```typescript
// Button.tsx
import { Button as ShadcnButton } from '@/components/ui/button';

/**
 * Button component that follows the design system guidelines.
 * 
 * @component
 * @example
 * ```tsx
 * <Button variant="primary" size="md">
 *   Click me
 * </Button>
 * ```
 */
export const Button = ({ variant, size, children, ...props }) => {
  return (
    <ShadcnButton
      variant={variant}
      size={size}
      {...props}
    >
      {children}
    </ShadcnButton>
  );
};
```

### 3. Visual Testing
```typescript
// TaskList.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TaskList } from './TaskList';

const meta: Meta<typeof TaskList> = {
  title: 'Organisms/TaskList',
  component: TaskList,
  parameters: {
    chromatic: { delay: 1000 },
  },
};

export default meta;
type Story = StoryObj<typeof TaskList>;

export const Empty: Story = {
  args: {
    tasks: [],
  },
};

export const WithTasks: Story = {
  args: {
    tasks: [
      { id: '1', title: 'Task 1', status: 'pending' },
      { id: '2', title: 'Task 2', status: 'completed' },
    ],
  },
};
```

## Configuration

### 1. Storybook Scripts
```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "test-storybook": "test-storybook"
  }
}
```

### 2. Visual Regression Testing
```javascript
// .storybook/main.js
module.exports = {
  // ... other config
  features: {
    interactionsDebugger: true,
  },
  staticDirs: ['../public'],
};
```

## Best Practices

1. **Story Organization**
   - Group stories by component type
   - Use clear naming conventions
   - Include all component variants
   - Document component usage

2. **Component Documentation**
   - Write clear descriptions
   - Include usage examples
   - Document props and types
   - Add accessibility notes

3. **Visual Testing**
   - Test all component states
   - Include responsive views
   - Test dark/light themes
   - Verify accessibility

4. **Performance**
   - Optimize story loading
   - Use proper decorators
   - Implement proper controls
   - Handle async operations

## Addons Usage

### 1. Controls
```typescript
// Button.stories.tsx
export const WithControls: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};
```

### 2. Actions
```typescript
// TaskCard.stories.tsx
export const WithActions: Story = {
  args: {
    task: {
      id: '1',
      title: 'Task 1',
    },
    onComplete: action('onComplete'),
    onDelete: action('onDelete'),
  },
};
```

### 3. Viewport
```typescript
// TaskList.stories.tsx
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
```

## Troubleshooting

### Common Issues

1. **Build Issues**
   - Check webpack configuration
   - Verify TypeScript setup
   - Check addon compatibility
   - Debug build errors

2. **Visual Testing**
   - Check viewport settings
   - Verify theme setup
   - Debug visual diffs
   - Check responsive design

3. **Performance**
   - Optimize story loading
   - Check bundle size
   - Debug slow stories
   - Monitor memory usage

### Debugging Tips

1. Use Storybook tools:
   - Check Actions panel
   - Use Controls panel
   - View Docs tab
   - Check Accessibility

2. Check configuration:
   - Verify main.js
   - Check preview.js
   - Review addon setup
   - Debug theme config

3. Review stories:
   - Check story structure
   - Verify props
   - Test interactions
   - Check documentation 