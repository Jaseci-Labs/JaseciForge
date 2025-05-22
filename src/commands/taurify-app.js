const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");
const { confirm } = require("@inquirer/prompts");
const os = require("os");

async function taurifyApp(options) {
  const targetDir = process.cwd();
  // Detect package manager based on lock files
  let packageManager = "npm";
  if (fs.existsSync(path.join(targetDir, "yarn.lock"))) {
    packageManager = "yarn";
  } else if (fs.existsSync(path.join(targetDir, "pnpm-lock.yaml"))) {
    packageManager = "pnpm";
  }

  console.log(
    "🚀 Converting your Next.js app to a Tauri desktop application..."
  );

  // Check if we're in a Next.js project
  const packageJsonPath = path.join(targetDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    console.error(
      "❌ No package.json found. Make sure you're in a Next.js project directory."
    );
    process.exit(1);
  }

  const packageJson = require(packageJsonPath);
  if (!packageJson.dependencies?.next) {
    console.error("❌ This doesn't appear to be a Next.js project.");
    process.exit(1);
  }

  // Check for Tauri prerequisites
  try {
    console.log("🔍 Checking Tauri prerequisites...");
    execSync("rustc --version", { stdio: "ignore" });
    execSync("cargo --version", { stdio: "ignore" });
  } catch (error) {
    console.error("❌ Rust and Cargo are required to build Tauri apps.");
    console.error("Please install Rust from https://rustup.rs/");
    console.error(
      "For more detailed instructions, visit: https://v2.tauri.app/start/prerequisites/"
    );
    process.exit(1);
  }

  // Check for system dependencies based on platform
  const platform = os.platform();
  console.log(`🔍 Checking system dependencies for ${platform}...`);

  if (platform === "linux") {
    // Check for pkg-config
    try {
      execSync("pkg-config --version", { stdio: "ignore" });
    } catch (error) {
      console.error("❌ pkg-config is required but not installed.");
      console.error("Please install it using your package manager:");
      console.error("  Ubuntu/Debian: sudo apt install pkg-config");
      console.error("  Fedora: sudo dnf install pkgconfig");
      console.error("  Arch Linux: sudo pacman -S pkg-config");
      console.error(
        "For more detailed instructions, visit: https://v2.tauri.app/start/prerequisites/"
      );
      process.exit(1);
    }

    // Check for GTK and related dependencies
    const gtkDeps = [
      { name: "gtk+-3.0", package: "libgtk-3-dev" },
      { name: "webkit2gtk-4.0", package: "libwebkit2gtk-4.0-dev" },
      { name: "appindicator3-0.1", package: "libappindicator3-dev" },
    ];

    for (const dep of gtkDeps) {
      try {
        execSync(`pkg-config --libs --cflags ${dep.name}`, { stdio: "ignore" });
      } catch (error) {
        console.error(
          `❌ ${dep.name} development files are required but not installed.`
        );
        console.error("Please install them using your package manager:");
        console.error("  Ubuntu/Debian: sudo apt install " + dep.package);
        console.error(
          "  Fedora: sudo dnf install " + dep.package.replace("dev", "devel")
        );
        console.error(
          "  Arch Linux: sudo pacman -S " + dep.package.replace("dev", "")
        );
        console.error(
          "For more detailed instructions, visit: https://v2.tauri.app/start/prerequisites/"
        );
        process.exit(1);
      }
    }
  } else if (platform === "darwin") {
    // macOS
    try {
      execSync("xcode-select -p", { stdio: "ignore" });
    } catch (error) {
      console.error(
        "❌ Xcode Command Line Tools are required but not installed."
      );
      console.error("Please install them by running:");
      console.error("  xcode-select --install");
      console.error(
        "For more detailed instructions, visit: https://v2.tauri.app/start/prerequisites/"
      );
      process.exit(1);
    }
  } else if (platform === "win32") {
    // Windows
    try {
      // Check for Visual Studio Build Tools
      execSync("where cl.exe", { stdio: "ignore" });
    } catch (error) {
      console.error(
        "❌ Visual Studio Build Tools are required but not installed."
      );
      console.error("Please install them by:");
      console.error(
        "1. Download Visual Studio Build Tools from: https://visualstudio.microsoft.com/visual-cpp-build-tools/"
      );
      console.error(
        "2. Run the installer and select 'Desktop development with C++'"
      );
      console.error("3. Restart your terminal after installation");
      console.error(
        "For more detailed instructions, visit: https://v2.tauri.app/start/prerequisites/"
      );
      process.exit(1);
    }

    try {
      // Check for WebView2
      execSync(
        'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\EdgeUpdate\\Clients\\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"',
        { stdio: "ignore" }
      );
    } catch (error) {
      console.error(
        "❌ Microsoft Edge WebView2 Runtime is required but not installed."
      );
      console.error(
        "Please install it from: https://developer.microsoft.com/en-us/microsoft-edge/webview2/"
      );
      console.error(
        "Note: WebView2 is pre-installed on Windows 10 (1803+) and later versions."
      );
      console.error(
        "For more detailed instructions, visit: https://v2.tauri.app/start/prerequisites/"
      );
      process.exit(1);
    }
  }

  // Install Tauri CLI
  console.log("📦 Installing Tauri CLI...");
  try {
    if (packageManager === "npm") {
      execSync(
        `${packageManager} install @tauri-apps/cli --save-dev --legacy-peer-deps`,
        {
          stdio: "inherit",
        }
      );
    } else {
      execSync(`${packageManager} add @tauri-apps/cli --dev`, {
        stdio: "inherit",
      });
    }
  } catch (error) {
    console.error("❌ Failed to install Tauri CLI");
    process.exit(1);
  }

  // Update Next.js configuration
  console.log("⚙️ Updating Next.js configuration...");
  const nextConfigPath = path.join(targetDir, "next.config.mjs");
  const nextConfig = `const isProd = process.env.NODE_ENV === 'production';
const internalHost = process.env.TAURI_DEV_HOST || 'localhost';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Next.js uses SSG instead of SSR
  output: 'export',
  // Note: This feature is required to use the Next.js Image component in SSG mode.
  images: {
    unoptimized: true,
  },
  // Configure assetPrefix or else the server won't properly resolve your assets.
  assetPrefix: isProd ? undefined : \`http://\${internalHost}:3000\`,
};

export default nextConfig;`;

  try {
    await fs.writeFile(nextConfigPath, nextConfig);
    console.log("✓ Updated next.config.mjs");
  } catch (error) {
    console.error("❌ Failed to update Next.js configuration:", error.message);
    process.exit(1);
  }

  // Initialize Tauri
  console.log("🚀 Initializing Tauri...");
  try {
    execSync("npx @tauri-apps/cli init", { stdio: "inherit" });
  } catch (error) {
    console.error("❌ Failed to initialize Tauri");
    process.exit(1);
  }

  // Update Tauri configuration
  console.log("⚙️ Updating Tauri configuration...");
  const tauriConfigPath = path.join(targetDir, "src-tauri", "tauri.conf.json");
  const tauriConfig = {
    build: {
      beforeDevCommand: `${packageManager} run dev`,
      beforeBuildCommand: `${packageManager} run build`,
      devUrl: "http://localhost:3000",
      frontendDist: "../out",
    },
    identifier: "com.jaseci.app",
    productName: packageJson.name || "Jaseci App",
    version: packageJson.version || "0.1.0",
    app: {
      windows: [
        {
          title: packageJson.name || "Jaseci App",
          width: 1024,
          height: 768,
          resizable: true,
          fullscreen: false,
        },
      ],
    },
  };

  try {
    await fs.writeJson(tauriConfigPath, tauriConfig, { spaces: 2 });
    console.log("✓ Updated tauri.conf.json");
  } catch (error) {
    console.error("❌ Failed to update Tauri configuration:", error.message);
    process.exit(1);
  }

  // Update package.json scripts
  console.log("📝 Updating package.json scripts...");
  packageJson.scripts = {
    ...packageJson.scripts,
    tauri: "tauri",
  };

  try {
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    console.log("✓ Updated package.json scripts");
  } catch (error) {
    console.error("❌ Failed to update package.json:", error.message);
    process.exit(1);
  }

  console.log(
    "\n✨ Tauri setup complete! Your app is now ready for desktop development."
  );
  console.log("\nNext steps:");
  console.log("1. Start development:");
  console.log(`   ${packageManager} run tauri dev`);
  console.log("2. Build for production:");
  console.log(`   ${packageManager} run tauri build`);
}

module.exports = taurifyApp;
