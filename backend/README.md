# OpsFlow Backend (T0.2 foundation)

Spring Boot REST API foundation for Java 21. Proposed baseline: Spring Boot 4.1.1, Maven 3.9.11 wrapper. PhanDV2 should review this baseline before it is treated as the team's agreed version. No User/Ticket entity, login, or business API is included yet. T0.3 adds the first Flyway migration for `users` and `request_types` only.

## Packages

`com.opsflow` is the application root. `config`, `security`, `auth`, `user`, `requesttype`, `ticket`, `comment`, `audit`, `sla`, `dashboard`, and `common` separate cross-cutting configuration from business domains. Empty domains have `package-info.java` only; their implementations belong to later Task IDs.

## Configuration

The application reads `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` from environment variables; `.env.example` is a placeholder reference, **not** automatically loaded by Spring Boot. Never commit a populated `.env` file. `SERVER_PORT` defaults to 8080. Flyway applies versioned migrations on normal startup before JPA validates the schema. `spring.jpa.hibernate.ddl-auto=validate` prevents Hibernate from changing the schema. See [migration rules and verification](../docs/architecture/migrations.md). Do not run the normal profile against the shared Supabase demo database until the team approves its migration.

For local PostgreSQL, set `DB_URL` to a local JDBC URL such as `jdbc:postgresql://localhost:5432/opsflow?sslmode=disable`. For Supabase, use the PostgreSQL JDBC host, port, database and SSL settings supplied by the project; prefer certificate verification (`sslmode=verify-full`) with the appropriate trust configuration. Set credentials only in your shell/secret manager. The browser and frontend must never connect directly to PostgreSQL.

PowerShell example, after replacing placeholders in your own shell:

```powershell
$env:DB_URL = 'jdbc:postgresql://<host>:5432/<database>?sslmode=verify-full'
$env:DB_USERNAME = '<database-user>'
$env:DB_PASSWORD = '<database-password>'
.\mvnw.cmd spring-boot:run
```

The normal application profile requires a reachable PostgreSQL database. With no database credentials, use the explicit `smoke` profile only to verify that the HTTP server and security foundation start; it excludes DataSource/JPA/Flyway auto-configuration and proves **no database integration**:

```powershell
.\mvnw.cmd -Dspring-boot.run.profiles=smoke spring-boot:run
Invoke-WebRequest http://localhost:8080/api/v1/health
```

`GET /api/v1/health` returns HTTP 204. All other routes are denied until T1.2 adds actual authentication and authorization. CSRF protection remains enabled. There is no default user or generated development password.

## Build and test

```powershell
.\mvnw.cmd clean verify
```

The integration test starts a random-port server in `smoke` profile, checks HTTP 204 for health and HTTP 403 for a business route. It does not test PostgreSQL, Flyway, Supabase, or real authentication. The T0.3 PostgreSQL migration test and its limits are recorded in [migration rules and verification](../docs/architecture/migrations.md).
