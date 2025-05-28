"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const path = __importStar(require("path"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class CommandItem extends vscode.TreeItem {
    constructor(label, commandId, tooltip, icon, collapsibleState = vscode
        .TreeItemCollapsibleState.None) {
        super(label, collapsibleState);
        this.label = label;
        this.commandId = commandId;
        this.tooltip = tooltip;
        this.tooltip = tooltip;
        if (commandId) {
            this.command = { command: commandId, title: label };
        }
        if (icon) {
            this.iconPath = new vscode.ThemeIcon(icon);
        }
    }
}
class JaseciForgeTreeProvider {
    constructor(getWorkingDir) {
        this.getWorkingDir = getWorkingDir;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren() {
        const workingDir = this.getWorkingDir();
        const items = [
            new CommandItem(workingDir
                ? `📁 ${path.basename(workingDir)}`
                : "📁 Select Working Directory", "jaseci-forge.selectWorkingDir", workingDir || "Choose the folder to run commands in", "folder"),
            new CommandItem("─────────────", undefined, "", undefined),
            new CommandItem("✨ New App", "jaseci-forge.createApp", "Create a new JaseciStack application", "rocket"),
            new CommandItem("➕ Add Module", "jaseci-forge.addModule", "Add a new module", "add"),
            new CommandItem("🧩 Add Node", "jaseci-forge.addNode", "Add a new node", "symbol-field"),
            new CommandItem("🧹 Cleanup", "jaseci-forge.cleanup", "Remove the example app", "trash"),
            new CommandItem("🖥️ Taurify", "jaseci-forge.taurify", "Convert to Tauri app", "desktop-download"),
        ];
        return items;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
}
function activate(context) {
    // Store the selected working directory
    let workingDirectory = undefined;
    // Register Tree View
    const treeProvider = new JaseciForgeTreeProvider(() => workingDirectory);
    vscode.window.registerTreeDataProvider("jaseciForgeCommands", treeProvider);
    // Create Output Channel
    const outputChannel = vscode.window.createOutputChannel("Jaseci Forge");
    // Select Working Directory Command
    const selectWorkingDir = vscode.commands.registerCommand("jaseci-forge.selectWorkingDir", async () => {
        const folders = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            canSelectMany: false,
            openLabel: "Select Working Directory",
        });
        if (folders && folders.length > 0) {
            workingDirectory = folders[0].fsPath;
            treeProvider.refresh();
            vscode.window.showInformationMessage(`Working directory set to: ${workingDirectory}`);
        }
    });
    // Create App Command
    let createApp = vscode.commands.registerCommand("jaseci-forge.createApp", async () => {
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
            const testinglibrary = await vscode.window.showQuickPick(["yes", "no"], {
                placeHolder: "Include React Testing Library?",
                canPickMany: false,
            });
            // Prompt for Package Manager
            const packageManager = await vscode.window.showQuickPick(["npm", "yarn", "pnpm"], {
                placeHolder: "Select package manager",
                canPickMany: false,
            });
            try {
                const cwd = workingDirectory ||
                    vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
                if (!cwd) {
                    throw new Error("No working directory selected or workspace folder found");
                }
                const args = ["create-jaseci-app", appName];
                args.push(`--storybook=${storybook === "yes"}`);
                args.push(`--testinglibrary=${testinglibrary === "yes"}`);
                if (packageManager)
                    args.push(`--package-manager=${packageManager}`);
                await runCommandWithOutput("npx", args, cwd, outputChannel, "Create App");
                vscode.window.showInformationMessage(`Successfully created new JaseciStack app: ${appName}`);
            }
            catch (error) {
                const execError = error;
                outputChannel.appendLine(`[Create App] Error: ${execError.message}`);
                outputChannel.show(true);
                vscode.window.showErrorMessage(`Failed to create app: ${execError.message || "Unknown error"}`);
            }
        }
    });
    // Add Module Command
    let addModule = vscode.commands.registerCommand("jaseci-forge.addModule", async () => {
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
                value: defaultApiBase,
            });
            const auth = await vscode.window.showQuickPick(["yes", "no"], {
                placeHolder: "Use authentication?",
                canPickMany: false,
            });
            try {
                const cwd = workingDirectory ||
                    vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
                if (!cwd) {
                    throw new Error("No working directory selected or workspace folder found");
                }
                const args = ["create-jaseci-app", "add-module", moduleName];
                if (nodeType)
                    args.push(`--node-type=\"${nodeType}\"`);
                if (apis)
                    args.push(`--apis=\"${apis}\"`);
                if (apiBase)
                    args.push(`--api-base=\"${apiBase}\"`);
                if (auth)
                    args.push(`--auth=\"${auth}\"`);
                await runCommandWithOutput("npx", args, cwd, outputChannel, "Add Module");
                vscode.window.showInformationMessage(`Successfully added new module: ${moduleName}`);
            }
            catch (error) {
                const execError = error;
                outputChannel.appendLine(`[Add Module] Error: ${execError.message}`);
                outputChannel.show(true);
                vscode.window.showErrorMessage(`Failed to add module: ${execError.message || "Unknown error"}`);
            }
        }
    });
    // Add Node Command
    let addNode = vscode.commands.registerCommand("jaseci-forge.addNode", async () => {
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
                    value: defaultApiBase,
                });
                const auth = await vscode.window.showQuickPick(["yes", "no"], {
                    placeHolder: "Use authentication?",
                    canPickMany: false,
                });
                try {
                    const cwd = workingDirectory ||
                        vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
                    if (!cwd) {
                        throw new Error("No working directory selected or workspace folder found");
                    }
                    const args = [
                        "create-jaseci-app",
                        "add-node",
                        moduleName,
                        nodeName,
                    ];
                    if (nodeType)
                        args.push(`--node-type=\"${nodeType}\"`);
                    if (apis)
                        args.push(`--apis=\"${apis}\"`);
                    if (apiBase)
                        args.push(`--api-base=\"${apiBase}\"`);
                    if (auth)
                        args.push(`--auth=\"${auth}\"`);
                    await runCommandWithOutput("npx", args, cwd, outputChannel, "Add Node");
                    vscode.window.showInformationMessage(`Successfully added new node: ${nodeName} to module: ${moduleName}`);
                }
                catch (error) {
                    const execError = error;
                    outputChannel.appendLine(`[Add Node] Error: ${execError.message}`);
                    outputChannel.show(true);
                    vscode.window.showErrorMessage(`Failed to add node: ${execError.message || "Unknown error"}`);
                }
            }
        }
    });
    // Cleanup Command
    let cleanup = vscode.commands.registerCommand("jaseci-forge.cleanup", async () => {
        const confirm = await vscode.window.showWarningMessage("Are you sure you want to remove the example task manager app?", { modal: true }, "Yes");
        if (confirm === "Yes") {
            try {
                const cwd = workingDirectory ||
                    vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
                if (!cwd) {
                    throw new Error("No working directory selected or workspace folder found");
                }
                await runCommandWithOutput("npx", ["create-jaseci-app", "cleanup"], cwd, outputChannel, "Cleanup");
                vscode.window.showInformationMessage("Successfully cleaned up example app");
            }
            catch (error) {
                const execError = error;
                outputChannel.appendLine(`[Cleanup] Error: ${execError.message}`);
                outputChannel.show(true);
                vscode.window.showErrorMessage(`Failed to cleanup: ${execError.message || "Unknown error"}`);
            }
        }
    });
    // Taurify Command
    let taurify = vscode.commands.registerCommand("jaseci-forge.taurify", async () => {
        const packageManager = await vscode.window.showQuickPick(["npm", "yarn", "pnpm"], {
            placeHolder: "Select package manager",
            canPickMany: false,
        });
        if (packageManager) {
            try {
                const cwd = workingDirectory ||
                    vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
                if (!cwd) {
                    throw new Error("No working directory selected or workspace folder found");
                }
                await runCommandWithOutput("npx", [
                    "create-jaseci-app",
                    "taurify",
                    `--package-manager=${packageManager}`,
                ], cwd, outputChannel, "Taurify");
                vscode.window.showInformationMessage("Successfully converted to Tauri app");
            }
            catch (error) {
                const execError = error;
                outputChannel.appendLine(`[Taurify] Error: ${execError.message}`);
                outputChannel.show(true);
                vscode.window.showErrorMessage(`Failed to convert to Tauri: ${execError.message || "Unknown error"}`);
            }
        }
    });
    context.subscriptions.push(selectWorkingDir, createApp, addModule, addNode, cleanup, taurify);
    // Helper to run a command with spawn and stream output
    async function runCommandWithOutput(command, args, cwd, outputChannel, label) {
        return new Promise((resolve, reject) => {
            const startMsg = `[${label}] Running: ${command} ${args.join(" ")}`;
            outputChannel.appendLine(startMsg);
            const child = (0, child_process_1.spawn)(command, args, { cwd, shell: true });
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
                }
                else {
                    reject(new Error(`${label} failed with exit code ${code}`));
                }
            });
        });
    }
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map