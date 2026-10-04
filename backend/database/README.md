# Database: migrations & seeding

This backend uses `sequelize-cli` with **TypeScript migrations/seeders**
(via `ts-node`), not `sequelize.sync()`. `synchronize: false` in
`src/database/database.config.ts` is permanent — schema changes only ever
happen through a migration.

## Layout

```
backend/
  .sequelizerc              # tells sequelize-cli where everything lives + registers ts-node
  database/
    tsconfig.json            # CommonJS tsconfig just for ts-node (see note below)
    config/
      config.js               # sequelize-cli's own env config (plain JS — see note below)
    helpers/
      columns.ts              # shared column shapes (uuid PK, timestamps, ...)
      permission-catalog.ts   # single source of truth for the module.action permission vocabulary
    migrations/
      20260101000001-create-roles.ts
      ...
    seeders/
      20260101000101-system-permissions.ts
      ...
```

## Commands

```bash
npm run db:migrate              # apply all pending migrations
npm run db:migrate:status       # see what's applied / pending
npm run db:migrate:undo         # roll back the most recent migration
npm run db:migrate:undo:all     # roll back everything (dev/test only!)
npm run db:seed                 # run all seeders
npm run db:seed:undo            # undo all seeders
npm run db:reset                # undo all migrations, re-migrate, re-seed (dev only)
```

These call `sequelize-cli` directly, so any `sequelize-cli db:migrate ...`
flag also works if you need something more specific, e.g.:

```bash
npx sequelize-cli db:migrate --to 20260101000401-create-projects.ts
npx sequelize-cli db:seed --seed 20260101000701-dev-invoices.ts
```

## Environment

Copy `.env.example` to `.env` and fill in your local MySQL/MariaDB
credentials (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`).
`database/config/config.js` and `src/database/database.config.ts` read the
same variables — if you add a new `DB_*` var, update both files, since one
is Nest's runtime config and the other is sequelize-cli's standalone
config (they can't share a loader — see "Why two config files" below).

A quick local setup that mirrors how this was developed and tested:

```bash
# any local MySQL/MariaDB works; this is just one way to get one running
mysql -uroot -e "CREATE DATABASE oct20five;"
mysql -uroot -e "CREATE USER 'app'@'%' IDENTIFIED BY 'app_password';
                 GRANT ALL PRIVILEGES ON oct20five.* TO 'app'@'%';"
```

## First-time setup

```bash
npm install
npm run db:migrate
npm run db:seed
npm run start:dev
```

After this, four accounts exist (see "Dev accounts" below) and one sample
client, project, and its related records (tasks, a deliverable, an
approval, a file, an invoice, a support query, an event, and a couple of
activity/notification rows) are seeded — enough to click through every
workspace without an empty state on first login.

## Dev accounts

All seeded with password `DevPassword123!`. **Development only** — see
"Production seeding" below.

| Email | userType | role |
|---|---|---|
| admin@example.com | admin | admin |
| manager@example.com | staff | manager |
| staff@example.com | staff | staff |
| client@example.com | client | client (contact on Northwind Studios) |

## How to create a migration

There's no `sequelize-cli migration:generate` shortcut wired up (it would
scaffold a `.js` file, not `.ts`) — copy the newest migration file in
`database/migrations/` as a starting point and rename it with a new
timestamp prefix, `YYYYMMDDHHMMSS-create-whatever.ts` (or
`YYYYMMDDHHMMSS-alter-whatever.ts` for a non-create migration). Import the
shared helpers from `database/helpers/columns.ts` for standard PK/timestamp
shapes. Every migration must have a working `down()` — this was verified
for every migration in this repo (full `db:migrate:undo:all` was run and
confirmed to tear down to zero tables with zero errors); keep that true
for new ones too.

**Ordering matters**: migrations run in filename order, so a table with a
foreign key must be numbered *after* the table it references, regardless
of which feature phase either one belongs to. Two tables in this schema
were deliberately moved out of their "natural" feature-phase position for
exactly this reason — see the comments at the top of
`20260101000390-create-services.ts` and `20260101000601-create-folders.ts`.
If you add a new FK to an existing table, double check the referenced
table's migration number is lower.

## How to create a seed

Same pattern: copy an existing seeder, give it a new timestamp. Every dev
seeder in this repo is **idempotent** — it checks for existing rows before
inserting, using a natural key (email, slug, invoice_number, etc.), so
`npm run db:seed` is always safe to re-run against a partially-seeded
database. New seeders should follow the same pattern rather than assuming
a clean database.

## Production seeding

The dev seeders above (`dev-users`, `dev-clients`, `dev-projects`, etc.)
are fixture data and must never run against production — they create a
predictable admin password. Production bootstrapping should be a separate,
minimal seeder (not yet written) that creates only the `system-permissions`
and `system-roles` rows plus a single initial admin account with a
password read from an environment variable, never hardcoded. Until that
exists, provision the first production admin manually through the
database or a one-off script, not through `db:seed`.

## Why two config files

`src/database/database.config.ts` is a Nest `ConfigFactory` — it only runs
inside a booted Nest app and can't be loaded standalone.
`database/config/config.js` is what `sequelize-cli` reads as a plain
process, with no Nest app around it. They read the same env vars but can't
be merged into one file without either coupling `sequelize-cli` to Nest's
DI container (not supported) or making the app's config loader reach
outside Nest's lifecycle. `config.js` is plain JS rather than `.ts` for an
unrelated reason: `sequelize-cli` loads its config file via a dynamic
`import()`, which goes through Node's native ESM loader rather than the
CommonJS `ts-node/register` hook `.sequelizerc` installs — a `.ts` file
there gets executed as a bare ES module (no `__dirname`, different
resolution) and fails. Migration and seeder files don't hit this: the
migrator loads them through a different, `require()`-based path, so they
work fine as `.ts`. If sequelize-cli changes this in a future version,
this whole workaround (and this paragraph) can go.

## What's still open (see docs/00_CURRENT_STATE_AUDIT.md)

- No production seeder exists yet (see "Production seeding" above).
- `service_plans` / `service_plan_packages` / `service_plan_features` have
  migrations but no dev seed data yet — only the three base `services`
  rows are seeded. Add plan/package/feature fixtures when the Services
  admin UI is built.
- The `auth.service.ts` `user.uuid` JWT bug (audit §4) is unrelated to the
  schema and is not fixed by anything in this directory — it belongs to
  the Phase 2 auth/RBAC work.
