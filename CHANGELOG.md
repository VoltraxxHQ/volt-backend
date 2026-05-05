# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-05-05

### Added
- Initial MVP backend service using Fastify and Prisma.
- Task metadata model and PostgreSQL schema.
- API endpoints for task creation, retrieval, and listing.
- On-chain reference indexing (chainId, contractAddress, taskId).
- Zod-based request validation.
- Centralized error handling and standardized response format.
- Docker and Docker Compose configuration for local development.
- Vitest unit tests for core services and validation.
- GitHub Actions CI workflow.
