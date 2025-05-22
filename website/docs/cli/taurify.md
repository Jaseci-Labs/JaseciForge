# Taurify

The `taurify` command converts your Next.js app into a Tauri desktop application, allowing you to build cross-platform desktop apps with web technologies.

## Usage

```bash
npx create-jaseci-app taurify
```

## Prerequisites

Before running the command, ensure you have all the required dependencies installed. The command will check for these automatically, but you can verify them manually by visiting:
https://v2.tauri.app/start/prerequisites/

1. **Rust and Cargo**
   - Install Rust from [rustup.rs](https://rustup.rs)
   - Verify installation: `rustc --version`

2. **System Dependencies**

   **For Linux:**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install libwebkit2gtk-4.0-dev \
       build-essential \
       curl \
       wget \
       libssl-dev \
       libgtk-3-dev \
       libayatana-appindicator3-dev \
       librsvg2-dev
   ```

   **For macOS:**
   ```bash
   # Install Xcode Command Line Tools
   xcode-select --install
   ```

   **For Windows:**
   - Install [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - Install [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

## What it Does

The command performs the following actions:

1. **Checks Prerequisites**
   - Verifies Rust and Cargo installation
   - Checks system dependencies
   - Validates Next.js project structure

2. **Installs Dependencies**
   - Installs Tauri CLI
   - Adds necessary dependencies
   - Updates package.json

3. **Configures Next.js**
   - Updates next.config.mjs for static export
   - Configures asset prefixes
   - Sets up build output

4. **Initializes Tauri**
   - Creates src-tauri directory
   - Sets up Rust project
   - Configures Tauri settings

5. **Updates Configuration**
   - Configures build commands
   - Sets up frontend paths
   - Adds development scripts

## Example

```bash
# Convert to Tauri app
npx create-jaseci-app taurify

# Using yarn
npx create-jaseci-app taurify --package-manager yarn
```

## After Taurification

After running the command:

1. **Development**
   ```bash
   # Start development
   npm run tauri dev
   ```

2. **Building**
   ```bash
   # Build for production
   npm run tauri build
   ```

## Project Structure

```
my-app/
├── src/                # Next.js source
├── src-tauri/         # Tauri source
│   ├── src/          # Rust source
│   ├── Cargo.toml    # Rust dependencies
│   └── tauri.conf.json # Tauri configuration
├── next.config.mjs    # Updated Next.js config
└── package.json      # Updated scripts
```

## Best Practices

1. **Development**
   - Use `npm run tauri dev` for development
   - Test on all target platforms
   - Follow Tauri security guidelines

2. **Building**
   - Test production builds
   - Sign your applications
   - Follow platform guidelines

3. **Performance**
   - Optimize bundle size
   - Use proper asset loading
   - Follow Tauri best practices

## Troubleshooting

### Common Issues

1. **Prerequisites Missing**
   - Check Rust installation
   - Verify system dependencies
   - Check platform requirements

2. **Build Failures**
   - Check error messages
   - Verify dependencies
   - Check platform compatibility

3. **Runtime Issues**
   - Check console output
   - Verify permissions
   - Check platform support

### Getting Help

If you encounter any issues:
1. Check the [Tauri documentation](https://tauri.app/v2/guides/)
2. Search [existing issues](https://github.com/Jaseci-Labs/JaseciForge/issues)
3. Create a new issue if needed 