const fs = require("fs-extra");
const path = require("path");

async function addNode(moduleName, nodeName, options) {
  const targetDir = process.cwd();
  const moduleDir = path.join(targetDir, "modules", moduleName);
  const requiresAuth = options.auth !== "no"; // default to true if not explicitly set to 'no'
  const apiBase = options.apiBase || `/${moduleName.toLowerCase()}`;

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

  // Parse API endpoints
  const defaultApis = ["getAll", "getById", "create", "update", "delete"];
  const customApis = options.apis
    ? options.apis.split(",").map((api) => api.trim())
    : defaultApis;

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
    // Verify module exists
    if (!fs.existsSync(moduleDir)) {
      throw new Error(`Module ${moduleName} does not exist`);
    }

    // Create node definition
    const nodeContent = `export interface ${nodeName}Node {\n${generateTypeDefinition(
      nodeType
    )}\n}`;
    await fs.writeFile(
      path.join(targetDir, "nodes", `${nodeName.toLowerCase()}-node.ts`),
      nodeContent
    );

    // Generate service methods
    const serviceMethods = customApis
      .map((api) => {
        const apiClient = requiresAuth ? "private_api" : "public_api";
        const nodeApiBase = `${apiBase}/${nodeName.toLowerCase()}s`;

        switch (api.toLowerCase()) {
          case "getall":
          case "list":
            return `  // Get all ${nodeName.toLowerCase()}s
  get${nodeName}s: async () => {
    const response = await ${apiClient}.get('${nodeApiBase}');
    return response.data;
  }`;
          case "getbyid":
          case "get":
            return `  // Get a specific ${nodeName.toLowerCase()}
  get${nodeName}: async (id: number) => {
    const response = await ${apiClient}.get(\`${nodeApiBase}/\${id}\`);
    return response.data;
  }`;
          case "create":
            return `  // Create a new ${nodeName.toLowerCase()}
  create${nodeName}: async (data: Omit<${nodeName}Node, 'id'>) => {
    const response = await ${apiClient}.post('${nodeApiBase}', data);
    return response.data;
  }`;
          case "update":
            return `  // Update an existing ${nodeName.toLowerCase()}
  update${nodeName}: async (id: number, data: Partial<${nodeName}Node>) => {
    const response = await ${apiClient}.put(\`${nodeApiBase}/\${id}\`, data);
    return response.data;
  }`;
          case "delete":
            return `  // Delete a ${nodeName.toLowerCase()}
  delete${nodeName}: async (id: number) => {
    const response = await ${apiClient}.delete(\`${nodeApiBase}/\${id}\`);
    return response.data;
  }`;
          default:
            return `  // Custom ${api} operation
  ${api}: async (data?: any) => {
    const response = await ${apiClient}.post(\`${nodeApiBase}\${data ? \`/\${data}\` : ''}\`);
    return response.data;
  }`;
        }
      })
      .join(",\n\n");

    // Create service file
    const serviceContent = `import { ${nodeName}Node } from '@/nodes/${nodeName.toLowerCase()}-node';\nimport { ${
      requiresAuth ? "private" : "public"
    }_api } from '@/_core/api-client';\n\nexport const ${nodeName}Api = {\n${serviceMethods}\n};\n`;
    await fs.writeFile(
      path.join(moduleDir, "services", `${nodeName.toLowerCase()}-api.ts`),
      serviceContent
    );

    // Create actions file
    const actionsContent = `import { createAsyncThunk } from '@reduxjs/toolkit';\nimport { ${nodeName}Api } from '../services/${nodeName.toLowerCase()}-api';\nimport { ${nodeName}Node } from '@/nodes/${nodeName.toLowerCase()}-node';\n\n// Example actions\nexport const fetch${nodeName}s = createAsyncThunk(\n  '${moduleName.toLowerCase()}/${nodeName.toLowerCase()}/fetchAll',\n  async (_, { rejectWithValue }) => {\n    try {\n      const response = await ${nodeName}Api.get${nodeName}s();\n      return response;\n    } catch (error) {\n      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch ${nodeName}s');\n    }\n  }\n);\n`;
    await fs.writeFile(
      path.join(moduleDir, "actions", `${nodeName.toLowerCase()}-actions.ts`),
      actionsContent
    );

    // Create hooks file
    const hooksContent = `import { useAppDispatch, useAppSelector } from '@/store/useStore';\nimport { fetch${nodeName}s } from '../actions/${nodeName.toLowerCase()}-actions';\nimport { ${nodeName}Node } from '@/nodes/${nodeName.toLowerCase()}-node';\n\nexport const use${nodeName}s = () => {\n  const dispatch = useAppDispatch();\n  const { items, isLoading, error } = useAppSelector(state => state.${moduleName.toLowerCase()}.${nodeName.toLowerCase()});\n\n  const refresh = () => {\n    dispatch(fetch${nodeName}s());\n  };\n\n  return { items, isLoading, error, refresh };\n};\n`;
    await fs.writeFile(
      path.join(moduleDir, "hooks", `${nodeName.toLowerCase()}-hooks.ts`),
      hooksContent
    );

    // Create slice file
    const sliceContent = `import { createSlice, type PayloadAction } from '@reduxjs/toolkit';\nimport { ${nodeName}Node } from '@/nodes/${nodeName.toLowerCase()}-node';\nimport { fetch${nodeName}s } from '@/modules/${moduleName}/actions/${nodeName.toLowerCase()}-actions';\n\ninterface ${nodeName}State {\n  items: ${nodeName}Node[];\n  isLoading: boolean;\n  error: string | null;\n  success: boolean;\n  successMessage: string | null;\n}\n\nconst initialState: ${nodeName}State = {\n  items: [],\n  isLoading: false,\n  error: null,\n  success: false,\n  successMessage: null,\n};\n\nexport const ${nodeName.toLowerCase()}Slice = createSlice({\n  name: '${moduleName.toLowerCase()}/${nodeName.toLowerCase()}',\n  initialState,\n  reducers: {\n    setItems: (state, action: PayloadAction<${nodeName}Node[]>) => {\n      state.items = action.payload;\n    },\n    setLoading: (state, action: PayloadAction<boolean>) => {\n      state.isLoading = action.payload;\n    },\n    setError: (state, action: PayloadAction<string | null>) => {\n      state.error = action.payload;\n      state.success = false;\n    },\n    resetSuccess: (state) => {\n      state.success = false;\n      state.successMessage = null;\n    },\n  },\n  extraReducers: (builder) => {\n    builder.addCase(fetch${nodeName}s.pending, (state) => {\n      state.isLoading = true;\n      state.error = null;\n      state.success = false;\n      state.successMessage = null;\n    });\n    builder.addCase(fetch${nodeName}s.fulfilled, (state, action) => {\n      state.isLoading = false;\n      state.items = action.payload;\n      state.success = true;\n      state.successMessage = '${nodeName}s fetched successfully';\n    });\n    builder.addCase(fetch${nodeName}s.rejected, (state, action) => {\n      state.isLoading = false;\n      state.error = action.payload as string;\n      state.success = false;\n    });\n  },\n});\n\nexport const { setItems, setLoading, setError, resetSuccess } = ${nodeName.toLowerCase()}Slice.actions;\nexport default ${nodeName.toLowerCase()}Slice.reducer;\n`;
    await fs.writeFile(
      path.join(targetDir, "store", `${nodeName.toLowerCase()}Slice.ts`),
      sliceContent
    );

    // Update index files
    const indexFiles = {
      "actions/index.ts": `export * from './${nodeName.toLowerCase()}-actions';`,
      "hooks/index.ts": `export * from './${nodeName.toLowerCase()}-hooks';`,
      "services/index.ts": `export * from './${nodeName.toLowerCase()}-api';`,
    };

    for (const [filename, content] of Object.entries(indexFiles)) {
      const indexPath = path.join(moduleDir, filename);
      if (fs.existsSync(indexPath)) {
        const existingContent = await fs.readFile(indexPath, "utf8");
        await fs.writeFile(indexPath, existingContent + "\n" + content);
      } else {
        await fs.writeFile(indexPath, content);
      }
    }

    // Update store configuration
    const storePath = path.join(targetDir, "store", "index.ts");
    if (fs.existsSync(storePath)) {
      let storeContent = await fs.readFile(storePath, "utf8");

      // Add import
      const importStatement = `import ${nodeName.toLowerCase()}Reducer from './${nodeName.toLowerCase()}Slice';\n`;
      storeContent = importStatement + storeContent;

      // Add reducer to store configuration at root level
      storeContent = storeContent.replace(
        /reducer: {([^}]*)}/,
        `reducer: {$1\n    ${nodeName.toLowerCase()}s: ${nodeName.toLowerCase()}Reducer}`
      );

      await fs.writeFile(storePath, storeContent);
    }

    console.log(
      `\n🎉 Node ${nodeName} added successfully to module ${moduleName}! 🎉\n`
    );
    console.log("Next steps:");
    console.log("\n1. Modify the node type definition:");
    console.log(`   📁 nodes/${nodeName.toLowerCase()}-node.ts`);
    console.log("   - Add or modify fields in the interface");
    console.log("   - Update type definitions as needed");

    console.log("\n2. Verify and customize the API service:");
    console.log(
      `   📁 modules/${moduleName}/services/${nodeName.toLowerCase()}-api.ts`
    );
    console.log("   - Check generated API methods");
    console.log("   - Add custom API endpoints if needed");

    console.log("\n3. Review and enhance the Redux actions:");
    console.log(
      `   📁 modules/${moduleName}/actions/${nodeName.toLowerCase()}-actions.ts`
    );
    console.log("   - Add more async thunks for specific operations");
    console.log("   - Implement error handling and loading states");

    console.log("\n4. Check the Redux slice:");
    console.log(`   📁 store/${nodeName.toLowerCase()}Slice.ts`);
    console.log("   - Verify state structure");
    console.log("   - Add more reducers if needed");

    console.log("\n5. Customize the React hooks:");
    console.log(
      `   📁 modules/${moduleName}/hooks/${nodeName.toLowerCase()}-hooks.ts`
    );
    console.log("   - Add custom hooks for specific operations");
    console.log("   - Implement data transformation if needed");

    console.log("\n6. Integrate with your page:");
    console.log(`   📁 modules/${moduleName}/pages/${nodeName}Page.tsx`);
    console.log("   - Import and use the custom hooks");
    console.log("   - Add UI components to display and manage data");
    console.log("   - Implement error handling and loading states");

    console.log("\nExample usage in your page:");
    console.log(
      `import { use${nodeName}s } from '../hooks/${nodeName.toLowerCase()}-hooks';`
    );
    console.log(`\nfunction ${nodeName}Page() {`);
    console.log(
      `  const { items, isLoading, error, refresh } = use${nodeName}s();`
    );
    console.log(`  // ... implement your UI ...`);
    console.log(`}`);
  } catch (error) {
    console.error("Failed to add node:", error.message);
    process.exit(1);
  }
}

module.exports = addNode;
