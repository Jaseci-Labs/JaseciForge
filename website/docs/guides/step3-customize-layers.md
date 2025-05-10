# Lesson 3: Customizing Module Layers

Now that we have bootstrapped all configurations and files for our new module, let's understand how to customize each layer and how data flows between them. We'll start with the service layer, then move to the data layer, and finally customize the presentation layer.

## 1. Service Layer Customization

The service layer (`services/index.ts`) is our first point of contact with external APIs. Here's what we'll customize:

- **API Client Selection**: Choose between `public_api` or `private_api` based on authentication requirements
- **Endpoint Configuration**: Set up the base path and individual endpoints
- **Data Transformation**: Add any necessary data transformations before sending to or receiving from the API
- **Error Handling**: Implement consistent error handling patterns
- **Type Safety**: Ensure all methods are properly typed with TypeScript

Data flows from the service layer to the data layer through Redux actions.

## 2. Data Layer Customization

The data layer consists of Redux actions and state management. Here's what we'll customize:

- **Action Creators**: Set up async thunks for CRUD operations
- **State Structure**: Define the shape of our Redux state
- **Error Handling**: Implement error states and messages
- **Loading States**: Add loading indicators for async operations
- **Success States**: Handle successful operations with appropriate feedback

Data flows in two directions:
- **Downward**: From actions to the service layer for API calls
- **Upward**: From the service layer back to the Redux store
- **Sideways**: To the presentation layer through selectors

## 3. Presentation Layer Customization

The presentation layer includes hooks and UI components. Here's what we'll customize:

- **Custom Hooks**: Create hooks that combine state and actions
- **Data Validation**: Implement form validation using Zod schemas
- **Loading States**: Handle loading indicators in the UI
- **Error Handling**: Display error messages to users
- **Success Feedback**: Show success messages for completed actions

Data flows in multiple directions:
- **Downward**: From hooks to components
- **Upward**: From components to actions through hooks
- **Sideways**: Between components through props

## Data Flow Overview

```
[Service Layer] ←→ [Data Layer] ←→ [Presentation Layer]
     ↑               ↑    ↑              ↑
     └───────────────┘    └──────────────┘
```

1. **User Action Flow**:
   - User interacts with UI
   - Hook receives the action
   - Action is dispatched to Redux
   - Service layer makes API call
   - Response flows back up through the layers

2. **Data Update Flow**:
   - API response received in service layer
   - Data transformed if needed
   - Redux state updated
   - UI automatically updates through selectors

3. **Error Flow**:
   - Error occurs in any layer
   - Error propagated up through layers
   - UI displays appropriate error message

## Next Steps

In the following guides, we'll implement each layer in detail:
1. [Service Layer Implementation](./step3b-service-layer.md)
2. [Data Layer Implementation](./step3c-data-layer.md)
3. [Presentation Layer Implementation](./step3f-ui-implementation.md)

Each guide will provide the actual code implementation and best practices for that specific layer.
