const fs = require("fs-extra");
const path = require("path");

async function addModule(moduleName, options) {
  const targetDir = process.cwd();
  const moduleDir = path.join(targetDir, "modules", moduleName);
  const nodeName = options.node || moduleName;
  const appDir = path.join(targetDir, "app");
  const requiresAuth = options.auth !== "no"; // default to true if not explicitly set to 'no'
  const apiBase = options.apiBase || `/${nodeName.toLowerCase()}s`;

  // Parse API endpoints
  const defaultApis = ["getAll", "getById", "create", "update", "delete"];
  const customApis = options.apis
    ? options.apis.split(",").map((api) => api.trim())
    : defaultApis;

  // Parse node type definition
  const defaultType = {
    id: "string",
    name: "string",
    description: "string?",
    created_at: "string",
    updated_at: "string",
    status: "active|inactive",
  };

  let nodeType = defaultType;
  if (options.nodeType) {
    nodeType = options.nodeType.split(",").reduce((acc, field) => {
      const [name, type] = field.split(":").map((s) => s.trim());
      acc[name] = type;
      return acc;
    }, {});
  }

  // Generate TypeScript type definition
  const generateTypeDefinition = (type) => {
    return Object.entries(type)
      .map(([name, typeDef]) => {
        const isOptional = typeDef.endsWith("?");
        const cleanType = isOptional ? typeDef.slice(0, -1) : typeDef;

        // Handle union types
        if (cleanType.includes("|")) {
          const unionTypes = cleanType
            .split("|")
            .map((t) => `'${t.trim()}'`)
            .join(" | ");
          return `  ${name}${isOptional ? "?" : ""}: ${unionTypes};`;
        }

        // Handle basic types
        const tsType =
          cleanType === "string"
            ? "string"
            : cleanType === "number"
            ? "number"
            : cleanType === "boolean"
            ? "boolean"
            : cleanType === "date"
            ? "string"
            : "any";

        return `  ${name}${isOptional ? "?" : ""}: ${tsType};`;
      })
      .join("\n");
  };

  try {
    // Create module directory structure
    const dirs = ["actions", "hooks", "pages", "schemas", "services", "utils"];

    // Create module directory and subdirectories
    await fs.ensureDir(moduleDir);
    for (const dir of dirs) {
      await fs.ensureDir(path.join(moduleDir, dir));
    }

    // Create node definition with custom type
    const nodeContent = `export interface ${nodeName}Node {\n${generateTypeDefinition(
      nodeType
    )}\n}`;
    await fs.writeFile(
      path.join(targetDir, "nodes", `${nodeName.toLowerCase()}-node.ts`),
      nodeContent
    );

    // Generate Zod schema based on type definition
    const generateZodSchema = (type) => {
      return Object.entries(type)
        .map(([name, typeDef]) => {
          const isOptional = typeDef.endsWith("?");
          const cleanType = isOptional ? typeDef.slice(0, -1) : typeDef;

          // Handle union types
          if (cleanType.includes("|")) {
            const unionTypes = cleanType
              .split("|")
              .map((t) => `'${t.trim()}'`)
              .join(", ");
            return `  ${name}: z.enum([${unionTypes}])${
              isOptional ? ".optional()" : ""
            },`;
          }

          // Handle basic types
          const zodType =
            cleanType === "string"
              ? "z.string()"
              : cleanType === "number"
              ? "z.number()"
              : cleanType === "boolean"
              ? "z.boolean()"
              : cleanType === "date"
              ? "z.string()"
              : "z.any()";

          return `  ${name}: ${zodType}${isOptional ? ".optional()" : ""},`;
        })
        .join("\n");
    };

    // Generate service methods based on API endpoints
    const serviceMethods = customApis
      .map((api) => {
        const apiClient = requiresAuth ? "private_api" : "public_api";
        const basePath = apiBase.startsWith("/") ? apiBase : `/${apiBase}`;

        switch (api.toLowerCase()) {
          case "getall":
          case "list":
            return `  // Get all ${nodeName.toLowerCase()}s
  get${nodeName}s: async () => {
    const response = await ${apiClient}.get('${basePath}');
    return response.data;
  }`;
          case "getbyid":
          case "get":
            return `  // Get a specific ${nodeName.toLowerCase()}
  get${nodeName}: async (id: number) => {
    const response = await ${apiClient}.get(\`${basePath}/\${id}\`);
    return response.data;
  }`;
          case "create":
            return `  // Create a new ${nodeName.toLowerCase()}
  create${nodeName}: async (data: Omit<${nodeName}Node, 'id'>) => {
    const response = await ${apiClient}.post('${basePath}', data);
    return response.data;
  }`;
          case "update":
            return `  // Update an existing ${nodeName.toLowerCase()}
  update${nodeName}: async (id: number, data: Partial<${nodeName}Node>) => {
    const response = await ${apiClient}.put(\`${basePath}/\${id}\`, data);
    return response.data;
  }`;
          case "delete":
            return `  // Delete a ${nodeName.toLowerCase()}
  delete${nodeName}: async (id: number) => {
    const response = await ${apiClient}.delete(\`${basePath}/\${id}\`);
    return response.data;
  }`;
          default:
            return `  // Custom ${api} operation
  ${api}: async (data?: any) => {
    const response = await ${apiClient}.post(\`${basePath}\${data ? \`/\${data}\` : ''}\`);
    return response.data;
  }`;
        }
      })
      .join(",\n\n");

    // Create module files
    const files = {
      "index.ts": `export * from './actions';\nexport * from './hooks';\nexport * from './services';\n`,

      "actions/index.ts": `import { createAsyncThunk } from '@reduxjs/toolkit';\nimport { ${nodeName}Api } from '../services';\nimport { ${nodeName}Node } from '@/nodes/${nodeName.toLowerCase()}-node';\n\n// Example action\nexport const fetch${nodeName}s = createAsyncThunk(\n  '${nodeName.toLowerCase()}/fetchAll',\n  async (_, { rejectWithValue }) => {\n    try {\n      const response = await ${nodeName}Api.get${nodeName}s();\n      return response;\n    } catch (error) {\n      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch ${nodeName}s');\n    }\n  }\n);\n`,

      "hooks/index.ts": `import { useAppDispatch, useAppSelector } from '@/store/useStore';\nimport { fetch${nodeName}s } from '../actions';\nimport { ${nodeName}Node } from '@/nodes/${nodeName.toLowerCase()}-node';\n\nexport const use${nodeName}s = () => {\n  const dispatch = useAppDispatch();\n  const { items, isLoading, error } = useAppSelector(state => state.${nodeName.toLowerCase()});\n\n  const refresh = () => {\n    dispatch(fetch${nodeName}s());\n  };\n\n  return { items, isLoading, error, refresh };\n};\n`,

      "services/index.ts": `import { ${nodeName}Node } from '@/nodes/${nodeName.toLowerCase()}-node';\nimport { ${
        requiresAuth ? "private" : "public"
      }_api } from '@/_core/api-client';\n\nexport const ${nodeName}Api = {\n${serviceMethods}\n};\n`,

      "schemas/index.ts": `import { z } from 'zod';\n\nexport const ${nodeName}Schema = z.object({\n${generateZodSchema(
        nodeType
      )}\n});\n\nexport type ${nodeName} = z.infer<typeof ${nodeName}Schema>;\n`,

      "utils/index.ts": `import { ${nodeName}Node } from '@/nodes/${nodeName.toLowerCase()}-node';\n\nexport const format${nodeName} = (item: ${nodeName}Node) => ({\n  ...item,\n  created_at: new Date(item.created_at).toLocaleDateString(),\n  updated_at: new Date(item.updated_at).toLocaleDateString(),\n});\n`,
    };

    for (const [filename, content] of Object.entries(files)) {
      await fs.writeFile(path.join(moduleDir, filename), content);
    }

    // Create Redux slice
    const sliceContent = `import { createSlice, type PayloadAction } from '@reduxjs/toolkit';\nimport { ${nodeName}Node } from '@/nodes/${nodeName.toLowerCase()}-node';\nimport { fetch${nodeName}s } from '../modules/${moduleName}/actions';\n\ninterface ${nodeName}State {\n  items: ${nodeName}Node[];\n  isLoading: boolean;\n  error: string | null;\n  success: boolean;\n  successMessage: string | null;\n}\n\nconst initialState: ${nodeName}State = {\n  items: [],\n  isLoading: false,\n  error: null,\n  success: false,\n  successMessage: null,\n};\n\nexport const ${nodeName.toLowerCase()}Slice = createSlice({\n  name: '${nodeName.toLowerCase()}',\n  initialState,\n  reducers: {\n    setItems: (state, action: PayloadAction<${nodeName}Node[]>) => {\n      state.items = action.payload;\n    },\n    setLoading: (state, action: PayloadAction<boolean>) => {\n      state.isLoading = action.payload;\n    },\n    setError: (state, action: PayloadAction<string | null>) => {\n      state.error = action.payload;\n      state.success = false;\n    },\n    resetSuccess: (state) => {\n      state.success = false;\n      state.successMessage = null;\n    },\n  },\n  extraReducers: (builder) => {\n    builder.addCase(fetch${nodeName}s.pending, (state) => {\n      state.isLoading = true;\n      state.error = null;\n      state.success = false;\n      state.successMessage = null;\n    });\n    builder.addCase(fetch${nodeName}s.fulfilled, (state, action) => {\n      state.isLoading = false;\n      state.items = action.payload;\n      state.success = true;\n      state.successMessage = '${nodeName}s fetched successfully';\n    });\n    builder.addCase(fetch${nodeName}s.rejected, (state, action) => {\n      state.isLoading = false;\n      state.error = action.payload as string;\n      state.success = false;\n    });\n  },\n});\n\nexport const { setItems, setLoading, setError, resetSuccess } = ${nodeName.toLowerCase()}Slice.actions;\nexport default ${nodeName.toLowerCase()}Slice.reducer;\n`;

    await fs.writeFile(
      path.join(targetDir, "store", `${nodeName.toLowerCase()}Slice.ts`),
      sliceContent
    );

    // Update store configuration
    const storePath = path.join(targetDir, "store", "index.ts");
    if (fs.existsSync(storePath)) {
      let storeContent = await fs.readFile(storePath, "utf8");

      // Add import
      const importStatement = `import ${nodeName.toLowerCase()}Reducer from './${nodeName.toLowerCase()}Slice';\n`;
      storeContent = importStatement + storeContent;

      // Add reducer to store configuration
      storeContent = storeContent.replace(
        /reducer: {([^}]*)}/,
        `reducer: {$1\n    ${nodeName.toLowerCase()}: ${nodeName.toLowerCase()}Reducer}`
      );

      await fs.writeFile(storePath, storeContent);
    }

    // Create a basic page component
    const pageContent = `"use client";

import { ${
      requiresAuth ? "ProtectedRoute" : ""
    } } from "@/ds/wrappers/prtoected-auth";
import { Card } from '@/ds/atoms/card';
import { Button } from '@/ds/atoms/button';
import { use${nodeName}s } from '../hooks';

/**
 * ⚠️ WARNING: This is a basic template page.
 * 
 * You should replace these basic components with proper templates and design system components:
 * - Replace the basic div structure with a proper Template (e.g., DashboardTemplate)
 * - Replace Card with proper Organisms (e.g., ${nodeName}Card, ${nodeName}List)
 * - Replace Button with proper Molecules (e.g., ActionButton, RefreshButton)
 * - Add proper loading and error states using design system components
 * 
 * Example structure:
 * <DashboardTemplate
 *       header={<TaskHeader />}
 *       sidebar={<TaskSidebar stats={stats} />}
 *     >
 *       <TaskList
 *        tasks={tasks}
 *         onAddTask={actions.addTask}
 *         onUpdateTask={actions.updateTask}
 *         onDeleteTask={actions.deleteTask}
 *         onToggleComplete={actions.toggleComplete}
 *       />
      </DashboardTemplate>
 */

export default function ${nodeName}Page() {
  const { items, isLoading, error, refresh } = use${nodeName}s();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return ${
    requiresAuth
      ? `<ProtectedRoute>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">${nodeName}s</h1>
            <Button onClick={refresh}>Refresh</Button>
          </div>
          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item.id}>
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-gray-600">{item.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Status: {item.status}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </ProtectedRoute>`
      : `<>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">${nodeName}s</h1>
            <Button onClick={refresh}>Refresh</Button>
          </div>
          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item.id}>
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-gray-600">{item.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Status: {item.status}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </>`
  };
}`;
    await fs.writeFile(
      path.join(moduleDir, "pages", `${nodeName}Page.tsx`),
      pageContent
    );

    // Create route in app directory
    const routePath = options.path || moduleName.toLowerCase();
    const routeDir = path.join(appDir, routePath);
    await fs.ensureDir(routeDir);

    // Create page.tsx for the route
    const routePageContent = `import ${nodeName}Page  from '@/modules/${moduleName}/pages/${nodeName}Page';\n\nexport default function Page() {\n  return <${nodeName}Page />;\n}\n`;
    await fs.writeFile(path.join(routeDir, "page.tsx"), routePageContent);

    // Create layout.tsx for the route
    const routeLayoutContent = `import type { Metadata } from 'next';\n\nexport const metadata: Metadata = {\n  title: '${nodeName}s | Task Manager',\n  description: 'Manage your ${nodeName.toLowerCase()}s',\n};\n\nexport default function ${nodeName}Layout({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  return <>{children}</>;\n}\n`;
    await fs.writeFile(path.join(routeDir, "layout.tsx"), routeLayoutContent);

    console.log(`\n🎉 Module ${moduleName} created successfully! 🎉\n`);
    console.log("Next steps:");
    console.log("\n1. Modify the node type definition:");
    console.log(`   📁 nodes/${nodeName.toLowerCase()}-node.ts`);
    console.log("   - Add or modify fields in the interface");
    console.log("   - Update type definitions as needed");

    console.log("\n2. Verify and customize the API service:");
    console.log(`   📁 modules/${moduleName}/services/index.ts`);
    console.log("   - Check generated API methods");
    console.log("   - Add custom API endpoints if needed");

    console.log("\n3. Review and enhance the Redux actions:");
    console.log(`   📁 modules/${moduleName}/actions/index.ts`);
    console.log("   - Add more async thunks for specific operations");
    console.log("   - Implement error handling and loading states");

    console.log("\n4. Check the Redux slice:");
    console.log(`   📁 store/${nodeName.toLowerCase()}Slice.ts`);
    console.log("   - Verify state structure");
    console.log("   - Add more reducers if needed");

    console.log("\n5. Customize the React hooks:");
    console.log(`   📁 modules/${moduleName}/hooks/index.ts`);
    console.log("   - Add custom hooks for specific operations");
    console.log("   - Implement data transformation if needed");

    console.log("\n6. Integrate with your page:");
    console.log(`   📁 modules/${moduleName}/pages/${nodeName}Page.tsx`);
    console.log("   - Import and use the custom hooks");
    console.log("   - Add UI components to display and manage data");
    console.log("   - Implement error handling and loading states");

    console.log("\n7. Create UI Components:");
    console.log("   Create the following component structure:");
    console.log(`   📁 modules/${moduleName}/components/`);
    console.log("   ├── templates/");
    console.log(`   │   └── ${nodeName}Template.tsx`);
    console.log("   ├── organisms/");
    console.log(`   │   ├── ${nodeName}List.tsx`);
    console.log(`   │   ├── ${nodeName}Card.tsx`);
    console.log(`   │   └── ${nodeName}Form.tsx`);
    console.log("   └── molecules/");
    console.log(`       ├── ${nodeName}Item.tsx`);
    console.log(`       ├── ${nodeName}Actions.tsx`);
    console.log(`       └── ${nodeName}Status.tsx`);

    console.log("\n8. Update Router Configuration:");
    console.log(`   📁 app/${routePath}/`);
    console.log("   ├── page.tsx");
    console.log("   └── layout.tsx");
    console.log("\n   Update metadata in layout.tsx:");
    console.log("   - Set page title and description");
    console.log("   - Add any required meta tags");
    console.log("   - Configure layout options");

    console.log("\nExample usage in your page:");
    console.log(
      `import { ${nodeName}Template } from '../components/templates/${nodeName}Template';`
    );
    console.log(
      `import { ${nodeName}List } from '../components/organisms/${nodeName}List';`
    );
    console.log(`import { use${nodeName}s } from '../hooks';`);
    console.log(`\nfunction ${nodeName}Page() {`);
    console.log(
      `  const { items, isLoading, error, refresh } = use${nodeName}s();`
    );
    console.log(`  return (`);
    console.log(`    <${nodeName}Template>`);
    console.log(`      <${nodeName}List items={items} />`);
    console.log(`    </${nodeName}Template>`);
    console.log(`  );`);
    console.log(`}`);
  } catch (error) {
    console.error("Failed to create module:", error.message);
    process.exit(1);
  }
}

module.exports = addModule;
