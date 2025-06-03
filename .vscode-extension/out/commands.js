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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommandWithOutput = runCommandWithOutput;
exports.registerCommands = registerCommands;
const vscode = __importStar(require("vscode"));
const child_process_1 = require("child_process");
// Helper to run a command with spawn and stream output
async function runCommandWithOutput(command, args, cwd, outputChannel, label) {
    return new Promise((resolve, reject) => {
        const startMsg = `[${label}] Running: ${command} ${args.join(" ")}`;
        outputChannel.appendLine(startMsg);
        const child = (0, child_process_1.spawn)(command, args, { cwd, shell: true });
        // Set up event listeners
        const stdoutListener = (data) => {
            outputChannel.append(data.toString());
        };
        const stderrListener = (data) => {
            outputChannel.append(data.toString());
        };
        const errorListener = (err) => {
            const errMsg = `[${label}] Error: ${err.message}`;
            outputChannel.appendLine(errMsg);
            outputChannel.show(true);
            reject(err);
        };
        const closeListener = (code) => {
            const exitMsg = `[${label}] Process exited with code ${code}`;
            outputChannel.appendLine(exitMsg);
            outputChannel.show(true);
            if (code === 0) {
                resolve();
            }
            else {
                reject(new Error(`${label} failed with exit code ${code}`));
            }
        };
        // Add event listeners
        child.stdout.on("data", stdoutListener);
        child.stderr.on("data", stderrListener);
        child.on("error", errorListener);
        child.on("close", closeListener);
        // Cleanup function
        const cleanup = () => {
            child.stdout.removeListener("data", stdoutListener);
            child.stderr.removeListener("data", stderrListener);
            child.removeListener("error", errorListener);
            child.removeListener("close", closeListener);
        };
        // Set up cleanup on both success and failure
        const originalResolve = resolve;
        resolve = () => {
            cleanup();
            originalResolve();
        };
        const originalReject = reject;
        reject = (reason) => {
            cleanup();
            originalReject(reason);
        };
    });
}
// Helper to validate input
function validateInput(input, fieldName) {
    if (!input || input.trim() === "") {
        throw new Error(`${fieldName} is required`);
    }
    return input.trim();
}
function registerCommands(context, outputChannel, treeProvider, getWorkingDirectory, updateWorkingDirectory) {
    let selectWorkingDir = vscode.commands.registerCommand("jaseci-forge.selectWorkingDir", async () => {
        try {
            const result = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: "Select Working Directory",
            });
            if (result && result.length > 0) {
                const selectedPath = result[0].fsPath;
                const config = vscode.workspace.getConfiguration("jaseciForge");
                await config.update("workingDirectory", selectedPath, true);
                updateWorkingDirectory(selectedPath);
                vscode.window.showInformationMessage(`Working directory set to: ${selectedPath}`);
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to set working directory: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    const createApp = vscode.commands.registerCommand("jaseci-forge.createApp", async () => {
        try {
            const appName = await vscode.window.showInputBox({
                prompt: "Enter your app name",
                placeHolder: "my-jaseci-app",
                validateInput: (value) => {
                    if (!value || value.trim() === "") {
                        return "App name is required";
                    }
                    if (!/^[a-z0-9-]+$/.test(value)) {
                        return "App name can only contain lowercase letters, numbers, and hyphens";
                    }
                    return null;
                },
            });
            if (!appName) {
                return;
            }
            const storybook = await vscode.window.showQuickPick(["yes", "no"], {
                placeHolder: "Include Storybook?",
                canPickMany: false,
            });
            const testinglibrary = await vscode.window.showQuickPick(["yes", "no"], {
                placeHolder: "Include React Testing Library?",
                canPickMany: false,
            });
            const packageManager = await vscode.window.showQuickPick(["npm", "yarn", "pnpm"], {
                placeHolder: "Select package manager",
                canPickMany: false,
            });
            const cwd = getWorkingDirectory() ||
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
    });
    const addNode = vscode.commands.registerCommand("jaseci-forge.addNode", async () => {
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
                    value: defaultApiBase,
                });
                const auth = await vscode.window.showQuickPick(["yes", "no"], {
                    placeHolder: "Use authentication?",
                    canPickMany: false,
                });
                try {
                    const cwd = getWorkingDirectory() ||
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
                        args.push(`--node-type="${nodeType}"`);
                    if (apis)
                        args.push(`--apis="${apis}"`);
                    if (apiBase)
                        args.push(`--api-base="${apiBase}"`);
                    if (auth)
                        args.push(`--auth="${auth}"`);
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
    const cleanup = vscode.commands.registerCommand("jaseci-forge.cleanup", async () => {
        const confirm = await vscode.window.showWarningMessage("Are you sure you want to remove the example task manager app?", { modal: true }, "Yes");
        if (confirm === "Yes") {
            try {
                const cwd = getWorkingDirectory() ||
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
    const taurify = vscode.commands.registerCommand("jaseci-forge.taurify", async () => {
        const packageManager = await vscode.window.showQuickPick(["npm", "yarn", "pnpm"], {
            placeHolder: "Select package manager",
            canPickMany: false,
        });
        if (packageManager) {
            try {
                const cwd = getWorkingDirectory() ||
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
    context.subscriptions.push(selectWorkingDir, createApp, addNode, cleanup, taurify);
}
//# sourceMappingURL=commands.js.map