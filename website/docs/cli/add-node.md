# Add Node

The `add-node` command allows you to add a new node to an existing module in your JaseciStack project. This command creates all necessary files for the node, including type definitions, API services, Redux actions, custom hooks, and Redux slices.

## Usage

```bash
npx create-jaseci-app add-node <module_name> <node_name> [options]
```

## Arguments

- `module_name`: The name of the existing module where you want to add the node
- `node_name`: The name of the node you want to create

## Options

- `--node-type <type_definition>`: Define the node's type structure (e.g., "id:string,name:string,price:number,status:active|inactive")
- `--apis <endpoints>`: Specify which API endpoints to generate (e.g., "getAll,create,update,delete")
- `--auth <yes|no>`: Whether to use authentication for API calls (default: yes)
- `--api-base <base_path>`: Base path for API endpoints (e.g., "/todos" for JSONPlaceholder)

## Examples

### Basic Usage
```bash
node ../index.js add-node projectanagement Comment
```
This will create a Comment node in the projectanagement module with default settings.

### Custom Node Type
```bash
node ../index.js add-node projectanagement Comment --node-type="id:string,content:string,author_id:number,created_at:string"
```
This creates a Comment node with custom fields and types.

### Custom API Endpoints
```bash
node ../index.js add-node projectanagement Comment --apis="getAll,create,update,delete"
```
This creates a Comment node with specific API endpoints.

### Custom API Base Path
```bash
node ../index.js add-node projectanagement Comment --api-base="walker"
```
This sets the API base path to "/walker" for all endpoints.

## Generated Files

The command creates the following files:

1. **Node Type Definition**
   - Location: `modules/<module_name>/nodes/<node_name>-node.ts`
   - Contains: TypeScript interface for the node

2. **API Service**
   - Location: `modules/<module_name>/services/<node_name>-api.ts`
   - Contains: API client methods for the node

3. **Redux Actions**
   - Location: `modules/<module_name>/actions/<node_name>-actions.ts`
   - Contains: Redux async thunks for the node

4. **Custom Hooks**
   - Location: `modules/<module_name>/hooks/<node_name>-hooks.ts`
   - Contains: React hooks for using the node's state

5. **Redux Slice**
   - Location: `store/<node_name>Slice.ts`
   - Contains: Redux slice for the node's state management

## State Management

The node's state is managed through Redux and is accessible at the root level of the store. For example, if you create a Comment node, you can access its state using:

```typescript
const { items, isLoading, error } = useAppSelector(state => state.comments);
```

## Next Steps

After creating a node:

1. Customize the node's type definition in the generated node file
2. Implement specific functionality in the created files
3. Add more actions and reducers as needed in the slice
4. Create UI components to interact with the node

## Error Handling

The command will fail if:
- The specified module doesn't exist
- There are permission issues when creating files
- The node type definition is invalid
- The API endpoints are invalid

## Related Commands

- [add-module](./add-module.md): Create a new module
- [create-app](./create-app.md): Create a new JaseciStack project 