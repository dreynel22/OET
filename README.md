# Office Equipment Tracker (OET)

A simple CRUD web application for managing office equipment, built with Laravel, React, PostgreSQL, and Docker.

## Features

- Create, view, edit, and delete equipment records.
- Search equipment by name, category, or notes.
- Filter records by status (`available`, `in use`, `broken`) and category.
- Paginate equipment records.
- Validate required fields and quantity.
- Use SweetAlert2 for confirmations and notifications.

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Laravel REST API (PHP 8.4)
- **Database:** PostgreSQL 17
- **Notifications:** SweetAlert2
- **Environment:** Docker and Docker Compose

---

## How to Run the Application

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- Git (optional, for cloning the repository).

---

### 1. Clone the repository

```bash
git clone <repository-url>
cd OET
```

---

### 2. Configure the environment

Copy the backend environment template to create `backend/.env`:

**Linux / macOS (Bash):**
```bash
cp backend/.env.example backend/.env
```

**Windows (PowerShell / CMD):**
```powershell
copy backend\.env.example backend\.env
```

> **Important:** The `docker-compose.yml` healthcheck is pre-configured for the database credentials in `.env.example`. Ensure your `backend/.env` includes matching PostgreSQL variables:
> ```env
> DB_CONNECTION=pgsql
> DB_HOST=db
> DB_PORT=5432
> DB_DATABASE=oet_db
> DB_USERNAME=jl
> DB_PASSWORD=secret
> 
> # PostgreSQL Container Settings
> POSTGRES_DB=oet_db
> POSTGRES_USER=jl
> POSTGRES_PASSWORD=secret
> ```

---

### 3. Start the application

From the project root, build and start all containers:

```bash
docker compose up -d --build
```

---

### 4. Setup Laravel (Key & Migrations)

Once the containers are up and healthy, run the application key generation and database migrations:

```bash
# Generate the application key
docker compose exec backend php artisan key:generate

# Run database migrations
docker compose exec backend php artisan migrate
```

---

### 5. Open the application

| Service | URL | Note |
|---|---|---|
| **Frontend** | [http://localhost:5173](http://localhost:5173) | Main user interface |
| **Backend API** | [http://localhost:8000](http://localhost:8000) | Laravel REST API |
| **Equipment API** | [http://localhost:8000/api/equipment](http://localhost:8000/api/equipment) | JSON equipment resource |
| **Database** | `localhost:5433` | Host port mapped to PostgreSQL |

To stop the application:

```bash
docker compose down
```

To stop and remove containers along with database volumes (fresh start):

```bash
docker compose down -v
```

---

## What I Would Improve With More Time

- Implement server-side pagination, searching, and filtering for better performance with larger datasets.
- Add automated tests for API endpoints, validation, and CRUD operations.
- Improve form validation and user experience with more detailed feedback.
- Add authentication and role-based access control.
- Add equipment summary dashboards and reporting.
- Improve production deployment, security, and environment configuration.

---

## Author

Developed as an Office Equipment Tracker CRUD assessment project.
