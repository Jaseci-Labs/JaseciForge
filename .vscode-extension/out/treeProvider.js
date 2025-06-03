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
exports.FileScannerProvider = exports.FileScanItem = exports.JaseciForgeTreeProvider = exports.CommandItem = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
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
exports.CommandItem = CommandItem;
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
        try {
            const workingDir = this.getWorkingDir();
            const items = [
                new CommandItem(workingDir
                    ? `📁 ${path.basename(workingDir)}`
                    : "📁 Select Working Directory", "jaseci-forge.selectWorkingDir", workingDir || "Choose the folder to run commands in", "folder"),
                new CommandItem("─────────────", undefined, "Separator", undefined, vscode.TreeItemCollapsibleState.None),
                new CommandItem("New App", "jaseci-forge.createApp", "Create a new JaseciStack application", "rocket"),
                new CommandItem("Module Generator", "jaseci-forge.moduleGenerator", "Open module generator interface", "tools"),
                new CommandItem("Node Generator", "jaseci-forge.nodeGenerator", "Open node generator interface", "symbol-field"),
                new CommandItem("Cleanup", "jaseci-forge.cleanup", "Remove the example app", "trash"),
                new CommandItem("Taurify", "jaseci-forge.taurify", "Convert to Tauri app", "desktop-download"),
            ];
            // Add a warning if no working directory is selected
            if (!workingDir) {
                items.push(new CommandItem("⚠️ No working directory selected", undefined, "Please select a working directory to run commands", "warning"));
            }
            return items;
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error loading Jaseci Forge commands: ${error instanceof Error ? error.message : "Unknown error"}`);
            return [];
        }
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
}
exports.JaseciForgeTreeProvider = JaseciForgeTreeProvider;
class FileScanItem extends vscode.TreeItem {
    constructor(label, status, message, filePath) {
        super(label);
        this.label = label;
        this.status = status;
        this.message = message;
        this.filePath = filePath;
        this.description = message;
        this.iconPath =
            status === "ok"
                ? new vscode.ThemeIcon("check")
                : status === "warn"
                    ? new vscode.ThemeIcon("warning")
                    : new vscode.ThemeIcon("error");
        this.command = {
            command: "vscode.open",
            title: "Open File",
            arguments: [vscode.Uri.file(filePath)],
        };
    }
}
exports.FileScanItem = FileScanItem;
class FileScannerProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.scanResults = [];
    }
    refresh(results) {
        this.scanResults = results;
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren() {
        return this.scanResults;
    }
}
exports.FileScannerProvider = FileScannerProvider;
//# sourceMappingURL=treeProvider.js.map