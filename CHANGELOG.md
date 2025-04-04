# Changelog

All notable changes to `create-jaseci-app` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Planned
- Add scope selection for Front-End, Back-End, and Full-Stack (Milestone 3)
- Add email authentication and SSO support (Milestone 2)
- Add WebSocket support for real-time features (Milestone 4)
- Final polish and npm release (Milestone 5)

## [0.1.13] - 2025-04-02
### Fixed
- add .env.exampele

## [0.1.12] - 2025-04-02
### Fixed
- update API endpoints to POST in template

## [0.1.11] - 2025-04-02
### Added
- Introduced a Profile section for user-related features
- User action-related functionalities

## [0.1.10] - 2025-03-26
### Added
- Remove `ds/stories` and `.storybook` folders from the generated project if Storybook is not selected.
- Updated the generated project template to follow a modular structure with well-defined boundaries:
  - Added `_core` folder for shared utilities, hooks, and API client.
  - Organized business logic into `modules` (e.g., `tasks`, `users`) with hooks, pages, and services.
  - Added `nodes` for data models (e.g., `task-node.ts`, `user-node.ts`).
  - Moved state management to a dedicated `store` folder with Redux Toolkit slices.
  - Maintained Atomic Design in `ds` (design system) for UI components.
  - Add reuable templates
  - Add basic autnetication
  - Add proper organization
  
## [0.1.9] - 2025-03-26
### Added
- Renamed `components` folder to `ds` (design system) in the generated project template for better clarity.

## [0.1.8] - 2025-03-26
### Changed
- Simplified `README.md` for npm with minimal documentation.

## [0.1.7] - 2025-03-26
### Added
- Enhanced `README.md` for npm with professional documentation, badges, and detailed sections.

## [0.1.6] - 2025-03-26
### Added
- Added automatic Storybook upgrade (`storybook@latest upgrade`) after initialization to ensure the latest version is used.

## [0.1.5] - 2025-03-26
### Added
- Improved CLI output and generated `README.md` with clearer instructions for navigating to the created project directory.

## [0.1.4] - 2025-03-26
### Fixed
- Resolved CLI hanging during Storybook initialization by using `--no-open` flag to prevent dev server from starting.

## [0.1.3] - 2025-03-26
### Fixed
- Resolved Storybook `.mdx` compatibility issue by enabling `storyStoreV7` in the configuration.

## [0.1.2] - 2025-03-26
### Added
- Automatic Storybook initialization when Storybook is selected.

### Fixed
- Resolved dependency collisions in generated `package.json` by correctly merging Storybook and React Testing Library into `devDependencies`.
- Updated Storybook dependencies to `^7.6.17` to avoid deprecated packages.

## [0.1.1] - 2025-03-26
### Added
- Automatic dependency installation as part of the CLI execution.
- Prompt for selecting package manager (npm, yarn, pnpm).

## [0.1.0] - 2025-03-26
### Added
- Initial release of `create-jaseci-app` CLI tool.
- Front-End template generation with:
  - Atomic Design structure (`atoms/`, `molecules/`, `organisms/`, `templates/`).
  - Redux Toolkit for state management.
  - ShadCN UI-ready setup (requires manual initialization).
  - Pre-configured VS Code settings (`.vscode/settings.json`).
- Interactive prompts for optional features:
  - Storybook for component development.
  - React Testing Library for testing.
- "TaskForge" demo app as a starter:
  - Simple task manager with add and toggle functionality.
  - Demonstrates Atomic Design, Redux Toolkit, and optional Storybook/Testing.
- Basic README with setup instructions.

### Fixed
- Resolved `inquirer.prompt` error by switching to `@inquirer/prompts` for modern prompt handling.

### Notes
- This is the first release, completing Milestone 1.
- The CLI is not yet published to npm; use `npm link` for local testing.