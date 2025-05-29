# Jaseci Forge VS Code Extension - Developer Guide

## Project Structure

- `src/` - Source code for the extension (commands, providers, activation, etc.)
- `resources/` - Icons and static assets
- `out/` - Compiled output (auto-generated)
- `package.json` - Extension manifest (commands, views, activation events, etc.)
- `README.md` - User-facing documentation
- `DEVELOPER.md` - (This file) Developer/contributor documentation

## Getting Started

1. **Install dependencies:**
   ```bash
   cd .vscode-extension
   npm install
   # or
   yarn
   ```

2. **Open in VS Code:**
   - Open the `.vscode-extension` folder in VS Code.

3. **Run & Debug:**
   - Press `F5` to launch an Extension Development Host.

## Adding a New Command

- Add the command in `package.json` under `contributes.commands`.
- Implement the command in `src/extension.ts` (or relevant file).
- Register the command in the extension's activation function.

## Sidebar (Tree View) Customization

- Tree views are registered in `package.json` under `views`.
- Implement tree data providers in `src/`.
- Use icons and clear labels for a professional look.

## Building

```bash
npm run compile
# or
yarn compile
```

## Debugging

- Use breakpoints in VS Code.
- Use `console.log` for quick inspection.

## Publishing

1. Update the version in `package.json`.
2. Run:
   ```bash
   vsce package
   vsce publish
   ```
   (Requires [VSCE](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) and publisher setup.)

## Contributing

- Please open issues or pull requests for bugs, features, or improvements.
- Follow code style and add comments where necessary.

---

Happy coding! 🚀 