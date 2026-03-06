AI Usage Documentation

This document tracks the usage of AI tools (MCPs, prompts, etc.) during the development of this project, as required for transparency.

## Tools Used

- **AI Agent:** Factory Droid (Gemini 3.1 Pro High)
- **Environment:** Interactive CLI tool

## Log of AI Usage

| Date       | Task                  | Prompt/Action                                                                          | MCP/Tools Used                                         |
| ---------- | --------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 2026-03-06 | Initial Documentation | Created initial `README.md` and `AI_USAGE.md` structure based on project requirements. | `Execute` (shell command to create files), `TodoWrite` |

_(This table will be updated continuously as the project progresses.)_

| 2026-03-06 | Backend Setup | Received prompt to generate Laravel 12 API with PostgreSQL schema (Users, Projects, Categories, Tasks) using Sanctum PAT and soft deletes. | `TodoWrite`, `LS`, `Execute` |

| 2026-03-06 | Backend Controllers & Routes | Implemented AuthController (login/logout/me), ProjectController (CRU + search), TaskController (CRUD + soft delete with deleted_by), DashboardController (stats + upcoming tasks). Defined all API routes in routes/api.php. | `Execute`, `Edit`, `Read` |
| 2026-03-06 | Seeders | Created CategorySeeder (Todo, InProgress, Testing, Done, Pending) and AdminUserSeeder (<admin@energeek.co.id>). | `Execute` |
| 2026-03-06 | Backend Tests | Wrote PHPUnit AuthTest covering login success, login failure, and logout. All 3 tests pass. | `Execute` |

| 2026-03-06 | Eloquent Models | Prompted to generate User, Project, Task, Category models with relationships (projectsCreated, tasksCreated, tasksDeleted, creator, tasks, project, category, deletedBy). Task uses SoftDeletes. All models already implemented in previous step. | `Execute`, `Read` |

| 2026-03-06 | Seeders | Prompted to generate CategorySeeder (Todo, InProgress, Testing, Done, Pending) and AdminUserSeeder. Already implemented. Note: admin email in current code is <admin@energeek.co.id> — prompt requests <admin@admin.com>. | `Execute` |

| 2026-03-06 | AuthController | Prompted to generate AuthController with POST /api/login (email+password validation, Sanctum PAT) and POST /api/logout (revoke token). Already implemented using Auth::attempt + createToken. | `Execute` |

| 2026-03-06 | ProjectController | Prompted to generate ProjectController with GET /api/projects (list + search by name), POST /api/projects (create), GET /api/projects/{id} (detail with tasks), PUT /api/projects/{id} (update). No delete endpoint. created_by from auth user. Already implemented. | `Execute` |

| 2026-03-06 | API Routes | Prompted to generate routes/api.php with all protected routes under Sanctum middleware. Was already implemented but missing GET /projects/{project}/tasks nested route — added it and updated TaskController@index to accept optional Project binding for nested route handling. | `Edit`, `Read`, `Execute` |

| 2026-03-06 | PHPUnit Feature Test | Prompted to generate AuthTest using RefreshDatabase — user can login with email/password and receive Sanctum token. Already implemented with 3 passing tests: login success, login failure (422 with field error), and logout. | `Execute` |

| 2026-03-06 | Frontend Axios Service | Generated src/services/api.ts with Axios instance, request interceptor for Bearer token from localStorage, and response interceptor for 401 errors. Included example API functions for authentication, projects, tasks, dashboard, and categories. Also created .env file for VITE_API_BASE_URL. | `Execute` |

| 2026-03-06 | Frontend Pinia Store (Auth) | Generated src/stores/auth.ts using Composition API, managing token and user state, with login/logout/fetchUser actions. Token stored in localStorage. Also configured main.ts to use Pinia and Vue Router. Added a basic App.vue and main.css. | `Execute` |

| 2026-03-06 | Frontend Vue Router | Generated src/routes/index.ts with routes (/login, /dashboard, /projects, /projects/:id) and authentication guards using Pinia auth store. Redirects unauthenticated users to login and authenticated users away from login. | `Execute` |

| 2026-03-06 | Frontend Login View | Generated src/views/Auth/Login.vue (Vue 3 Composition API). Features: email/password input, login button, calls auth store login(), shows validation errors, loading state, redirects to /dashboard. Includes basic styling. | `Execute` |

| 2026-03-06 | Frontend Types | Generated src/types/index.ts with TypeScript interfaces for User, Category, Project, and Task, reflecting the backend database schema and relationships. | `Execute` |

