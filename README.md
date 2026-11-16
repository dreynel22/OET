# Office Equipment Tracker (OET)

A simple CRUD web application for managing office equipment, built with Laravel, React, PostgreSQL, and Docker.

## Features

- Create, view, edit, and delete equipment records.
- Search equipment by name, category, or notes.
- Filter records by status and category.
- Paginate equipment records.
- Validate required fields and quantity.
- Use SweetAlert2 for confirmations and notifications.

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Laravel REST API
- **Database:** PostgreSQL
- **Notifications:** SweetAlert2
- **Environment:** Docker and Docker Compose

## How to Run the Application

### Prerequisites

- Docker Desktop installed and running.
- Git (optional, for cloning the repository).

### 1. Clone the repository

```bash
git clone <repository-url>
cd OET
```

### 2. Configure the environment

Create or configure `backend/.env` with the required PostgreSQL connection settings:

```env
APP_NAME="Office Equipment Tracker"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=oet_db
DB_USERNAME=postgres
DB_PASSWORD=secret123
```

### 3. Start the application

From the project root, run:

```bash
docker compose up -d --build
```

### 4. Run database migrations

```bash
docker compose exec backend php artisan migrate
```

If the Laravel application key has not yet been generated, run:

```bash
docker compose exec backend php artisan key:generate
```

### 5. Open the application

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| Equipment API | http://localhost:8000/api/equipment |

To stop the application:

```bash
docker compose down
```

## What I Would Improve With More Time

- Implement server-side pagination, searching, and filtering for better performance with larger datasets.
- Add automated tests for API endpoints, validation, and CRUD operations.
- Improve form validation and user experience with more detailed feedback.
- Add authentication and role-based access control.
- Add equipment summary dashboards and reporting.
- Improve production deployment, security, and environment configuration.

## Author

Developed as an Office Equipment Tracker CRUD assessment project.
