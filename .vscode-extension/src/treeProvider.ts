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
    try {
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
        new CommandItem(
          "─────────────",
          undefined,
          "Separator",
          undefined,
          vscode.TreeItemCollapsibleState.None
        ),
        new CommandItem(
          "New App",
          "jaseci-forge.createApp",
          "Create a new JaseciStack application",
          "rocket"
        ),
        new CommandItem(
          "Module Generator",
          "jaseci-forge.moduleGenerator",
          "Open module generator interface",
          "tools"
        ),
        new CommandItem(
          "Node Generator",
          "jaseci-forge.nodeGenerator",
          "Open node generator interface",
          "symbol-field"
        ),
        new CommandItem(
          "Cleanup",
          "jaseci-forge.cleanup",
          "Remove the example app",
          "trash"
        ),
        new CommandItem(
          "Taurify",
          "jaseci-forge.taurify",
          "Convert to Tauri app",
          "desktop-download"
        ),
      ];

      // Add a warning if no working directory is selected
      if (!workingDir) {
        items.push(
          new CommandItem(
            "⚠️ No working directory selected",
            undefined,
            "Please select a working directory to run commands",
            "warning"
          )
        );
      }

      return items;
    } catch (error) {
      vscode.window.showErrorMessage(
        `Error loading Jaseci Forge commands: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return [];
    }
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
