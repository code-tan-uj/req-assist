# req-ease (ResearchHub) — Project Documentation

Last updated: 2026-02-23

## One-line summary
req-ease (a.k.a ResearchHub) wraps a user-story creation platform called Req-ease into a research-agent toolkit that helps product and engineering teams generate, refine, organize, and persist research, requirements, and user stories via an interactive chat/research UI, knowledge base (KB), and workspace/project management features.

## Purpose and goals
- Enable fast generation of research artifacts (market overviews, competitive analysis, executive summaries) from natural-language prompts.
- Keep research tied to project contexts and persisted into a Knowledge Base (KB) for re-use in user stories / requirements generation (Req-ease integration).
- Provide collaborative project and workspace management primitives (tasks, versions, files, sharing).
- Offer a conversational research agent UI with command palette, file analysis, and AI-assisted sections that can be converted into tasks or KB entries.

## High-level architecture
- Frontend: Next.js (app router) + React + TypeScript. UI uses Tailwind CSS and Framer Motion for animated components. Heroicons provide SVG icons.
- State / KB: Local in-repo helper `src/lib/kb-store.tsx` (and context hooks) manage knowledge base CRUD and recent items. The KB is wired into modals and task flows.
- Pages & Components: Implemented under `src/app` with an `app`-level layout and per-route pages (project, project creation, workspace, login, kb, etc.). Many UI bits live under `src/app/*/components` and global UI under `src/components`.
- AI / Agent: The UI orchestrates research generation cycles (mocked in the current code) that produce structured `ResearchSection[]` which can be persisted to KB, converted into tasks, exported, or shared.
- Integrations (conceptual): Req-ease (user story generation), AI provider (OpenAI/Gemini/Claude/etc.), storage/back-end (optional, currently mocked/local). The repository scaffolds the UX to call out to these integrations.

ASCII diagram (simplified):

User Browser
  └─ Next.js (React UI) ──> KB Store (local) ──> Req-ease (user-stories) & AI Provider
                           └─ Workspaces / Projects / Files / Tasks


## Main features (detailed)
1. Conversational Research Agent
   - Chat input with slash-command palette and intelligent command filtering.
   - Staged "research generation" flow with visual steps and progress (analyzing, gathering data, executive summary...).
   - Generated research returned as structured sections with title/icon/content and expandable panels.
   - Buttons to convert sections into tasks, add to KB, or expand/collapse content.

2. Knowledge Base (KB)
   - Add generated sections or manually created entries to a KB via modal flows.
   - KB items are reachable from the project UI, and the app exposes helpers (`useKB`) to add/retrieve items.
   - KB items can be used as source content for Req-ease user-story generation (integration point).

3. Project & Workspace Management
   - Projects: Per-project page UX (project title, status, config, share/export actions).
   - Workspaces: Add chats and research into named workspaces. Workspace modal shows existing workspaces and lets you add chats or change contexts.
   - Tasks: Create tasks linked to research sections; tasks have priority, assignee, deadline, and progress. Tasks are displayed in a right-hand side panel grouped by status.
   - Versions: Simple version list for project snapshots (mocked versioning UI).

4. Files & Document Analysis
   - Upload files and trigger an "Analyze" action that converts file input into research queries and starts the research generation flow.
   - File metadata UI and actions in the side panel.

5. Collaboration & Sharing
   - Share modal and export modal to disseminate research or exported artifacts.
   - Activity feed records events like "Added to KB", "Task completed", etc.

6. Command Palette & Quick Actions
   - Slash-command palette with categories, keyboard navigation (ArrowUp/Down, Enter) and selection.
   - Quick actions in sidebar: New Chat, Search Chats, Add Chats to Workspace.

7. UI/UX Details
   - Animated transitions via Framer Motion (modals, side panels, command palette).
   - Tailwind utilities and glass-panel/glass-card styling for consistent theme look.
   - Responsive left sidebar (collapsible) and right-hand contextual side panel.


## Important files & folders (what they contain)
- `src/app/layout.tsx` — App layout and global structure.
- `src/app/project/[id]/page.tsx` — Primary project interface (chat/research agent, side panels, modals). This file contains the bulk of UI logic and mock flows.
- `src/app/project-creation/*` — Project creation screens and components (chat interface, create project modal, sidebar components).
- `src/app/workspace/*` — Workspace listing and workspace-specific pages/components.
- `src/app/kb/[id]/page.tsx` — Knowledge Base view (per item).
- `src/components/*` — Shared UI components (Header, Footer, Navbar, AppIcon, AppImage).
- `src/contexts/ThemeContext.tsx` — Theme handling and CSS variable usage.
- `src/lib/kb-store.tsx` — Lightweight KB store hook & API for adding/retrieving KB items.
- `src/styles/*` — Tailwind base and custom CSS.
- `public/assets/images` — Placeholder and UI images.


## Data shapes & contracts (observed from code)
- Message
  - id: string
  - role: 'user' | 'ai'
  - content: string
  - timestamp: Date
  - sections?: ResearchSection[]

- ResearchSection
  - id: string
  - title: string
  - content: string
  - icon?: string
  - isExpanded?: boolean

