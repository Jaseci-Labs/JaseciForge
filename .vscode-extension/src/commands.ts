import * as vscode from "vscode";
import { spawn } from "child_process";
import { JaseciForgeTreeProvider } from "./treeProvider";

export interface ExecError extends Error {
  code?: number;
  stdout?: string;
  stderr?: string;
}

// Helper to run a command with spawn and stream output
export async function runCommandWithOutput(
  command: string,
  args: string[],
  cwd: string,
  outputChannel: vscode.OutputChannel,
  label: string
) {
  return new Promise<void>((resolve, reject) => {
    const startMsg = `[${label}] Running: ${command} ${args.join(" ")}`;
    outputChannel.appendLine(startMsg);
    const child = spawn(command, args, { cwd, shell: true });
    child.stdout.on("data", (data) => {
      outputChannel.append(data.toString());
    });
    child.stderr.on("data", (data) => {
      outputChannel.append(data.toString());
    });
    child.on("error", (err) => {
      const errMsg = `[${label}] Error: ${err.message}`;
      outputChannel.appendLine(errMsg);
      outputChannel.show(true);
      reject(err);
    });
    child.on("close", (code) => {
      const exitMsg = `[${label}] Process exited with code ${code}`;
      outputChannel.appendLine(exitMsg);
      outputChannel.show(true);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${label} failed with exit code ${code}`));
      }
    });
  });
}

export function registerCommands(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel,
  treeProvider: JaseciForgeTreeProvider,
  getWorkingDirectory: () => string | undefined
) {
  const selectWorkingDir = vscode.commands.registerCommand(
    "jaseci-forge.selectWorkingDir",
    async () => {
      const folders = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
        openLabel: "Select Working Directory",
      });
      if (folders && folders.length > 0) {
        const workingDirectory = folders[0].fsPath;
        // This is a bit of a hack, ideally we'd have a better way to update the working directory
        // and refresh the tree view from here.
        // For now, we'll rely on the main extension file to manage the workingDirectory state
        // and call treeProvider.refresh() after this command updates the directory.
        // This means the tree view might not update immediately if selectWorkingDir
        // is called from somewhere else, but for now it works with the tree view item.
        (treeProvider as any).workingDirectory = workingDirectory; // Update internal state if possible (hack)
        treeProvider.refresh();
        vscode.window.showInformationMessage(
          `Working directory set to: ${workingDirectory}`
        );
        // We need a way to inform the main extension.ts that the directory has changed.
        // Using a custom event or a callback passed during registration would be cleaner.
        // For simplicity now, we'll assume extension.ts handles this.
      }
    }
  );

  const createApp = vscode.commands.registerCommand(
    "jaseci-forge.createApp",
    async () => {
      const appName = await vscode.window.showInputBox({
        prompt: "Enter your app name",
        placeHolder: "my-jaseci-app",
      });

      if (appName) {
        const storybook = await vscode.window.showQuickPick(["yes", "no"], {
          placeHolder: "Include Storybook?",
          canPickMany: false,
        });
        const testinglibrary = await vscode.window.showQuickPick(
          ["yes", "no"],
          {
            placeHolder: "Include React Testing Library?",
            canPickMany: false,
          }
        );
        const packageManager = await vscode.window.showQuickPick(
          ["npm", "yarn", "pnpm"],
          {
            placeHolder: "Select package manager",
            canPickMany: false,
          }
        );

        try {
          const cwd =
            getWorkingDirectory() ||
            vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
          if (!cwd) {
            throw new Error(
              "No working directory selected or workspace folder found"
            );
          }
          const args = ["create-jaseci-app", appName];
          args.push(`--storybook=${storybook === "yes"}`);
          args.push(`--testinglibrary=${testinglibrary === "yes"}`);
          if (packageManager) args.push(`--package-manager=${packageManager}`);
          await runCommandWithOutput(
            "npx",
            args,
            cwd,
            outputChannel,
            "Create App"
          );
          vscode.window.showInformationMessage(
            `Successfully created new JaseciStack app: ${appName}`
          );
        } catch (error) {
          const execError = error as ExecError;
          outputChannel.appendLine(`[Create App] Error: ${execError.message}`);
          outputChannel.show(true);
          vscode.window.showErrorMessage(
            `Failed to create app: ${execError.message || "Unknown error"}`
          );
        }
      }
    }
  );

  const addModule = vscode.commands.registerCommand(
    "jaseci-forge.addModule",
    async () => {
      const moduleName = await vscode.window.showInputBox({
        prompt: "Enter module name",
        placeHolder: "projectanagement",
      });

      if (moduleName) {
        const config = vscode.workspace.getConfiguration("jaseciForge");
        const defaultApiBase = config.get("defaultApiBase");

        const nodeType = await vscode.window.showInputBox({
          prompt: "Enter node type definition (optional)",
          placeHolder: "id:string,name:string,description:string?",
        });

        const apis = await vscode.window.showInputBox({
          prompt: "Enter API endpoints (optional)",
          placeHolder: "getAll,create,update,delete",
        });

        const apiBase = await vscode.window.showInputBox({
          prompt: "Enter API base path",
          value: defaultApiBase as string,
        });

        const auth = await vscode.window.showQuickPick(["yes", "no"], {
          placeHolder: "Use authentication?",
          canPickMany: false,
        });

        try {
          const cwd =
            getWorkingDirectory() ||
            vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
          if (!cwd) {
            throw new Error(
              "No working directory selected or workspace folder found"
            );
          }
          const args = ["create-jaseci-app", "add-module", moduleName];
          if (nodeType) args.push(`--node-type="${nodeType}"`);
          if (apis) args.push(`--apis="${apis}"`);
          if (apiBase) args.push(`--api-base="${apiBase}"`);
          if (auth) args.push(`--auth="${auth}"`);
          await runCommandWithOutput(
            "npx",
            args,
            cwd,
            outputChannel,
            "Add Module"
          );
          vscode.window.showInformationMessage(
            `Successfully added new module: ${moduleName}`
          );
        } catch (error) {
          const execError = error as ExecError;
          outputChannel.appendLine(`[Add Module] Error: ${execError.message}`);
          outputChannel.show(true);
          vscode.window.showErrorMessage(
            `Failed to add module: ${execError.message || "Unknown error"}`
          );
        }
      }
    }
  );

  const addNode = vscode.commands.registerCommand(
    "jaseci-forge.addNode",
    async () => {
      const moduleName = await vscode.window.showInputBox({
        prompt: "Enter module name",
        placeHolder: "projectanagement",
      });

      if (moduleName) {
        const nodeName = await vscode.window.showInputBox({
          prompt: "Enter node name",
          placeHolder: "Comment",
        });

        if (nodeName) {
          const config = vscode.workspace.getConfiguration("jaseciForge");
          const defaultApiBase = config.get("defaultApiBase");

          const nodeType = await vscode.window.showInputBox({
            prompt: "Enter node type definition (optional)",
            placeHolder: "id:string,content:string,author_id:number",
          });

          const apis = await vscode.window.showInputBox({
            prompt: "Enter API endpoints (optional)",
            placeHolder: "getAll,create,update,delete",
          });

          const apiBase = await vscode.window.showInputBox({
            prompt: "Enter API base path",
            value: defaultApiBase as string,
          });

          const auth = await vscode.window.showQuickPick(["yes", "no"], {
            placeHolder: "Use authentication?",
            canPickMany: false,
          });

          try {
            const cwd =
              getWorkingDirectory() ||
              vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
            if (!cwd) {
              throw new Error(
                "No working directory selected or workspace folder found"
              );
            }
            const args = [
              "create-jaseci-app",
              "add-node",
              moduleName,
              nodeName,
            ];
            if (nodeType) args.push(`--node-type="${nodeType}"`);
            if (apis) args.push(`--apis="${apis}"`);
            if (apiBase) args.push(`--api-base="${apiBase}"`);
            if (auth) args.push(`--auth="${auth}"`);
            await runCommandWithOutput(
              "npx",
              args,
              cwd,
              outputChannel,
              "Add Node"
            );
            vscode.window.showInformationMessage(
              `Successfully added new node: ${nodeName} to module: ${moduleName}`
            );
          } catch (error) {
            const execError = error as ExecError;
            outputChannel.appendLine(`[Add Node] Error: ${execError.message}`);
            outputChannel.show(true);
            vscode.window.showErrorMessage(
              `Failed to add node: ${execError.message || "Unknown error"}`
            );
          }
        }
      }
    }
  );

  const cleanup = vscode.commands.registerCommand(
    "jaseci-forge.cleanup",
    async () => {
      const confirm = await vscode.window.showWarningMessage(
        "Are you sure you want to remove the example task manager app?",
        { modal: true },
        "Yes"
      );

      if (confirm === "Yes") {
        try {
          const cwd =
            getWorkingDirectory() ||
            vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
          if (!cwd) {
            throw new Error(
              "No working directory selected or workspace folder found"
            );
          }
          await runCommandWithOutput(
            "npx",
            ["create-jaseci-app", "cleanup"],
            cwd,
            outputChannel,
            "Cleanup"
          );
          vscode.window.showInformationMessage(
            "Successfully cleaned up example app"
          );
        } catch (error) {
          const execError = error as ExecError;
          outputChannel.appendLine(`[Cleanup] Error: ${execError.message}`);
          outputChannel.show(true);
          vscode.window.showErrorMessage(
            `Failed to cleanup: ${execError.message || "Unknown error"}`
          );
        }
      }
    }
  );

  const taurify = vscode.commands.registerCommand(
    "jaseci-forge.taurify",
    async () => {
      const packageManager = await vscode.window.showQuickPick(
        ["npm", "yarn", "pnpm"],
        {
          placeHolder: "Select package manager",
          canPickMany: false,
        }
      );

      if (packageManager) {
        try {
          const cwd =
            getWorkingDirectory() ||
            vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
          if (!cwd) {
            throw new Error(
              "No working directory selected or workspace folder found"
            );
          }
          await runCommandWithOutput(
            "npx",
            [
              "create-jaseci-app",
              "taurify",
              `--package-manager=${packageManager}`,
            ],
            cwd,
            outputChannel,
            "Taurify"
          );
          vscode.window.showInformationMessage(
            "Successfully converted to Tauri app"
          );
        } catch (error) {
          const execError = error as ExecError;
          outputChannel.appendLine(`[Taurify] Error: ${execError.message}`);
          outputChannel.show(true);
          vscode.window.showErrorMessage(
            `Failed to convert to Tauri: ${
              execError.message || "Unknown error"
            }`
          );
        }
      }
    }
  );

  context.subscriptions.push(
    selectWorkingDir,
    createApp,
    addModule,
    addNode,
    cleanup,
    taurify
  );
}
