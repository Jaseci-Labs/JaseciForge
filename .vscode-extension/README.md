# Jaseci Forge VS Code Extension

This extension provides a user-friendly interface for using Jaseci Forge CLI tools directly from VS Code.

## Features

- Create new JaseciStack applications
- Add modules to existing applications
- Add nodes to existing modules
- Clean up example applications
- Convert applications to Tauri desktop apps

## Commands

### Create New App
- Command: `Jaseci Forge: Create New App`
- Prompts for app name
- Creates a new JaseciStack application with all necessary configurations

### Add Module
- Command: `Jaseci Forge: Add Module`
- Prompts for:
  - Module name
  - Node type definition (optional)
  - API endpoints (optional)
  - API base path
  - Authentication setting
- Creates a new module with the specified configuration

### Add Node
- Command: `Jaseci Forge: Add Node`
- Prompts for:
  - Module name
  - Node name
  - Node type definition (optional)
  - API endpoints (optional)
  - API base path
  - Authentication setting
- Adds a new node to the specified module

### Cleanup
- Command: `Jaseci Forge: Cleanup Example App`
- Removes the example task manager app
- Requires confirmation before proceeding

### Taurify
- Command: `Jaseci Forge: Convert to Tauri App`
- Prompts for package manager (npm/yarn/pnpm)
- Converts the current Next.js app to a Tauri desktop application

## Configuration

The extension provides the following settings:

- `jaseciForge.defaultApiBase`: Default API base path for new modules and nodes
- `jaseciForge.defaultAuth`: Default authentication setting for new modules and nodes

## Usage

1. Open the Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Type "Jaseci Forge" to see available commands
3. Select the desired command and follow the prompts

## Requirements

- VS Code 1.60.0 or higher
- Node.js installed
- Jaseci Forge CLI tools installed

## Extension Settings

This extension contributes the following settings:

* `jaseciForge.defaultApiBase`: Default API base path
* `jaseciForge.defaultAuth`: Default authentication setting

## Known Issues

- None at the moment

## Release Notes

### 0.1.0

Initial release of Jaseci Forge VS Code extension with basic functionality:
- Create new apps
- Add modules
- Add nodes
- Cleanup example apps
- Convert to Tauri apps 