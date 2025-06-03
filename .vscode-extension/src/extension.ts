import * as vscode from "vscode";
import { exec, spawn } from "child_process";
import { promisify } from "util";
import * as path from "path";
import {
  JaseciForgeTreeProvider,
  FileScannerProvider,
  FileScanItem,
} from "./treeProvider";
import { registerCommands } from "./commands";
import * as fs from "fs";
import * as ts from "typescript";

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

export function activate(context: vscode.ExtensionContext) {
  // Store the selected working directory
  let workingDirectory: string | undefined = undefined;

  // Register Tree View
  const treeProvider = new JaseciForgeTreeProvider(() => workingDirectory);
  vscode.window.registerTreeDataProvider("jaseciForgeCommands", treeProvider);

  // Register File Scanner Report Tree View
  const fileScannerProvider = new FileScannerProvider();
  vscode.window.registerTreeDataProvider(
    "jaseciForgeFileScanner",
    fileScannerProvider
  );

  // Create Output Channel
  const outputChannel = vscode.window.createOutputChannel("Jaseci Forge");

  // Function to update working directory
  function updateWorkingDirectory(newPath: string | undefined) {
    workingDirectory = newPath;
    // Refresh tree view
    treeProvider.refresh();
  }

  // Register Commands
  registerCommands(
    context,
    outputChannel,
    treeProvider,
    () => workingDirectory,
    updateWorkingDirectory
  );

  // Module Generator Command
  let moduleGenerator = vscode.commands.registerCommand(
    "jaseci-forge.moduleGenerator",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "moduleGenerator",
        "Module Generator",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );

      panel.webview.html = getModuleGeneratorContent(panel.webview);

      // Send initial working directory
      panel.webview.postMessage({
        command: "updateWorkingDir",
        path: workingDirectory,
      });

      // Listen for working directory changes
      const disposable = vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("jaseciForge")) {
          const config = vscode.workspace.getConfiguration("jaseciForge");
          const newPath = config.get<string>("workingDirectory");
          updateWorkingDirectory(newPath);
          panel.webview.postMessage({
            command: "updateWorkingDir",
            path: newPath,
          });
        }
      });
      context.subscriptions.push(disposable);

      panel.webview.onDidReceiveMessage(
        async (message) => {
          if (message.command === "generate") {
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
                "add-module",
                message.moduleName,
              ];
              if (message.nodeName) args.push(`--node="${message.nodeName}"`);
              if (message.routePath) args.push(`--path="${message.routePath}"`);
              if (message.apiEndpoints)
                args.push(`--apis="${message.apiEndpoints}"`);
              if (message.nodeType)
                args.push(`--node-type="${message.nodeType}"`);
              if (!message.auth) args.push("--auth=no");
              if (message.apiBase) args.push(`--api-base="${message.apiBase}"`);

              await runCommandWithOutput(
                "npx",
                args,
                cwd,
                outputChannel,
                "Add Module"
              );
              vscode.window.showInformationMessage(
                `Successfully added new module: ${message.moduleName}`
              );

              // Example: Scanner function for new node/module files
              const scanResults = await scanNewModuleFiles(
                cwd,
                message.moduleName
              );
              fileScannerProvider.refresh(scanResults);
            } catch (error) {
              const execError = error as ExecError;
              outputChannel.appendLine(
                `[Add Module] Error: ${execError.message}`
              );
              outputChannel.show(true);
              vscode.window.showErrorMessage(
                `Failed to add module: ${execError.message || "Unknown error"}`
              );
            }
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );

  // Node Generator Command
  let nodeGenerator = vscode.commands.registerCommand(
    "jaseci-forge.nodeGenerator",
    async () => {
      const panel = vscode.window.createWebviewPanel(
        "nodeGenerator",
        "Node Generator",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );

      // Get module names before creating the webview
      const cwd =
        workingDirectory || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      const moduleNames = cwd ? await getModuleNames(cwd) : [];

      panel.webview.html = getNodeGeneratorContent(panel.webview, moduleNames);

      // Send initial working directory and module names
      panel.webview.postMessage({
        command: "updateWorkingDir",
        path: workingDirectory,
        moduleNames: moduleNames,
      });

      // Listen for working directory changes
      const disposable = vscode.workspace.onDidChangeConfiguration(
        async (e) => {
          if (e.affectsConfiguration("jaseciForge")) {
            const config = vscode.workspace.getConfiguration("jaseciForge");
            const newPath = config.get<string>("workingDirectory");
            updateWorkingDirectory(newPath);

            // Get updated module names
            const moduleNames = newPath ? await getModuleNames(newPath) : [];

            panel.webview.postMessage({
              command: "updateWorkingDir",
              path: newPath,
              moduleNames: moduleNames,
            });
          }
        }
      );
      context.subscriptions.push(disposable);

      panel.webview.onDidReceiveMessage(
        async (message) => {
          if (message.command === "generate") {
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
                message.moduleName,
                message.nodeName,
              ];
              if (message.nodeType)
                args.push(`--node-type="${message.nodeType}"`);
              if (message.apiEndpoints)
                args.push(`--apis="${message.apiEndpoints}"`);
              if (!message.auth) args.push("--auth=no");
              if (message.apiBase) args.push(`--api-base="${message.apiBase}"`);

              await runCommandWithOutput(
                "npx",
                args,
                cwd,
                outputChannel,
                "Add Node"
              );
              vscode.window.showInformationMessage(
                `Successfully added new node: ${message.nodeName} to module: ${message.moduleName}`
              );

              // Example: Scanner function for new node/module files
              const scanResults = await scanNewNodeFiles(
                cwd,
                message.moduleName,
                message.nodeName
              );
              fileScannerProvider.refresh(scanResults);
            } catch (error) {
              const execError = error as ExecError;
              outputChannel.appendLine(
                `[Add Node] Error: ${execError.message}`
              );
              outputChannel.show(true);
              vscode.window.showErrorMessage(
                `Failed to add node: ${execError.message || "Unknown error"}`
              );
            }
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );

  context.subscriptions.push(moduleGenerator, nodeGenerator);

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

function getModuleGeneratorContent(webview: vscode.Webview): string {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Module Generator</title>
    <style>
      body {
        padding: 20px;
        font-family: var(--vscode-font-family);
        color: var(--vscode-foreground);
      }
      .form-group {
        margin-bottom: 15px;
      }
      label {
        display: block;
        margin-bottom: 5px;
        color: var(--vscode-foreground);
      }
      input[type="text"] {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--vscode-input-border);
        background: var(--vscode-input-background);
        color: var(--vscode-input-foreground);
        border-radius: 2px;
      }
      .help-text {
        font-size: 12px;
        color: var(--vscode-descriptionForeground);
        margin-top: 4px;
      }
      .switch-group {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
      }
      .switch-group label {
        margin-bottom: 0;
        margin-left: 8px;
      }
      button {
        background: var(--vscode-button-background);
        color: var(--vscode-button-foreground);
        border: none;
        padding: 8px 16px;
        border-radius: 2px;
        cursor: pointer;
      }
      button:hover {
        background: var(--vscode-button-hoverBackground);
      }
      .preview {
        margin-top: 20px;
        padding: 15px;
        background: var(--vscode-editor-background);
        border: 1px solid var(--vscode-input-border);
        border-radius: 2px;
      }
      .preview pre {
        margin: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      .working-dir {
        margin-bottom: 20px;
        padding: 10px;
        background: var(--vscode-editor-background);
        border: 1px solid var(--vscode-input-border);
        border-radius: 2px;
      }
      .working-dir.warning {
        border-color: var(--vscode-errorForeground);
      }
      .working-dir .label {
        font-weight: bold;
        margin-bottom: 5px;
      }
      .working-dir .path {
        font-family: var(--vscode-editor-font-family);
        word-break: break-all;
      }
    </style>
  </head>
  <body>
    <h2>Module Generator</h2>
    
    <div id="workingDir" class="working-dir">
      <div class="label">Working Directory:</div>
      <div class="path">Select a working directory first</div>
    </div>

    <div class="form-group">
      <label for="moduleName">Module Name *</label>
      <input type="text" id="moduleName" placeholder="e.g., users, products">
      <div class="help-text">The name of your module</div>
    </div>

    <div class="form-group">
      <label for="nodeName">Node Name</label>
      <input type="text" id="nodeName" placeholder="Custom node name">
      <div class="help-text">Custom node name for the module</div>
    </div>

    <div class="form-group">
      <label for="routePath">Route Path</label>
      <input type="text" id="routePath" placeholder='e.g., "dashboard/products"'>
      <div class="help-text">Custom route path</div>
    </div>

    <div class="form-group">
      <label for="apiEndpoints">API Endpoints</label>
      <input type="text" id="apiEndpoints" placeholder='e.g., "list,get,create,update,delete"'>
      <div class="help-text">Comma-separated list of API endpoints</div>
    </div>

    <div class="form-group">
      <label for="nodeType">Node Type</label>
      <input type="text" id="nodeType" placeholder='e.g., "id:string,name:string,price:number"'>
      <div class="help-text">Custom node type definition</div>
    </div>

    <div class="form-group">
      <label for="apiBase">API Base Path</label>
      <input type="text" id="apiBase" placeholder='e.g., "/todos"'>
      <div class="help-text">Base path for API endpoints</div>
    </div>

    <div class="switch-group">
      <input type="checkbox" id="auth" checked>
      <label for="auth">Enable Authentication</label>
    </div>

    <div class="preview">
      <h3>Generated Command:</h3>
      <pre id="commandPreview"></pre>
    </div>

    <button onclick="generateCommand()">Generate & Execute</button>

    <script>
      const vscode = acquireVsCodeApi();
      
      function updateCommandPreview() {
        const moduleName = document.getElementById('moduleName').value;
        const nodeName = document.getElementById('nodeName').value;
        const routePath = document.getElementById('routePath').value;
        const apiEndpoints = document.getElementById('apiEndpoints').value;
        const nodeType = document.getElementById('nodeType').value;
        const apiBase = document.getElementById('apiBase').value;
        const auth = document.getElementById('auth').checked;

        let command = \`npx create-jaseci-app add-module \${moduleName}\`;
        if (nodeName) command += \` --node="\${nodeName}"\`;
        if (routePath) command += \` --path="\${routePath}"\`;
        if (apiEndpoints) command += \` --apis="\${apiEndpoints}"\`;
        if (nodeType) command += \` --node-type="\${nodeType}"\`;
        if (!auth) command += " --auth=no";
        if (apiBase) command += \` --api-base="\${apiBase}"\`;

        document.getElementById('commandPreview').textContent = command;
      }

      function generateCommand() {
        const moduleName = document.getElementById('moduleName').value;
        if (!moduleName) {
          vscode.postMessage({
            command: 'alert',
            text: 'Module name is required'
          });
          return;
        }

        const workingDir = document.getElementById('workingDir');
        if (workingDir.classList.contains('warning')) {
          vscode.postMessage({
            command: 'alert',
            text: 'Please select a working directory first'
          });
          return;
        }

        vscode.postMessage({
          command: 'generate',
          moduleName: moduleName,
          nodeName: document.getElementById('nodeName').value,
          routePath: document.getElementById('routePath').value,
          apiEndpoints: document.getElementById('apiEndpoints').value,
          nodeType: document.getElementById('nodeType').value,
          apiBase: document.getElementById('apiBase').value,
          auth: document.getElementById('auth').checked
        });
      }

      // Add event listeners to update preview
      document.getElementById('moduleName').addEventListener('input', updateCommandPreview);
      document.getElementById('nodeName').addEventListener('input', updateCommandPreview);
      document.getElementById('routePath').addEventListener('input', updateCommandPreview);
      document.getElementById('apiEndpoints').addEventListener('input', updateCommandPreview);
      document.getElementById('nodeType').addEventListener('input', updateCommandPreview);
      document.getElementById('apiBase').addEventListener('input', updateCommandPreview);
      document.getElementById('auth').addEventListener('change', updateCommandPreview);

      // Initial preview
      updateCommandPreview();

      // Listen for working directory updates
      window.addEventListener('message', event => {
        const message = event.data;
        if (message.command === 'updateWorkingDir') {
          const workingDir = document.getElementById('workingDir');
          const pathElement = workingDir.querySelector('.path');
          if (message.path) {
            workingDir.classList.remove('warning');
            pathElement.textContent = message.path;
          } else {
            workingDir.classList.add('warning');
            pathElement.textContent = 'Select a working directory first';
          }
        }
      });
    </script>
  </body>
  </html>`;
}

async function getModuleNames(cwd: string): Promise<string[]> {
  try {
    const modulesPath = path.join(cwd, "modules");
    const { stdout } = await execAsync("ls -d */", { cwd: modulesPath });
    return stdout
      .split("\n")
      .filter((dir) => dir.trim())
      .map((dir) => dir.replace(/\/$/, "")); // Remove trailing slash
  } catch (error) {
    console.error("Error getting module names:", error);
    return [];
  }
}

function getNodeGeneratorContent(
  webview: vscode.Webview,
  moduleNames: string[]
): string {
  const moduleOptions = moduleNames
    .map((name) => `<option value="${name}">${name}</option>`)
    .join("");

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Node Generator</title>
    <style>
      body {
        padding: 20px;
        font-family: var(--vscode-font-family);
        color: var(--vscode-foreground);
      }
      .form-group {
        margin-bottom: 15px;
      }
      label {
        display: block;
        margin-bottom: 5px;
        color: var(--vscode-foreground);
      }
      input[type="text"], select {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--vscode-input-border);
        background: var(--vscode-input-background);
        color: var(--vscode-input-foreground);
        border-radius: 2px;
      }
      .help-text {
        font-size: 12px;
        color: var(--vscode-descriptionForeground);
        margin-top: 4px;
      }
      .switch-group {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
      }
      .switch-group label {
        margin-bottom: 0;
        margin-left: 8px;
      }
      button {
        background: var(--vscode-button-background);
        color: var(--vscode-button-foreground);
        border: none;
        padding: 8px 16px;
        border-radius: 2px;
        cursor: pointer;
      }
      button:hover {
        background: var(--vscode-button-hoverBackground);
      }
      .preview {
        margin-top: 20px;
        padding: 15px;
        background: var(--vscode-editor-background);
        border: 1px solid var(--vscode-input-border);
        border-radius: 2px;
      }
      .preview pre {
        margin: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      .working-dir {
        margin-bottom: 20px;
        padding: 10px;
        background: var(--vscode-editor-background);
        border: 1px solid var(--vscode-input-border);
        border-radius: 2px;
      }
      .working-dir.warning {
        border-color: var(--vscode-errorForeground);
      }
      .working-dir .label {
        font-weight: bold;
        margin-bottom: 5px;
      }
      .working-dir .path {
        font-family: var(--vscode-editor-font-family);
        word-break: break-all;
      }
    </style>
  </head>
  <body>
    <h2>Node Generator</h2>
    
    <div id="workingDir" class="working-dir">
      <div class="label">Working Directory:</div>
      <div class="path">Select a working directory first</div>
    </div>

    <div class="form-group">
      <label for="moduleName">Module Name *</label>
      <select id="moduleName">
        <option value="">Select a module</option>
        ${moduleOptions}
      </select>
      <div class="help-text">The module to add the node to</div>
    </div>

    <div class="form-group">
      <label for="nodeName">Node Name *</label>
      <input type="text" id="nodeName" placeholder="e.g., Comment, Post">
      <div class="help-text">The name of your node</div>
    </div>

    <div class="form-group">
      <label for="nodeType">Node Type</label>
      <input type="text" id="nodeType" placeholder='e.g., "id:string,content:string,author_id:number"'>
      <div class="help-text">Custom node type definition</div>
    </div>

    <div class="form-group">
      <label for="apiEndpoints">API Endpoints</label>
      <input type="text" id="apiEndpoints" placeholder='e.g., "list,get,create,update,delete"'>
      <div class="help-text">Comma-separated list of API endpoints</div>
    </div>

    <div class="form-group">
      <label for="apiBase">API Base Path</label>
      <input type="text" id="apiBase" placeholder='e.g., "/comments"'>
      <div class="help-text">Base path for API endpoints</div>
    </div>

    <div class="switch-group">
      <input type="checkbox" id="auth" checked>
      <label for="auth">Enable Authentication</label>
    </div>

    <div class="preview">
      <h3>Generated Command:</h3>
      <pre id="commandPreview"></pre>
    </div>

    <button onclick="generateCommand()">Generate & Execute</button>

    <script>
      const vscode = acquireVsCodeApi();
      
      function updateCommandPreview() {
        const moduleName = document.getElementById('moduleName').value;
        const nodeName = document.getElementById('nodeName').value;
        const nodeType = document.getElementById('nodeType').value;
        const apiEndpoints = document.getElementById('apiEndpoints').value;
        const apiBase = document.getElementById('apiBase').value;
        const auth = document.getElementById('auth').checked;

        let command = \`npx create-jaseci-app add-node \${moduleName} \${nodeName}\`;
        if (nodeType) command += \` --node-type="\${nodeType}"\`;
        if (apiEndpoints) command += \` --apis="\${apiEndpoints}"\`;
        if (!auth) command += " --auth=no";
        if (apiBase) command += \` --api-base="\${apiBase}"\`;

        document.getElementById('commandPreview').textContent = command;
      }

      function generateCommand() {
        const moduleName = document.getElementById('moduleName').value;
        const nodeName = document.getElementById('nodeName').value;
        
        if (!moduleName || !nodeName) {
          vscode.postMessage({
            command: 'alert',
            text: 'Module name and node name are required'
          });
          return;
        }

        const workingDir = document.getElementById('workingDir');
        if (workingDir.classList.contains('warning')) {
          vscode.postMessage({
            command: 'alert',
            text: 'Please select a working directory first'
          });
          return;
        }

        vscode.postMessage({
          command: 'generate',
          moduleName: moduleName,
          nodeName: nodeName,
          nodeType: document.getElementById('nodeType').value,
          apiEndpoints: document.getElementById('apiEndpoints').value,
          apiBase: document.getElementById('apiBase').value,
          auth: document.getElementById('auth').checked
        });
      }

      // Add event listeners to update preview
      document.getElementById('moduleName').addEventListener('change', updateCommandPreview);
      document.getElementById('nodeName').addEventListener('input', updateCommandPreview);
      document.getElementById('nodeType').addEventListener('input', updateCommandPreview);
      document.getElementById('apiEndpoints').addEventListener('input', updateCommandPreview);
      document.getElementById('apiBase').addEventListener('input', updateCommandPreview);
      document.getElementById('auth').addEventListener('change', updateCommandPreview);

      // Initial preview
      updateCommandPreview();

      // Listen for working directory updates
      window.addEventListener('message', event => {
        const message = event.data;
        if (message.command === 'updateWorkingDir') {
          const workingDir = document.getElementById('workingDir');
          const pathElement = workingDir.querySelector('.path');
          if (message.path) {
            workingDir.classList.remove('warning');
            pathElement.textContent = message.path;
          } else {
            workingDir.classList.add('warning');
            pathElement.textContent = 'Select a working directory first';
          }

          // Update module names dropdown
          if (message.moduleNames) {
            const moduleSelect = document.getElementById('moduleName');
            const currentValue = moduleSelect.value;
            const options = message.moduleNames.map(name => 
              \`<option value="\${name}" \${name === currentValue ? 'selected' : ''}>\${name}</option>\`
            ).join('');
            moduleSelect.innerHTML = '<option value="">Select a module</option>' + options;
            updateCommandPreview();
          }
        }
      });
    </script>
  </body>
  </html>`;
}

// Utility to check for syntax errors
function checkSyntax(filePath: string): string | null {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true
    );
    // Use parseDiagnostics if available, otherwise fallback to getPreEmitDiagnostics
    const diagnostics: readonly ts.Diagnostic[] =
      (sourceFile as any).parseDiagnostics ||
      ts.getPreEmitDiagnostics(ts.createProgram([filePath], {}), sourceFile);
    if (diagnostics.length > 0) {
      return diagnostics
        .map((d: ts.Diagnostic) =>
          typeof d.messageText === "string"
            ? d.messageText
            : JSON.stringify(d.messageText)
        )
        .join("; ");
    }
    return null;
  } catch (err) {
    return "File could not be read or parsed";
  }
}

// Enhanced file check
function checkFileWithSyntax(filePath: string): FileScanItem {
  if (!fs.existsSync(filePath)) {
    return new FileScanItem(
      path.basename(filePath),
      "error",
      "File missing",
      filePath
    );
  }
  const syntaxError = checkSyntax(filePath);
  if (syntaxError) {
    return new FileScanItem(
      path.basename(filePath),
      "error",
      `Syntax error: ${syntaxError}`,
      filePath
    );
  }
  return new FileScanItem(
    path.basename(filePath),
    "ok",
    "File exists and is valid",
    filePath
  );
}

// Scanner function for new module files (checks for index.ts in actions, hooks, services, and store/index.ts)
async function scanNewModuleFiles(
  rootPath: string,
  moduleName: string
): Promise<FileScanItem[]> {
  const moduleDir = path.join(rootPath, "modules", moduleName);
  const expectedFiles = [
    path.join(moduleDir, "services", "index.ts"),
    path.join(moduleDir, "actions", "index.ts"),
    path.join(moduleDir, "hooks", "index.ts"),
  ];
  const results: FileScanItem[] = [];
  for (const file of expectedFiles) {
    results.push(checkFileWithSyntax(file));
  }
  // Check store/index.ts
  const storeIndexPath = path.join(rootPath, "store", "index.ts");
  results.push(checkFileWithSyntax(storeIndexPath));
  results.push(...scanStoreIndexForReducer(storeIndexPath, moduleName));
  return results;
}

// Scanner function for new node files (checks for node-specific files and store/index.ts)
async function scanNewNodeFiles(
  rootPath: string,
  moduleName: string,
  nodeName: string
): Promise<FileScanItem[]> {
  const moduleDir = path.join(rootPath, "modules", moduleName);
  const expectedFiles = [
    path.join(moduleDir, "services", `${nodeName.toLowerCase()}-api.ts`),
    path.join(moduleDir, "actions", `${nodeName.toLowerCase()}-actions.ts`),
    path.join(moduleDir, "hooks", `${nodeName.toLowerCase()}-hooks.ts`),
    path.join(rootPath, "store", `${nodeName.toLowerCase()}Slice.ts`),
    path.join(rootPath, "nodes", `${nodeName.toLowerCase()}-node.ts`),
  ];
  const results: FileScanItem[] = [];
  for (const file of expectedFiles) {
    results.push(checkFileWithSyntax(file));
  }
  // Check store/index.ts
  const storeIndexPath = path.join(rootPath, "store", "index.ts");
  results.push(checkFileWithSyntax(storeIndexPath));
  results.push(...scanStoreIndexForReducer(storeIndexPath, nodeName));
  return results;
}

// Check store/index.ts for import and reducer registration
function scanStoreIndexForReducer(
  storeIndexPath: string,
  reducerName: string
): FileScanItem[] {
  const results: FileScanItem[] = [];
  if (!fs.existsSync(storeIndexPath)) {
    results.push(
      new FileScanItem(
        "index.ts",
        "error",
        "store/index.ts missing",
        storeIndexPath
      )
    );
    return results;
  }
  const content = fs.readFileSync(storeIndexPath, "utf8");
  // Check for import
  const importRegex = new RegExp(
    `import\\s+${reducerName}Reducer\\s+from\\s+['\"]/\\./${reducerName}Slice['\"];`
  );
  if (importRegex.test(content)) {
    results.push(
      new FileScanItem(
        "index.ts",
        "ok",
        `Import for ${reducerName}Reducer found`,
        storeIndexPath
      )
    );
  } else {
    results.push(
      new FileScanItem(
        "index.ts",
        "error",
        `Import for ${reducerName}Reducer missing`,
        storeIndexPath
      )
    );
  }
  // Check for registration in reducer object
  const reducerRegex = new RegExp(`${reducerName}:\\s*${reducerName}Reducer`);
  if (reducerRegex.test(content)) {
    results.push(
      new FileScanItem(
        "index.ts",
        "ok",
        `${reducerName} registered in reducer`,
        storeIndexPath
      )
    );
  } else {
    results.push(
      new FileScanItem(
        "index.ts",
        "error",
        `${reducerName} not registered in reducer`,
        storeIndexPath
      )
    );
  }
  return results;
}