| 2026-03-06 | Frontend Pinia Store (Project) | Generated src/stores/project.ts. Manages projects, tasks, categories state with actions for fetching, creating, updating, and deleting. Utilizes the previously defined API service and TypeScript types. | `Execute` |

| 2026-03-06 | Frontend Views | Generated src/views/Dashboard.vue (displays stats and upcoming tasks), src/views/Project/ProjectList.vue (lists projects with search/filter, navigates to detail), and src/views/Project/ProjectDetail.vue (displays project details, Kanban board for tasks with D&D placeholders, edit/create buttons for tasks/project). Also created NotFound.vue placeholder. | `Execute` |

| 2026-03-06 | Frontend Views | Generated src/views/Dashboard.vue (displays stats and upcoming tasks), src/views/Project/ProjectList.vue (lists projects with search/filter, navigates to detail), and src/views/Project/ProjectDetail.vue (displays project details, Kanban board for tasks with D&D placeholders, edit/create buttons for tasks/project). Also created NotFound.vue placeholder. | `Execute` |

| 2026-03-06 | Frontend Reusable Components | Generated src/components/BaseButton.vue (reusable button with variants, loading state), src/components/BaseInput.vue (reusable input with label, error message), src/components/BaseModal.vue (reusable modal with teleport, escape key handling), src/components/Loader.vue (spinner with text), src/components/ProjectFormModal.vue (modal for project creation/editing), and src/components/TaskFormModal.vue (modal for task creation/editing). | `Execute` |

| 2026-03-06 | Frontend Vitest Tests | Set up Vitest in vite.config.ts, created vitest.setup.ts with localStorage mock. Wrote first test for BaseButton.vue (src/components/**tests**/BaseButton.spec.ts), testing rendering, variants, disabled state, and loading spinner. | `Execute` |

| 2026-03-06 | Frontend Vitest Tests Execution | Attempted to run Vitest frontend tests. Discovered missing "test" script in package.json. Added "test": "vitest" to package.json. | `Edit`, `Execute` |

| 2026-03-06 | Frontend Vitest Tests Execution | Fixed missing 'test' script in package.json and re-ran tests. Resolved import issues with @testing-library/vue and @testing-library/jest-dom by installing them and correcting vitest.setup.ts. All 6 tests in BaseButton.spec.ts passed. | `Execute` |

| 2026-03-06 | Docker Compose Setup | Generated docker-compose.yml for setting up Laravel backend, Vue frontend, PostgreSQL, and pgAdmin. Created energeek-be/Dockerfile and energeek-fe/Dockerfile for building the images. Also created nginx/nginx.conf to serve the frontend and proxy API requests to the backend. | `Execute` |

| 2026-03-06 | Frontend Dashboard View | Prompted to generate Dashboard.vue displaying data from /api/dashboard (total active projects, total unfinished tasks, tasks near due date). This view was already created in a previous step. | `Execute` |

| 2026-03-06 | Frontend Projects Page | Prompted to generate Projects page (src/views/Projects.vue) with project listing, search, create button, and navigation to project detail. This view was already created as src/views/Project/ProjectList.vue in a previous step. | `Execute` |

| 2026-03-06 | Frontend Project Detail Page | Prompted to generate Project Detail page (src/views/ProjectDetail.vue) with project detail fetching, tasks grouped by category (Kanban), and task CRUD operations using API categories. This view was already created as src/views/Project/ProjectDetail.vue in a previous step. | `Execute` |

| 2026-03-06 | Frontend Task Form Component | Prompted to generate a reusable Vue component for creating/editing tasks (title, description, due_date, category_id dropdown), emitting save/cancel events. This was already created as src/components/TaskFormModal.vue in a previous step, fulfilling all requirements within a modal. | `Execute` |

| 2026-03-06 | Frontend Login Test | Generated src/views/Auth/**tests**/Login.spec.ts. Test mounts Login.vue, verifies email input, password input, and login button exist. Uses @pinia/testing and mocks useRouter. | `Execute` |

| 2026-03-06 | Frontend Axios Interceptor Update | Updated src/services/api.ts to handle HTTP error codes: 401 (clears token, prompts re-login), 422 (passes detailed validation errors to component), 500+ (shows generic server error). Implemented clean error handling. | `Edit` |

| 2026-03-06 | Frontend Loading State Handling | Implemented loading state handling in Login.vue, Dashboard.vue, ProjectList.vue, and ProjectDetail.vue. This ensures a loading indicator is shown during API calls, improving user experience. | `Edit` |
