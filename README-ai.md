# README-ai.md - ZNT Template Project NestJS

## Overview

This is a NestJS-based backend template project following **Hexagonal Architecture** (Ports & Adapters), **SOLID principles**, and **clean code** practices. Designed as a reusable template for rapid project setup and scalability.

## Technology Stack

### Backend
- **NestJS** 11.x - Progressive Node.js framework
- **TypeScript** 5.x - Type-safe JavaScript
- **Fastify** 5.x - High-performance web server (replaces Express)

### Database
- **TypeORM** with **MySQL** - Relational database adapter
- **Firestore** (Google Cloud) - NoSQL document database adapter

### Authentication & Security
- **JWT** - JSON Web Token authentication
- **Google OAuth** - Google authentication integration
- **Bcrypt** - Password hashing
- **CSRF Protection** - Cross-Site Request Forgery prevention

### Infrastructure & DevOps
- **Docker** - Containerization
- **Google Cloud Run** - Serverless container deployment
- **Cloud Build** - CI/CD pipeline

### Quality & Testing
- **Jest** - Unit and integration testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **SonarQube** - Static code analysis

## Architecture

### Hexagonal Architecture (Ports & Adapters)

```
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                     │
│  Controllers, Database Adapters, External APIs, Configs     │
├─────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                        │
│         Services, Use Cases, Business Logic                 │
├─────────────────────────────────────────────────────────────┤
│                      DOMAIN LAYER                           │
│     Entities, Value Objects, Interfaces, Business Rules    │
└─────────────────────────────────────────────────────────────┘
```

### Database Adapters (Repository Pattern)
- **TypeORM Adapter**: MySQL relational database
- **Firestore Adapter**: Google Cloud NoSQL database
- Both implement **Unit of Work** pattern for transactions

### Integration Adapters
- **Axios Service**: HTTP client for external APIs
- Supports multiple security types: none, api-key, bearer-token, google-cloud-run-auth

## Project Structure

```
src/
├── app.module.ts          # Root module
├── main.ts                # Application entry point
├── auth/                  # Authentication module (JWT, Google OAuth)
├── core/                  # Core infrastructure
│   ├── config/            # Configuration and validation (Joi)
│   ├── database/          # Database adapters (Firestore, TypeORM)
│   ├── integration/       # External API integration (Axios)
│   └── logger/           # Custom structured logging
├── modules/               # Business modules
│   ├── users/             # User management
│   ├── generics/          # Generic CRUD operations
│   ├── confirmations/    # Confirmation handling
│   ├── people/           # People/Person management
│   └── messages/         # Message handling
└── shared/                # Shared resources (guards, interceptors, DTOs, etc.)
```

## Key Modules

| Module | Purpose | Database |
|--------|---------|----------|
| **Users** | User management and authentication | Firestore |
| **Generics** | Generic CRUD operations | TypeORM |
| **Confirmations** | Email/operation confirmations | TypeORM |
| **People** | Person entity management | TypeORM |
| **Messages** | Message handling | TypeORM |
| **Auth** | JWT token generation, Google OAuth | N/A |

## Configuration

### Environment Variables (.env)
```env
APP_PORT=3000
LIST_CORS=http://localhost:4200
SECRETKEY_AUTH=<jwt-secret>
TOKEN_EXPIRATION=3600

# Database (TypeORM/MySQL)
DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASS=
DB_DB=

# Google Cloud
GCP_PROJECT_ID=
GCP_FIRESTORE_DATABASE_ID=

# External API
EXTERNAL_API_SECURITY_TYPE=none
EXTERNAL_API_BASE_URL=
```

## Running the Project

```bash
# Install dependencies
npm install

# Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Docker
docker build -t znt-template-nest .
docker run -p 3000:3000 --env-file .env znt-template-nest
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build for production |
| `npm run start:dev` | Development mode with watch |
| `npm run start:prod` | Production mode |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:cov` | Run tests with coverage |
| `npm run audit:prod` | Security audit |

## API Documentation

Swagger UI available at: `http://localhost:3000/api/v1/zenta/swagger-doc`

All endpoints must be documented using `@nestjs/swagger` decorators.

## Testing Strategy

- **Unit Tests**: `*.spec.ts` files with Jest
- **Integration Tests**: Module-level testing
- **E2E Tests**: `test/` directory with supertest
- **Coverage Target**: Minimum 80%

## Security Features

- JWT token authentication
- Google OAuth integration
- CSRF token protection
- Input validation (class-validator + Joi)
- SQL Injection and XSS prevention (SecurityValidationPipe)

## CI/CD

- **Cloud Build** automated pipeline
- **SonarQube** code quality gates
- **Docker** multi-stage builds
- **Cloud Run** deployment

## Code Quality Standards

- **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **ESLint**: Enforced code style
- **Prettier**: Consistent formatting
- **SonarQube**: Static analysis with quality gates

---

*Generated for KAN-11*
