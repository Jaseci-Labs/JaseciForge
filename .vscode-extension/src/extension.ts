import * as vscode from "vscode";
import { exec, spawn } from "child_process";
import { promisify } from "util";
import * as path from "path";

const execAsync = promisify(exec);

interface ExecError extends Error {
  code?: number;
  stdout?: string;
  stderr?: string;
}

class CommandItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly commandId: string | undefined,
    public readonly tooltip: string,
    icon?: string,
    collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.None
  ) {
    super(label, collapsibleState);
    this.tooltip = tooltip;
    if (commandId) {
      this.command = { command: commandId, title: label };
    }
    if (icon) {
      this.iconPath = new vscode.ThemeIcon(icon);
    }
  }
}

class JaseciForgeTreeProvider implements vscode.TreeDataProvider<CommandItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    CommandItem | undefined | null | void
  > = new vscode.EventEmitter<CommandItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    CommandItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  constructor(private getWorkingDir: () => string | undefined) {}

  getTreeItem(element: CommandItem): vscode.TreeItem {
    return element;
  }

  getChildren(): CommandItem[] {
    const workingDir = this.getWorkingDir();
    const items: CommandItem[] = [
      new CommandItem(
        workingDir
          ? `📁 ${path.basename(workingDir)}`
          : "📁 Select Working Directory",
        "jaseci-forge.selectWorkingDir",
        workingDir || "Choose the folder to run commands in",
        "folder"
      ),
      new CommandItem("─────────────", undefined, "", undefined), // separator
      new CommandItem(
        "✨ New App",
        "jaseci-forge.createApp",
        "Create a new JaseciStack application",
        "rocket"
      ),
      new CommandItem(
        "➕ Add Module",
        "jaseci-forge.addModule",
        "Add a new module",
        "add"
      ),
      new CommandItem(
        "🧩 Add Node",
        "jaseci-forge.addNode",
        "Add a new node",
        "symbol-field"
      ),
      new CommandItem(
        "🧹 Cleanup",
        "jaseci-forge.cleanup",
        "Remove the example app",
        "trash"
      ),
      new CommandItem(
        "🖥️ Taurify",
        "jaseci-forge.taurify",
        "Convert to Tauri app",
        "desktop-download"
      ),
    ];
    return items;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

export function activate(context: vscode.ExtensionContext) {
  // Store the selected working directory
  let workingDirectory: string | undefined = undefined;

  // Register Tree View
  const treeProvider = new JaseciForgeTreeProvider(() => workingDirectory);
  vscode.window.registerTreeDataProvider("jaseciForgeCommands", treeProvider);

  // Create Output Channel
  const outputChannel = vscode.window.createOutputChannel("Jaseci Forge");

  // Select Working Directory Command
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
        workingDirectory = folders[0].fsPath;
        treeProvider.refresh();
        vscode.window.showInformationMessage(
          `Working directory set to: ${workingDirectory}`
        );
      }
    }
  );

  // Create App Command
  let createApp = vscode.commands.registerCommand(
    "jaseci-forge.createApp",
    async () => {
      const appName = await vscode.window.showInputBox({
        prompt: "Enter your app name",
        placeHolder: "my-jaseci-app",
      });

      if (appName) {
        // Prompt for Storybook
        const storybook = await vscode.window.showQuickPick(["yes", "no"], {
          placeHolder: "Include Storybook?",
          canPickMany: false,
        });
        // Prompt for Testing Library
        const testinglibrary = await vscode.window.showQuickPick(
          ["yes", "no"],
          {
            placeHolder: "Include React Testing Library?",
            canPickMany: false,
          }
        );
        // Prompt for Package Manager
        const packageManager = await vscode.window.showQuickPick(
          ["npm", "yarn", "pnpm"],
          {
            placeHolder: "Select package manager",
            canPickMany: false,
          }
        );

        try {
          const cwd =
            workingDirectory ||
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

  // Add Module Command
  let addModule = vscode.commands.registerCommand(
    "jaseci-forge.addModule",
    async () => {
      const moduleName = await vscode.window.showInputBox({
        prompt: "Enter module name",
        placeHolder: "projectanagement",
      });

      if (moduleName) {
        const config = vscode.workspace.getConfiguration("jaseciForge");
        const defaultApiBase = config.get("defaultApiBase");
        const defaultAuth = config.get("defaultAuth");

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
            workingDirectory ||
            vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
          if (!cwd) {
            throw new Error(
              "No working directory selected or workspace folder found"
            );
          }
          const args = ["create-jaseci-app", "add-module", moduleName];
          if (nodeType) args.push(`--node-type=\"${nodeType}\"`);
          if (apis) args.push(`--apis=\"${apis}\"`);
          if (apiBase) args.push(`--api-base=\"${apiBase}\"`);
          if (auth) args.push(`--auth=\"${auth}\"`);
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

  // Add Node Command
  let addNode = vscode.commands.registerCommand(
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
          const defaultAuth = config.get("defaultAuth");

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
              workingDirectory ||
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
            if (nodeType) args.push(`--node-type=\"${nodeType}\"`);
            if (apis) args.push(`--apis=\"${apis}\"`);
            if (apiBase) args.push(`--api-base=\"${apiBase}\"`);
            if (auth) args.push(`--auth=\"${auth}\"`);
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

  // Cleanup Command
  let cleanup = vscode.commands.registerCommand(
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
            workingDirectory ||
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

  // Taurify Command
  let taurify = vscode.commands.registerCommand(
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
            workingDirectory ||
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

  // Helper to run a command with spawn and stream output
  async function runCommandWithOutput(
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
}

export function deactivate() {}
