# Noon Investment Company — Laravel Cloud

This branch migrates the Noon operating backend from Vercel serverless functions to Laravel 12.

## Laravel Cloud

Create an application from `Matrixai211/Noon-Invesment-Company` and select the `laravel-cloud` branch.

Recommended runtime:
- PHP 8.3+
- Production environment
- `APP_DEBUG=false`

Generate and configure `APP_KEY` in Laravel Cloud. Configure `ADMIN_API_KEY` as a secret.

## Database

Noon currently has its CRM schema in Neon Postgres. Laravel Cloud supports bringing an existing public Postgres database. Configure the Postgres connection variables for the existing Noon database rather than creating a second production CRM database during migration.

Existing tables used by the application:
- `crm_leads`
- `crm_notes`
- `audit_events`

## API compatibility

- `GET /api/health`
- `POST /api/leads`
- `GET /api/leads` (Bearer admin key)
- `PATCH /api/leads/{lead}/status` (Bearer admin key)

The public website can remain online during migration. Cut production traffic over only after the Laravel Cloud URL passes health, CRM write, CRM read, and status-update tests.

## Deployment checklist

1. Connect GitHub to Laravel Cloud.
2. Select this repository and `laravel-cloud` branch.
3. Configure PHP and environment variables.
4. Connect the existing Neon Postgres database.
5. Deploy.
6. Verify `/api/health`.
7. Submit a synthetic lead and verify it in `crm_leads`.
8. Verify protected CRM read/update.
9. Move the production domain only after validation.
