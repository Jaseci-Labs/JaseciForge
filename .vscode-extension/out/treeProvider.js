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
exports.JaseciForgeTreeProvider = exports.CommandItem = void 0;
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
                new CommandItem("✨ New App", "jaseci-forge.createApp", "Create a new JaseciStack application", "rocket"),
                new CommandItem("➕ Add Module", "jaseci-forge.addModule", "Add a new module", "add"),
                new CommandItem("🎨 Module Generator", "jaseci-forge.moduleGenerator", "Open module generator interface", "tools"),
                new CommandItem("🧩 Add Node", "jaseci-forge.addNode", "Add a new node", "symbol-field"),
                new CommandItem("🧹 Cleanup", "jaseci-forge.cleanup", "Remove the example app", "trash"),
                new CommandItem("🖥️ Taurify", "jaseci-forge.taurify", "Convert to Tauri app", "desktop-download"),
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
//# sourceMappingURL=treeProvider.js.map