# Todo API Cache

A RESTful API for managing todos, built with NestJS, Prisma, and Redis for caching. This project implements a todo application with CRUD operations, leveraging PostgreSQL as the database and Redis for caching to optimize performance.

## Features
- **CRUD Operations**: Create, read, update, and delete todos via REST endpoints.
- **Caching**: Uses Redis with `@nestjs/cache-manager` for caching `GET` requests (`/todos` and `/todos/:id`) with a 60-second TTL, implemented via `CacheInterceptor`.
- **Database**: Integrates Prisma with PostgreSQL for data persistence.
- **Scalable Architecture**: Modular NestJS structure with separate `TodoModule` and `PrismaModule`.

## Tech Stack
- **NestJS**: Backend framework for building the REST API.
- **Prisma**: ORM for PostgreSQL database interactions.
- **Redis**: Caching layer for improved performance.
- **PostgreSQL**: Relational database for storing todo data.
- **Docker**: Containerized services for PostgreSQL and Redis.

## Project Structure
```
todo-cache-app/
├── src/
│   ├── app.controller.ts       # Root controller for health check
│   ├── app.module.ts          # Root module with Redis cache configuration
│   ├── app.service.ts         # Basic service for root endpoint
│   ├── main.ts                # Application bootstrap
│   ├── prisma/
│   │   ├── prisma.module.ts   # Prisma module for database service
│   │   └── prisma.service.ts  # Prisma client setup
│   └── todo/
│       ├── todo.controller.ts # Todo API endpoints with cache interceptors
│       ├── todo.module.ts     # Todo module with Prisma dependency
│       ├── todo.service.ts    # Todo business logic with cache invalidation
│       └── *.spec.ts          # Test files
├── prisma/
│   └── schema.prisma          # Prisma schema for Todo model
├── docker-compose.yml         # Docker setup for PostgreSQL and Redis
└── README.md                  # Project documentation
```

## Prerequisites
- Node.js (v16 or higher)
- Docker and Docker Compose
- npm or yarn

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd todo-cache-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the project root and add the following:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/todo_db?schema=public
```

### 4. Run Docker Services
Start PostgreSQL and Redis using Docker Compose:
```bash
docker-compose up -d
```

### 5. Run Prisma Migrations
Generate and apply database migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 6. Start the Application
```bash
npm run start:dev
```
The API will be available at `http://localhost:3000`.

## API Endpoints
- **POST /todos**: Create a new todo
  - Body: `{ "title": "string", "completed": boolean }`
- **GET /todos**: Retrieve all todos (cached, 60s TTL)
- **GET /todos/:id**: Retrieve a todo by ID (cached, 60s TTL)
- **PATCH /todos/:id**: Update a todo
  - Body: `{ "title": "string", "completed": boolean }`
- **DELETE /todos/:id**: Delete a todo
- **GET /**: Health check endpoint (returns "Hello World!")

## Caching
- The `GET /todos` endpoint uses the cache key `todos:all` with a 60-second TTL.
- The `GET /todos/:id` endpoint is cached with a 60-second TTL, with invalidation on `PATCH` and `DELETE` operations.
- Cache invalidation occurs in `TodoService` for `create`, `update`, and `remove` operations to ensure data consistency.

## Docker Services
- **PostgreSQL**: Runs on `localhost:5432` with database `todo_db`, user `user`, and password `password`.
- **Redis**: Runs on `localhost:6379` for caching.

## Running Tests
```bash
npm run test
```

## Contributing
1. Create a feature branch: `git checkout -b feat/<feature-name>`
2. Commit changes: `git commit -m "feat(<scope>): <description>"`
3. Push and create a pull request.

## License
MIT License