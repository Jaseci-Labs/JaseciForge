const { confirm, select } = require("@inquirer/prompts");
const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
const util = require("util");

// Promisify exec to use async/await
const execPromise = util.promisify(exec);

async function createApp(appName, options = {}) {
  const targetDir = path.join(process.cwd(), appName);
  const templateDir = path.join(
    __dirname,
    "../..",
    "templates",
    "fe-base",
    options.example ? "task-manager" : "minimal"
  );

  // Ensure the template directory exists
  if (!fs.existsSync(templateDir)) {
    console.error(`Template directory ${templateDir} not found.`);
    process.exit(1);
  }

  // Use options if provided, otherwise prompt
  let storybook;
  if (typeof options.storybook === "string") {
    storybook = options.storybook === "true";
  } else if (typeof options.storybook === "boolean") {
    storybook = options.storybook;
  } else {
    storybook = undefined;
  }

  let testing;
  if (typeof options.testinglibrary === "string") {
    testing = options.testinglibrary === "true";
  } else if (typeof options.testinglibrary === "boolean") {
    testing = options.testinglibrary;
  } else {
    testing = undefined;
  }

  let packageManager = options.packageManager;

  if (storybook === undefined) {
    storybook = await confirm({
      message: "Would you like to include Storybook?",
      default: false,
    });
  }
  if (testing === undefined) {
    testing = await confirm({
      message: "Would you like to include React Testing Library?",
      default: false,
    });
  }
  if (!packageManager) {
    packageManager = await select({
      message: "Which package manager would you like to use?",
      choices: [
        { name: "npm", value: "npm" },
        { name: "yarn", value: "yarn" },
        { name: "pnpm", value: "pnpm" },
      ],
      default: "npm",
    });
  }

  // Copy base template
  await fs.copy(templateDir, targetDir);

  // Remove Storybook-related folders if Storybook is not selected
  if (!storybook) {
    const storiesDir = path.join(targetDir, "stories");
    const storybookConfigDir = path.join(targetDir, ".storybook");
    try {
      if (fs.existsSync(storiesDir)) {
        await fs.remove(storiesDir);
        console.log("Removed ds/stories folder as Storybook was not required.");
      }
      if (fs.existsSync(storybookConfigDir)) {
        await fs.remove(storybookConfigDir);
        console.log("Removed .storybook folder as Storybook was not required.");
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

  // Initialize Storybook if selected
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

  // Update README.md
  const readmePath = path.join(targetDir, "README.md");
  const readmeContent = `# ${appName}

A JaseciStack Front-End project built with Next.js.

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
${
  options.example
    ? `
## TaskForge Demo
- Add tasks with a title.
- Toggle tasks between "To Do" and "Done".
- Explore customization guides in the \`docs/\` folder.`
    : ""
}
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
      `     ${packageManager === "npm" ? "npm run" : packageManager} storybook`
    );
  }
}

module.exports = createApp;
