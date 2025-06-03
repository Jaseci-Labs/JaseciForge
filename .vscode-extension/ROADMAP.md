# Jaseci Forge VS Code Extension - Roadmap

## Cursor-like Interactive Assistant Experience

### Goal
Create an interactive, AI-powered assistant in the VS Code extension sidebar that helps users manage modules and nodes, detects issues, suggests or auto-applies fixes, and guides users conversationally—similar to the Cursor experience.

---

## Phase 1: Foundation
- [ ] **Sidebar Webview**: Implement a custom sidebar using VS Code's Webview API for a chat/assistant interface.
- [ ] **Command Integration**: Allow users to trigger the assistant via sidebar or command palette.
- [ ] **Module/File Scanner**: Build Node.js/TypeScript utilities to scan project structure, detect missing or broken files (services, actions, reducers, hooks, etc.).
- [ ] **Issue Reporting**: Display detected issues in the sidebar with clear, actionable messages.

## Phase 2: Interactive Fixes
- [ ] **Fix Suggestions**: For each detected issue, provide "Fix" and "Explain" buttons.
- [ ] **Auto-fix Actions**: Implement logic to auto-generate or repair files, update imports, and register reducers as needed.
- [ ] **Feedback Loop**: After each fix, show confirmation and update the issue list.

## Phase 3: Conversational Guidance
- [ ] **Chat-like UI**: Enable users to type questions or commands (e.g., "Fix my module", "What's missing?").
- [ ] **Conversational Flow**: Guide users step-by-step through fixes, offering explanations and next steps.
- [ ] **History & Undo**: Allow users to view past actions and undo fixes if needed.

## Phase 4: AI/LLM Integration (Optional/Advanced)
- [ ] **Integrate LLM API**: Use an AI model (e.g., OpenAI, local LLM) to provide smart suggestions, explanations, and code generation.
- [ ] **Natural Language Understanding**: Allow users to interact with the assistant using natural language.
- [ ] **Context Awareness**: Make the assistant aware of project context for more relevant help.

## Phase 5: Polish & Release
- [ ] **User Testing**: Gather feedback from real users and iterate on UX.
- [ ] **Documentation**: Update README and DEVELOPER.md with usage and contribution guidelines.
- [ ] **Marketplace Release**: Publish the enhanced extension to the VS Code Marketplace.

---

**Vision:**
Empower developers with an intelligent, interactive assistant that streamlines module/node management, reduces manual errors, and makes working with Jaseci Forge in VS Code a delightful experience.

1. Live debuging for JaseciForge, see logs in the vscode extension iteslef as well