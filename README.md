# Task & Project Tracker

A fullstack Task & Project Tracker application built for the Junior Fullstack Web Developer test at Energeek.

## Tech Stack

- **Backend:** Laravel 12 (PHP >= 8.2)
- **Frontend:** Vue.js 3 + TypeScript (Composition API)
- **Database:** PostgreSQL
- **Authentication:** Laravel Sanctum (PAT)

## Features

- **Authentication:** Login/Logout (Admin only, created via seeder).
- **Project Management:** Create, Read, Update projects. Set status to Active or Archived. Search by title.
- **Task Management:** Create, Read, Update, Delete tasks within projects. Kanban-style drag-and-drop category movement. Soft delete tracking. Search by title.
- **Dashboard:** Overview of active projects, pending tasks, and tasks nearing their due date.

## Prerequisites

- PHP >= 8.2 with extensions: `php8.x-xml`, `php8.x-mbstring`, `php8.x-pgsql`
- Composer
- PostgreSQL (running on port 5432)
- Node.js >= 18

## Installation & Setup

### Backend (`energeek-be`)

```bash
cd energeek-be
composer install
cp .env.example .env
php artisan key:generate
```

Configure your `.env` with PostgreSQL credentials:

```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=energeek_db
DB_USERNAME=postgres
DB_PASSWORD=password
```

```bash
php artisan migrate
php artisan db:seed
```

### Frontend (`energeek-fe`)

```bash
cd energeek-fe
npm install
```

## Running the Application

### Backend

```bash
cd energeek-be
php artisan serve
```

API will be available at `http://localhost:8000/api`

### Default Admin Credentials

- **Email:** `admin@energeek.co.id`
- **Password:** `password`

### Frontend

```bash
cd energeek-fe
npm run dev
```

Frontend will be available at `http://localhost:5173` (default Vite port)

## Testing

### Backend (PHPUnit)

```bash
cd energeek-be
php artisan test
```

### Frontend (Vitest)

```bash
cd energeek-fe
npm test
```
