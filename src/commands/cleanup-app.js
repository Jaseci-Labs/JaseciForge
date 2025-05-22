const fs = require("fs-extra");
const path = require("path");

async function cleanupApp() {
  const targetDir = process.cwd();

  // Files and directories to remove
  const itemsToRemove = [
    // Remove example task manager module
    path.join(targetDir, "modules", "tasks"),
    // Remove example task manager page
    path.join(targetDir, "app", "page.tsx"),
    // Remove example task manager node
    path.join(targetDir, "nodes", "task-node.ts"),
    // Remove example task manager store slice
    path.join(targetDir, "store", "tasksSlice.ts"),
  ];

  console.log("🧹 Cleaning up example task manager app...");

  // Remove each item
  for (const item of itemsToRemove) {
    try {
      if (fs.existsSync(item)) {
        await fs.remove(item);
        console.log(`✓ Removed ${path.relative(targetDir, item)}`);
      }
    } catch (error) {
      console.error(
        `Failed to remove ${path.relative(targetDir, item)}:`,
        error.message
      );
    }
  }

  // Update store/index.ts to remove task-related imports and reducer
  const storeIndexPath = path.join(targetDir, "store", "index.ts");
  if (fs.existsSync(storeIndexPath)) {
    try {
      let storeContent = await fs.readFile(storeIndexPath, "utf8");

      // Remove task-related imports and reducer
      storeContent = storeContent
        .replace(/import.*tasksSlice.*\n/g, "")
        .replace(/tasks: tasksReducer,\n\s*/g, "")
        .replace(/,\s*}$/g, "}"); // Remove trailing comma if it exists

      await fs.writeFile(storeIndexPath, storeContent);
      console.log("✓ Updated store/index.ts");
    } catch (error) {
      console.error("Failed to update store/index.ts:", error.message);
    }
  }

  // Create a new empty home page
  const newHomePage = `import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to your JaseciStack application",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Welcome to JaseciStack</h1>
      <p className="text-lg text-gray-600">
        Get started by creating your first module using:
        <br />
        <code className="bg-gray-100 p-2 rounded mt-2 block">
          npx create-jaseci-app add-module your-module-name
        </code>
      </p>
    </main>
  );
}`;

  try {
    await fs.writeFile(path.join(targetDir, "app", "page.tsx"), newHomePage);
    console.log("✓ Created new home page");
  } catch (error) {
    console.error("Failed to create new home page:", error.message);
  }

  console.log(
    "\n✨ Cleanup complete! Your app is now ready for your own modules."
  );
}

module.exports = cleanupApp;
