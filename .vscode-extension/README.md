<p align="center">
  <img src="resources/logo.png" alt="Jaseci Forge Logo" width="160"/>
</p>

# Jaseci Forge VS Code Extension

A Visual Studio Code extension for working with Jaseci Forge CLI tools. Easily create apps, add nodes, manage modules, and more—all from the comfort of your editor.

## Features

- Create new Jaseci Forge apps
- Add nodes and modules with a single command
- Cleanup example apps
- Convert to Tauri app
- Sidebar with quick access to all commands

## Installation

1. Search for **Jaseci Forge** in the VS Code Marketplace and click **Install**.
2. Or, download the `.vsix` file and install via the Extensions sidebar (`... > Install from VSIX`).

## Usage

- Open the **Jaseci Forge** sidebar from the Activity Bar.
- Use the command palette (`Ctrl+Shift+P`) and search for:
  - `Jaseci Forge: Create New App`
  - `Jaseci Forge: Add Node`
  - `Jaseci Forge: Cleanup Example App`
  - `Jaseci Forge: Convert to Tauri App`
  - ...and more!

## Extension Settings

- `jaseciForge.workingDirectory`: The working directory for Jaseci Forge commands
- `jaseciForge.defaultApiBase`: Default API base path for new modules and nodes
- `jaseciForge.defaultAuth`: Default authentication setting for new modules and nodes

## Requirements

- [Node.js](https://nodejs.org/) (for CLI tools)
- [Jaseci Forge CLI](https://github.com/Jaseci-Labs/JaseciForge) installed globally (recommended)

## Known Issues

- None at this time. Please report issues on [GitHub](https://github.com/Jaseci-Labs/JaseciForge/issues).

## Contributing

See [DEVELOPER.md](./DEVELOPER.md) for development and contribution guidelines.

## License

[MIT](./LICENSE)

---

**Happy coding with Jaseci Forge!** 