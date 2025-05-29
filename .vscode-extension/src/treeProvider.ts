import * as vscode from "vscode";
import * as path from "path";

export class CommandItem extends vscode.TreeItem {
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

export class JaseciForgeTreeProvider
  implements vscode.TreeDataProvider<CommandItem>
{
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
