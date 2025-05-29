# Changelog

All notable changes to `create-jaseci-app` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.26] - 2025-05-29

###fixed
- fix add-node plural items
- fix add-node wrong custom hook asppSelctor

## [0.1.25] - 2025-05-29

###fixed
- fix add-module bugs
- fix add-node bugs

## [0.1.24] - 2025-05-28

###fixed
- create app flags as booelans

## [0.1.22] - 2025-05-28
- Added multi-node support for `add-module` and `add-node` CLI tools.
- Enhanced `create-app` CLI and VS Code extension:
  - Now accepts `--storybook`, `--testinglibrary`, and `--package-manager` as parameters.
  - VS Code extension prompts for these options and passes them as CLI flags.
- Improved documentation for new CLI options and non-interactive usage.

## [0.1.21] - 2025-05
### Added
- New `taurify` command to convert Next.js apps to Tauri desktop applications
  - Automatic prerequisite checking
  - Platform-specific dependency validation
  - Next.js configuration updates
  - Tauri initialization and setup
- New `cleanup` command to remove example task manager app
  - Removes example module and files
  - Creates clean home page
  - Cleans up store configuration
- Project root validation for all commands
  - Ensures commands are run in valid JaseciStack projects
  - Validates package.json existence
  - Provides clear error messages

### Changed
- Refactored CLI commands into modular structure
  - Separated command implementations into individual files
  - Improved code organization and maintainability
  - Enhanced error handling and validation
- Updated documentation structure
  - Created separate documentation files for each command
  - Added detailed CLI tools section
  - Improved command usage examples
  - Added comprehensive prerequisites and troubleshooting guides

### Fixed
- Improved command validation and error handling
- Enhanced documentation clarity and organization
- Updated command examples and usage instructions

## [0.1.20] - 2025-05-09
### Added
- Comprehensive tutorial documentation:
  - Step-by-step guide for building a complete module
  - Detailed explanation of each layer (Service, Data, Presentation)
  - Best practices for module development
  - Template customization guide
  - UI implementation using Atomic Design
- Enhanced module creation documentation:
  - Clear examples of module parameters
  - Detailed explanation of generated structure
  - Best practices for module customization
- Added summary guide:
  - Complete overview of the development process
  - Best practices for each layer
  - Performance optimization tips
  - Next steps for further development

### Changed
- Updated documentation structure for better clarity
- Improved examples in module creation guide
- Enhanced template documentation with practical examples

### Fixed
- Fixed documentation inconsistencies
- Updated outdated examples
- Corrected module creation parameters documentation

## [0.1.19] - 2025-05-08
### Added
- New `add-module` command for rapid module creation
  - Creates complete module structure with actions, hooks, pages, schemas, services, and utils
  - Generates Redux slice with proper state management
  - Sets up Next.js route with layout and page components
  - Adds TypeScript interfaces and Zod validation schemas
  - Integrates with design system components
- Module creation options:
  - `--node`: Custom node name for the module
  - `--path`: Custom route path (supports nested routes and route groups)
- Documentation updates:
  - Added module creation examples to README
  - Updated project structure documentation
  - Added module system to features list

## [0.1.17]

### Added
- Added comprehensive documentation for service layer
  - Clear explanation of service abstraction pattern
  - Examples of module-specific services
  - Integration with core layer
  - Best practices for service implementation
- Added comprehensive documentation for data layer
  - Clear flow from nodes to store to actions
  - Examples of entity definitions
  - Integration with service layer
  - Best practices for state management
- Added golden rules section to README
  - Rule about exposing third-party libraries through _core
  - Examples of proper abstraction patterns
  - Best practices for core layer usage

### Changed
- Updated service layer documentation
  - Restructured to show module-specific services
  - Added examples of service abstraction
  - Improved integration patterns
- Updated data layer documentation
  - Added clear data flow explanation
  - Improved examples of Redux integration
  - Added best practices section
- Updated README
  - Added golden rules section
  - Improved architecture documentation
  - Added more examples

### Fixed
- Fixed service layer documentation to reflect actual architecture
- Fixed data layer documentation to show correct flow
- Fixed README to include core layer abstraction rules

## [0.1.16]
### Added
- Comprehensive architecture documentation in README.md
  - Three-layer architecture (Presentation, Data, Service)
  - Core infrastructure (`_core`) documentation
  - Module structure and responsibilities
  - Design System integration
  - Type safety with node definitions
- Detailed "How To" guide for feature development
  - Step-by-step guide from node types to UI
  - Complete flow from service to presentation layer
  - Type safety and best practices
  - Integration patterns and examples
- Module structure documentation
  - Actions and async thunks
  - Custom hooks and data flow
  - Schema validation
  - Service layer integration
- Redux implementation guide
  - Type-safe actions and reducers
  - Async thunk patterns
  - State management best practices
  - Custom hooks integration

## [0.1.15] - 2025-04-09
### Fixed
- fix auth token in walker_api interceptor

## [0.1.14] - 2025-04-08
### Fixed
- protected routes

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

## [0.1.0] - 2024-03-20
### Added
- Initial project setup
- Basic project structure
- Core documentation
- Architecture overview
- Layer documentation
- Feature documentation
- Testing documentation
- Storybook documentation

### Fixed
- Resolved `inquirer.prompt` error by switching to `@inquirer/prompts` for modern prompt handling.

### Notes
- This is the first release, completing Milestone 1.
- The CLI is not yet published to npm; use `npm link` for local testing.