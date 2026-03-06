AI Usage Documentation

This document tracks the usage of AI tools (MCPs, prompts, etc.) during the development of this project, as required for transparency.

## Tools Used

- **AI Agent:** Factory Droid (Gemini 3.1 Pro High)
- **Environment:** Interactive CLI tool

## Log of AI Usage

| Date       | Task                  | Prompt/Action                                                                          | MCP/Tools Used                                         |
| ---------- | --------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 2026-03-06 | Initial Documentation | Created initial `README.md` and `AI_USAGE.md` structure based on project requirements. | `Execute` (shell command to create files), `TodoWrite` |
| 2026-03-06 | Backend Setup | Received prompt to generate Laravel 12 API with PostgreSQL schema (Users, Projects, Categories, Tasks) using Sanctum PAT and soft deletes. | `TodoWrite`, `LS`, `Execute` |
| 2026-03-06 | Backend Controllers & Routes | Implemented AuthController (login/logout/me), ProjectController (CRU + search), TaskController (CRUD + soft delete with deleted_by), DashboardController (stats + upcoming tasks). Defined all API routes in routes/api.php. | `Execute`, `Edit`, `Read` |
| 2026-03-06 | Seeders | Created CategorySeeder (Todo, InProgress, Testing, Done, Pending) and AdminUserSeeder (`admin@energeek.co.id`). | `Execute` |
| 2026-03-06 | Backend Tests | Wrote PHPUnit AuthTest covering login success, login failure, and logout. All 3 tests pass. | `Execute` |
| 2026-03-06 | Eloquent Models | Prompted to generate User, Project, Task, Category models with relationships (projectsCreated, tasksCreated, tasksDeleted, creator, tasks, project, category, deletedBy). Task uses SoftDeletes. | `Execute`, `Read` |
| 2026-03-06 | API Routes | Added missing GET `/projects/{project}/tasks` nested route — added it and updated `TaskController@index` to accept optional Project binding for nested route handling. | `Edit`, `Read`, `Execute` |
| 2026-03-06 | Frontend Axios Service | Generated src/services/api.ts with Axios instance, request interceptor for Bearer token from localStorage, and response interceptor for 401 errors. | `Execute` |
| 2026-03-06 | Frontend Pinia Store (Auth) | Generated src/stores/auth.ts using Composition API, managing token and user state. | `Execute` |
| 2026-03-06 | Frontend Vue Router | Generated src/routes/index.ts with routes and authentication guards. | `Execute` |
| 2026-03-06 | Frontend Pinia Store (Project) | Generated src/stores/project.ts. Manages projects, tasks, categories state with actions for fetching, creating, updating, and deleting. | `Execute` |
| 2026-03-06 | Frontend Vitest Tests | Set up Vitest in vite.config.ts, created vitest.setup.ts with localStorage mock. Wrote first test for BaseButton.vue and Login.vue. | `Execute` |
| 2026-03-06 | Docker Compose Setup | Generated docker-compose.yml for setting up Laravel backend, Vue frontend, PostgreSQL, and pgAdmin. | `Execute` |
| 2026-03-06 | Frontend Headless UI + TailwindCSS | Completely rewrote all frontend components (`AppLayout.vue`, `BaseButton.vue`, `BaseInput.vue`, `BaseModal.vue`, etc.) and views (`Login.vue`, `Dashboard.vue`, `ProjectList.vue`, `ProjectDetail.vue`) to use Headless UI and TailwindCSS v4. Added ESM PostCSS support. | `Read`, `WriteFile`, `Execute` |
| 2026-03-06 | Backend Project Tasks Count | Modified `ProjectController@index` to eager load tasks count for each project. | `Edit` |

_(This table will be updated continuously as the project progresses.)_
