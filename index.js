#!/usr/bin/env node
const { program } = require('commander');
const { confirm, select } = require('@inquirer/prompts');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

// Promisify exec to use async/await
const execPromise = util.promisify(exec);

program
  .version('0.1.0')
  .arguments('<app_name>')
  .description('Generate a JaseciStack Front-End template')
  .action(async (appName) => {
    const targetDir = path.join(process.cwd(), appName);
    const templateDir = path.join(
      __dirname,
      "templates",
      "fe-base",
      "task-manager"
    );

    // Ensure the template directory exists
    if (!fs.existsSync(templateDir)) {
      console.error(`Template directory ${templateDir} not found.`);
      process.exit(1);
    }

    // Prompts using @inquirer/prompts
    const storybook = await confirm({
      message: "Would you like to include Storybook?",
      default: false,
    });

    const testing = await confirm({
      message: "Would you like to include React Testing Library?",
      default: false,
    });

    // Prompt for package manager
    const packageManager = await select({
      message: "Which package manager would you like to use?",
      choices: [
        { name: "npm", value: "npm" },
        { name: "yarn", value: "yarn" },
        { name: "pnpm", value: "pnpm" },
      ],
      default: "npm",
    });

    // Copy base template
    await fs.copy(templateDir, targetDir);

    // Remove Storybook-related folders if Storybook is not selected
    if (!storybook) {
      const storiesDir = path.join(targetDir, "stories");
      const storybookConfigDir = path.join(targetDir, ".storybook");
      try {
        if (fs.existsSync(storiesDir)) {
          await fs.remove(storiesDir);
          console.log(
            "Removed ds/stories folder as Storybook was not required."
          );
        }
        if (fs.existsSync(storybookConfigDir)) {
          await fs.remove(storybookConfigDir);
          console.log(
            "Removed .storybook folder as Storybook was not required."
          );
        }
      } catch (error) {
        console.error(
          "Failed to remove Storybook-related folders:",
          error.message
        );
      }
    }

    // Modify package.json
    const pkgPath = path.join(targetDir, "package.json");
    const pkg = await fs.readJson(pkgPath);
    pkg.name = appName;

    // Ensure devDependencies exists
    pkg.devDependencies = pkg.devDependencies || {};

    if (storybook) {
      pkg.devDependencies = {
        storybook: "^8.6.9",
        "@chromatic-com/storybook": "^3",
        "@storybook/addon-essentials": "^8.6.9",
        "@storybook/addon-interactions": "^8.6.9",
        "@storybook/addon-onboarding": "^8.6.9",
        "@storybook/blocks": "^8.6.9",
        "@storybook/nextjs": "^8.6.9",
        "@storybook/react": "^8.6.9",
        "@storybook/addon-actions": "^8.6.9",
        "@storybook/test": "^8.6.9",
        ...pkg.devDependencies,
      };
      await fs.ensureDir(path.join(targetDir, "ds", "stories"));
    }

    if (testing) {
      pkg.devDependencies = {
        ...pkg.devDependencies,
        "@testing-library/react": "^14.0.0",
        "@testing-library/jest-dom": "^6.0.0",
        jest: "^29.0.0",
        "jest-environment-jsdom": "^29.0.0",
      };
      // TaskItem.test.tsx already exists in the template, so no need to create it
    }

    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    // Install dependencies
    console.log(`Installing dependencies using ${packageManager}...`);
    try {
      const installCommand =
        packageManager === "npm"
          ? "npm install --legacy-peer-deps"
          : packageManager === "yarn"
          ? "yarn"
          : "pnpm install";
      await execPromise(installCommand, { cwd: targetDir });
      console.log("Dependencies installed successfully!");
    } catch (error) {
      console.error("Failed to install dependencies:", error.message);
      console.log("You can manually install dependencies by running:");
      console.log(
        `  cd ${appName} && ${
          packageManager === "npm"
            ? "npm install --legacy-peer-deps"
            : packageManager === "yarn"
            ? "yarn"
            : "pnpm install"
        }`
      );
      process.exit(1);
    }

    // Initialize Storybook if selected (do nothing further as per instruction)
    if (storybook) {
      console.log("Initializing Storybook...");
      try {
        const storybookInitCommand =
          packageManager === "npm"
            ? "npx storybook init --no-dev --skip-install"
            : packageManager === "yarn"
            ? "yarn storybook init --no-dev --skip-install"
            : "pnpm storybook init --no-dev --skip-install";
        await execPromise(storybookInitCommand, { cwd: targetDir });
        console.log("Storybook initialized successfully!");

        // Update Storybook configuration to enable storyStoreV7
        const storybookConfigPath = path.join(
          targetDir,
          ".storybook",
          "main.js"
        );
        if (!fs.existsSync(storybookConfigPath)) {
          console.warn(
            "Storybook configuration file (.storybook/main.js) not found. You may need to enable storyStoreV7 manually."
          );
        } 
      } catch (error) {
        console.error("Failed to initialize Storybook:", error.message);
        console.log("You can manually initialize Storybook by running:");
        console.log(
          `  cd ${appName} && ${
            packageManager === "npm" ? "npx" : packageManager
          } storybook init --no-dev --skip-install `
        );
      }
    }

    // Update README.md with clearer instructions
    const readmePath = path.join(targetDir, "README.md");
    const readmeContent = `# ${appName}

A JaseciStack Front-End project featuring TaskForge, a simple task manager built with Next.js.

## Getting Started
Dependencies have been automatically installed using ${packageManager}.

1. **Navigate to the project directory**:
   \`\`\`bash
   cd ${appName}
   \`\`\`
2. **Start the development server**:
   \`\`\`bash
   ${packageManager === "npm" ? "npm run" : packageManager} dev
   \`\`\`

## Features
- Next.js with TypeScript
- Atomic Design structure (\`ds/atoms/\`, \`molecules/\`, etc.)
- Redux Toolkit for state management (\`lib/redux/\`)
- ShadCN UI components (\`ds/atoms/\`, etc.)
- Tailwind CSS for styling
${
  storybook
    ? `- Storybook: \`${
        packageManager === "npm" ? "npm run" : packageManager
      } storybook\``
    : ""
}
${
  testing
    ? `- Tests: \`${
        packageManager === "npm" ? "npm run" : packageManager
      } test\``
    : ""
}

## TaskForge Demo
- Add tasks with a title.
- Toggle tasks between "To Do" and "Done".
- Explore customization guides in the \`docs/\` folder.
`;
    await fs.writeFile(readmePath, readmeContent);

    // Provide clear next steps in the CLI output
    console.log(`\n🎉 Created ${appName} successfully! 🎉\n`);
    console.log("Next steps:");
    console.log(`  1. Navigate to the project directory:`);
    console.log(`     cd ${appName}`);
    console.log(`  2. Start the development server:`);
    console.log(
      `     ${packageManager === "npm" ? "npm run" : packageManager} dev`
    );
    if (storybook) {
      console.log(`  3. (Optional) Run Storybook to view components:`);
      console.log(
        `     ${
          packageManager === "npm" ? "npm run" : packageManager
        } storybook`
      );
    }
  });

