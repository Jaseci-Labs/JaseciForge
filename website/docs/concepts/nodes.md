# Nodes

Nodes are data models or entities in Jaseci Forge that represent core business objects, such as users, tasks, or projects. They define the structure and relationships of data used throughout the application.

## Purpose
- Provide a clear schema for application data.
- Enable type safety and validation.
- Facilitate data manipulation and state management.

## Example
```ts
// Task node example (TypeScript)
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}
```

Nodes help keep data consistent and well-structured across the app. 