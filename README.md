# Volt Backend ⚡ (Stellar)

Backend service for task metadata, indexing support, and API access for the Volt protocol on **Stellar**.

## 🚀 Overview

The Volt Backend serves as the off-chain metadata layer for the Volt protocol. While **Soroban** smart contracts handle the financial escrow and settlement, this service provides:
- Rich task metadata storage (titles, descriptions, media).
- Task discovery and advanced filtering.
- On-chain reference indexing for Stellar assets.
- Developer API access.

### MVP Scope
- **Metadata Management**: CRUD operations for off-chain task details.
- **On-chain Linking**: Mapping backend records to Stellar network passphrases, contract IDs, and task IDs.
- **Discovery**: Filterable list endpoints for tasks by status, creator, or worker.
- **Validation**: Strict schema enforcement for Stellar addresses and transaction hashes using Zod.

## 🏗 Architecture

The project follows a clean, layered architecture:
- **Routes**: Define API endpoints and plug in controllers.
- **Controllers**: Handle HTTP request/response and input validation.
- **Services**: Implement core business logic.
- **Repositories**: Direct interaction with the database via Prisma.
- **Schemas**: Centralized validation rules for all data models.

## 🛠 Tech Stack
- **Server**: Fastify (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Logging**: Pino
- **Testing**: Vitest

## 💻 Getting Started

### 1. Prerequisites
- Node.js (v20+)
- Docker & Docker Compose

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Local Development (Docker)
```bash
docker-compose up -d
npm run db:migrate
npm run dev
```

### 4. Build & Test
```bash
npm run build
npm run test
```

## 🔌 API Reference

### Health Check
`GET /health`

### Create Task
`POST /v1/tasks`

### List Tasks
`GET /v1/tasks?page=1&limit=20&status=CREATED`

### Get Task by On-chain Ref
`GET /v1/tasks/onchain/:chainId/:contractAddress/:taskId`

## 🛡 Security Notice
This backend is an MVP and does not currently include authentication or rate limiting. It is intended for early-stage development and internal testing only.

## 📄 License
This project is licensed under the [MIT License](LICENSE).
