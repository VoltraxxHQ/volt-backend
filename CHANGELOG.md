# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-05-05
### Changed
- Updated validation logic to support **Stellar** addresses (G.../C...) and transaction hashes.
- Changed `chainId` from `Int` to `String` in database schema to accommodate Stellar network passphrases.
- Updated API documentation to reflect Stellar/Soroban integration.

## [0.1.0] - 2026-05-05
### Added
- Initial MVP backend service (Legacy EVM version).
- Task metadata CRUD and indexing.
