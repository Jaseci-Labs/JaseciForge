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
    const templateDir = path.join(__dirname, 'templates', 'fe-base', 'task-manager');

    // Ensure the template directory exists
    if (!fs.existsSync(templateDir)) {
      console.error(`Template directory ${templateDir} not found.`);
      process.exit(1);
    }

    // Prompts using @inquirer/prompts
    const storybook = await confirm({
      message: 'Would you like to include Storybook?',
      default: false,
    });

    const testing = await confirm({
      message: 'Would you like to include React Testing Library?',
      default: false,
    });

    // Prompt for package manager
    const packageManager = await select({
      message: 'Which package manager would you like to use?',
      choices: [
        { name: 'npm', value: 'npm' },
        { name: 'yarn', value: 'yarn' },
        { name: 'pnpm', value: 'pnpm' },
      ],
      default: 'npm',
    });

    // Copy base template
    await fs.copy(templateDir, targetDir);

    // Modify package.json
    const pkgPath = path.join(targetDir, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    pkg.name = appName;

    // Ensure devDependencies exists
    pkg.devDependencies = pkg.devDependencies || {};

    if (storybook) {
      pkg.devDependencies = {
        ...pkg.devDependencies,
        "@storybook/nextjs": "^7.6.17",
        "@storybook/react": "^7.6.17",
        "storybook": "^7.6.17",
      };
      await fs.ensureDir(path.join(targetDir, 'components', 'stories'));
      await fs.writeFile(
        path.join(targetDir, 'components', 'stories', 'Button.stories.tsx'),
        `import { Button } from '../atoms/button';\n\n` +
        `export default { title: 'Atoms/Button', component: Button };\n` +
        `export const Primary = { args: { children: 'Primary' } };`
      );
    }

    if (testing) {
      pkg.devDependencies = {
        ...pkg.devDependencies,
        "@testing-library/react": "^14.0.0",
        "@testing-library/jest-dom": "^6.0.0",
        "jest": "^29.0.0",
        "jest-environment-jsdom": "^29.0.0",
      };
      // TaskItem.test.tsx already exists in the template, so no need to create it
    }

    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    // Install dependencies
    console.log(`Installing dependencies using ${packageManager}...`);
    try {
      const installCommand = packageManager === 'npm' ? 'npm install' : packageManager === 'yarn' ? 'yarn' : 'pnpm install';
      await execPromise(installCommand, { cwd: targetDir });
      console.log('Dependencies installed successfully!');
    } catch (error) {
      console.error('Failed to install dependencies:', error.message);
      console.log('You can manually install dependencies by running:');
      console.log(`  cd ${appName} && ${packageManager === 'npm' ? 'npm install' : packageManager === 'yarn' ? 'yarn' : 'pnpm install'}`);
      process.exit(1);
    }

    // Initialize and upgrade Storybook if selected
    if (storybook) {
      console.log('Initializing Storybook...');
      try {
        const storybookInitCommand =
          packageManager === "npm"
            ? "npx storybook init --no-dev"
            : packageManager === "yarn"
            ? "yarn storybook init --no-dev"
            : "pnpm storybook init --no-dev";
        await execPromise(storybookInitCommand, { cwd: targetDir });
        console.log("Storybook initialized successfully!");

        // Upgrade Storybook to the latest version
        console.log("Upgrading Storybook to the latest version...");
        // const storybookUpgradeCommand =  'npx storybook@latest upgrade';
        // await execPromise(storybookUpgradeCommand, { cwd: targetDir });
        console.log("Storybook upgraded successfully!");

        // Update Storybook configuration to enable storyStoreV7
        const storybookConfigPath = path.join(
          targetDir,
          ".storybook",
          "main.js"
        );
        if (fs.existsSync(storybookConfigPath)) {
          let configContent = await fs.readFile(storybookConfigPath, "utf8");
          if (configContent.includes("features:")) {
            configContent = configContent.replace(
              /features:\s*{[^}]*}/,
              "features: { storyStoreV7: true }"
            );
          } else {
            configContent = configContent.replace(
              /module\.exports\s*=\s*{/,
              "module.exports = {\n  features: { storyStoreV7: true },"
            );
          }
          await fs.writeFile(storybookConfigPath, configContent);
          console.log("Updated Storybook configuration to use storyStoreV7.");
        } else {
          console.warn(
            "Storybook configuration file (.storybook/main.js) not found. You may need to enable storyStoreV7 manually."
          );
        }
      } catch (error) {
        console.error(
          "Failed to initialize or upgrade Storybook:",
          error.message
        );
        console.log(
          "You can manually initialize and upgrade Storybook by running:"
        );
        console.log(
          `  cd ${appName} && ${
            packageManager === "npm" ? "npx" : packageManager
          } storybook init --no-dev`
        );
        // console.log(`  ${packageManager === 'npm' ? 'npx' : packageManager} storybook@latest upgrade`);
      }
    }

    // Update README.md with clearer instructions
    const readmePath = path.join(targetDir, 'README.md');
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
   ${packageManager === 'npm' ? 'npm run' : packageManager} dev
   \`\`\`

## Features
- Next.js with TypeScript
- Atomic Design structure (\`components/atoms/\`, \`molecules/\`, etc.)
- Redux Toolkit for state management (\`lib/redux/\`)
- ShadCN UI components (\`components/atoms/\`, etc.)
- Tailwind CSS for styling
${storybook ? `- Storybook: \`${packageManager === 'npm' ? 'npm run' : packageManager} storybook\`` : ''}
${testing ? `- Tests: \`${packageManager === 'npm' ? 'npm run' : packageManager} test\`` : ''}

## TaskForge Demo
- Add tasks with a title.
- Toggle tasks between "To Do" and "Done".
- Explore customization guides in the \`docs/\` folder.
`;
    await fs.writeFile(readmePath, readmeContent);

    // Provide clear next steps in the CLI output
    console.log(`\n🎉 Created ${appName} successfully! 🎉\n`);
    console.log('Next steps:');
    console.log(`  1. Navigate to the project directory:`);
    console.log(`     cd ${appName}`);
    console.log(`  2. Start the development server:`);
    console.log(`     ${packageManager === 'npm' ? 'npm run' : packageManager} dev`);
    if (storybook) {
      console.log(`  3. (Optional) Run Storybook to view components:`);
      console.log(`     ${packageManager === 'npm' ? 'npm run' : packageManager} storybook`);
    }
  });

program.parse(process.argv);