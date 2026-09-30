# OpsFlow schema migrations — T0.3

Flyway is the only mechanism for changing the PostgreSQL schema. The Spring Boot application reads `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` from the environment, runs pending migrations before JPA starts, and uses `spring.jpa.hibernate.ddl-auto=validate`. The backend requires a fresh database or a database already managed by these migrations; `baseline-on-migrate=false` deliberately refuses to adopt an unrelated nonempty schema. Flyway `clean` is disabled.

## Version register

| Version | File | Scope |
| --- | --- | --- |
| V1 | `backend/src/main/resources/db/migration/V1__create_users_and_request_types.sql` | `users`, `request_types`, constraints and normalized unique indexes. No seed data. |
| V2 | Next available version, **not yet allocated** | Reserve with the team immediately before the next schema task is merged. |

T0.3 creates only the two reviewed foundation tables. `tickets`, `comments`, `refresh_tokens`, and `audit_events` need separate migrations with their owning tasks; no empty stand-in tables are created. UUID primary keys have no database default because the backend will supply IDs. `updated_at` gets an insert default; each later update service must set it explicitly.

## Rules

- Use `V<n>__<description>.sql` with a unique, increasing integer version. Check the migration directory and `dev` before claiming a version; coordinate concurrent branches so they do not introduce the same version. A higher version must not merge before an earlier pending version without checking deployment order.
- Never edit or rename a migration that has run in any shared environment. Add a new migration for schema changes and review it as part of the owning Task ID. Flyway validates checksums at startup.
- Do not use Hibernate `ddl-auto=update`, `create`, or `create-drop`, and do not use Flyway `clean` or delete/reset demo data to repair a migration. Diagnose the failure and add a forward migration after review.
- Never put DB credentials, password hashes, token values, or real user data in migrations or Git. No migration runs against the shared Supabase demo database without team permission.
- Case-insensitive uniqueness for `username`, optional `email`, and Request Type `name` is enforced by indexes on `lower(btrim(...))`. Service code should trim and validate values before insert/update. `users.role` stores one role; no `roles` table is created.
- Account lock and Request Type inactivation are application operations. Later Ticket FKs must preserve existing users and categories; no business-data hard delete or cascade is planned.

## Local verification

Use a **separate empty PostgreSQL development database**. Set the three environment variables described in [backend/README.md](../../backend/README.md). For local PostgreSQL, `DB_URL` may use `?sslmode=disable`; for Supabase it must use the project's SSL settings, preferably certificate verification. Never use the shared demo DB for these checks.

From `backend/`, run `./mvnw clean verify` (Windows: `.\mvnw.cmd clean verify`), then start the normal profile with `./mvnw spring-boot:run` (Windows: `.\mvnw.cmd spring-boot:run`). Verify `GET http://localhost:8080/api/v1/health` returns 204. Inspect the database:

```sql
SELECT installed_rank, version, description, success
FROM flyway_schema_history ORDER BY installed_rank;

SELECT tablename FROM pg_tables
WHERE schemaname = 'public' ORDER BY tablename;

SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('users', 'request_types')
ORDER BY table_name, ordinal_position;

SELECT tablename, indexname, indexdef FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('users', 'request_types')
ORDER BY tablename, indexname;
```

Expected: one successful history row for version `1`, only `users`, `request_types`, and `flyway_schema_history` in a fresh `public` schema, and the constraints/indexes from V1. Stop and start the app again; Flyway should report the schema is up to date and the history row count should remain one. The `smoke` profile excludes the database and does **not** verify migrations.

## T0.3 verification record

On 30 September 2026, V1 was applied to a disposable PostgreSQL **17.11** container bound to `127.0.0.1`, never to Supabase. The backend started with the normal profile and `ddl-auto=validate`; health returned 204. `flyway_schema_history` contained one successful V1 row. `information_schema`, `pg_indexes`, and `pg_constraint` confirmed both tables, required/optional columns, defaults, UUID primary keys, normalized unique indexes, enum and nonblank checks, and nonnegative `auth_version`. A second normal-profile startup reported `Schema "public" is up to date. No migration necessary.` The history table still had exactly one successful V1 row. Transactional insert probes confirmed normalized username and Request Type name duplicates and an invalid role are rejected; both test tables remained empty. `./mvnw clean verify` passed (1 existing smoke test, 0 failures). Maven resolved `flyway-core` and `flyway-database-postgresql` to **12.4.0**.

The test did not exercise Supabase SSL, migration against a pre-existing nonempty schema, JPA entity mappings, or application business operations; those require the owning tasks and approved credentials. The reviewer should confirm whether T1.2 allows a single login identifier to match either a username or another account's email; V1 enforces uniqueness within each column, not across the two columns.