// Add new command for creating modules
program
  .command("add-module <module_name>")
  .description("Add a new module to the JaseciStack application")
  .option("--node <node_name>", "Add a node for the module")
  .option(
    "--path <route_path>",
    'Custom route path (e.g., "dashboard/products" or "(admin)/users")'
  )
  .option(
    "--apis <endpoints>",
    'Comma-separated list of API endpoints (e.g., "list,get,create,update,delete")'
  )
  .option(
    "--node-type <type_definition>",
    'Custom node type definition (e.g., "id:string,name:string,price:number,status:active|inactive")'
  )
  .option(
    "--auth <yes|no>",
    "Whether to wrap the page with ProtectedRoute and use private_api (default: yes)"
  )
  .option(
    "--api-base <base_path>",
    "Base path for API endpoints (e.g., '/todos' for JSONPlaceholder)"
  )
  .action(async (moduleName, options) => {
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
      const dirs = [
        "actions",
        "hooks",
        "pages",
        "schemas",
        "services",
        "utils",
      ];

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
      console.log(`  1. Access your module at /${routePath}`);
      console.log(
        `  2. Customize the ${nodeName}Node interface in nodes/${nodeName.toLowerCase()}-node.ts`
      );
      console.log(
        `  3. Implement your module's specific functionality in the created files`
      );
      console.log(`  4. Add more actions and reducers as needed in the slice`);
    } catch (error) {
      console.error("Failed to create module:", error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);