- Task
  - id: string
  - title: string
  - status: 'todo'|'in-progress'|'review'|'done'
  - priority: 'low'|'medium'|'high'
  - assignee: string
  - deadline: string
  - linkedSection?: string
  - progress?: number

- KB Item (conceptual; seen via addKBItem usage)
  - applicationName, categoryDomain, moduleSubDomain, functionalComponent, sections: { overview, functionalRequirements, technicalDetails, businessRules }


## How req-ease wraps Req-ease (integration points)
- Purpose: Req-ease is the dedicated user-story creation engine; req-ease provides research harvesting and context enrichment to feed Req-ease with strong inputs.
- Expected flow:
  1. User prompts research in req-ease (chat or file analysis).
  2. Generated research sections are curated and added to KB.
  3. KB items or selected sections are passed to Req-ease endpoints (or CLI) to generate user stories, acceptance criteria, and grooming artifacts.
  4. Generated user stories can be attached to tasks in req-ease and included in project exports.
- Implementation note: The repo currently mocks AI generation flows and local KB operations. Adding Req-ease integration will require:
  - API client or SDK for Req-ease.
  - Mapping functions to transform ResearchSection/KB item into Req-ease request payloads.
  - Auth and secure storage for Req-ease API keys.


## Setup & development (assumptions)
Assumptions:
- The project is a Next.js + TypeScript app (app router). Node 18+ is recommended.
- AI provider keys (OpenAI/Gemini/Claude) are not embedded. The code currently uses mocked generation; wire an AI client via environment variables.

Quick start (macOS / zsh):

1. Install dependencies

```bash
# from repository root
npm install
```

2. Run dev server

```bash
npm run dev
# or the project's start script (e.g. next dev)
```

3. Environment variables to add (recommended)
- NEXT_PUBLIC_AI_PROVIDER (optional)
- OPENAI_API_KEY or AI_API_KEY (if integrating OpenAI/Gemini)
- REQ_EASE_API_KEY (if integrating Req-ease service)


## Extending / connecting real backends
- Replace mocks with real API calls in `src/app/project/[id]/page.tsx` where `startResearchGeneration` runs (hook into real LLM stream or async jobs).
- Replace `useKB` store in `src/lib/kb-store.tsx` with a persistent backend service (Postgres, Fauna, or an internal API).
- Add authorization (NextAuth / Auth0) in `src/app` to enable multi-user collaboration.
- Implement Req-ease client library and add an "Export to Req-ease" action on KB items or Research Sections.


## Tests & quality gates
- No tests found in the current code snapshot. Recommended:
  - Unit tests for KB store and helper utilities (Jest + React Testing Library).
  - E2E tests for core user flows (Cypress / Playwright): creating research, adding to KB, generating tasks, exporting.
  - Linting/Formatting: ESLint + Prettier. CI should run build, lint, test.


## Security & privacy considerations
- AI prompts and KB content can contain sensitive data. Ensure:
  - API keys are stored in secure environment variables and not committed.
  - If persisting KB to a cloud backend, encrypt at rest and apply strict RBAC.
  - Add audit logs for KB modifications and sharing actions.


## Roadmap / recommended next steps
1. Wire a real LLM provider and change `startResearchGeneration` to call the streaming API.
2. Implement persistent KB (API + DB) and migrate `useKB` to a server-backed implementation.
3. Add Req-ease integration (API client + mapping). Expose "Generate User Stories" button on KB items.
4. Add authentication & multi-user support.
5. Add tests and CI pipeline (build, lint, unit, e2e).
6. Add telemetry and usage analytics (opt-in) to track generation quality and cost.


## Troubleshooting
- If UI build fails: ensure Node >= 18 and that `npm install` finished. Look for missing Tailwind or PostCSS configs.
- If AI calls time out: check env var and provider rate limits.


## Contribution & code style
- TypeScript + React functional components with hooks.
- Tailwind utility classes for styling; keep components small and reusable.
- Add unit tests for new logic. Follow existing file/folder naming conventions.


## Appendix: Quick mapping of important UI flows to code locations
- Chat + research generation: `src/app/project/[id]/page.tsx` — core
- KB store & helpers: `src/lib/kb-store.tsx`
- Modals: inline components in `page.tsx` (ConfigurationModal, CreateTaskModal, ShareModal, ExportModal)
- Side panels & tasks: right-hand panel in `page.tsx` (sidePanelTab logic)
- Navbar & global UI: `src/components/common/Navbar.tsx`, `src/components/common/Header.tsx`


---

## Requirements coverage checklist
- Create comprehensive documentation describing the project and its purpose: Done
- Chart down detailed features and other tools in the project: Done (Features section + file map)
- Use the complete repo to inform documentation: Done (based on code in `src/app` and provided file excerpts). Assumptions noted where necessary.
- Produce output as an `.md` file in repo root: Done — `PROJECT_DOCUMENTATION_Req-Ease.md`.

Notes & assumptions:
- Some integrations (Req-ease API, LLM provider) are not implemented in the repo snapshot; where appropriate I noted how to wire them and required env vars.
- If you want, I can: (1) add an `INTEGRATION_GUIDE.md` that contains sample Req-ease API payloads and client code stubs, (2) implement a persistent KB API sketch, or (3) wire a demo OpenAI/Gemini client into the research flow.


