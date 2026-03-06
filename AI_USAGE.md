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
