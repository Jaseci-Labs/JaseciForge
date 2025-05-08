# Changelog

All notable changes to `create-jaseci-app` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).



### Planned
- Add scope selection for Front-End, Back-End, and Full-Stack (Milestone 3)
- Add email authentication and SSO support (Milestone 2)
- Add WebSocket support for real-time features (Milestone 4)
- Final polish and npm release (Milestone 5)

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