# medusa-bundles

## Pre-requisites

- docker
- node 20
- Medusa CLI tool: `npm install @medusajs/medusa-cli -g`
- yarn (v3)

## Getting started

1. Copy `.env.example` to `.env` and edit if needed
2. `docker-compose up`
3. Open a new terminal tab
4. Install dependencies in all packages (this will take a few minutes): `yarn install && cd medusa-plugin && yarn install && cd ../dev/medusa && yarn install && cd ../medusa-storefront && yarn install && cd ../..`
5. Seed the database: `cd dev/medusa && yarn run seed && cd ../..`
6. Run the migrations: `cd dev/medusa && medusa migrations run && cd ../..`
7. `yarn run start`
8. Medusa Admin is now available at http://localhost:7001 and Medusa Storefront at http://localhost:8000

Default credentials for Medusa Admin are:

```
admin@medusa-test.com
supersecret
```

### Migration workflow

Unfortunately DX when generating migrations which extend or relate to core entities is not great, so here's a workflow that works for me:

1. Make sure `yarn run start` is running
2. If needed, copy and edit `medusa-plugin/.env.example` to `medusa-plugin/.env`
3. Edit/create migration files in `medusa-plugin/src/migrations`
4. `npx typeorm migration:generate -d datasource.js src/migrations/BundleCreate` - this will auto generate a bunch of migrations in `src/migrations/xyz-BundleCreate.ts` file for you, the migration file will contain migrations for both core medusa entities + your plugin entities
5. `npx typeorm migration:create src/migrations/BundleCreate` - this will generate an empty migration file for you, you can then cherry pick the migrations you want to run from the previously auto generated file and copy them over to this file, after that you can delete the auto generated file
6. `yarn workspace medusa medusa migrations run`
7. ... ???

<!-- 1. `docker-compose up`
2. Open a new terminal tab
3. `yarn install`
5. `yarn workspace medusa-plugin-bundles run watch`
6. Open a new terminal tab
8. `yarn workspace medusa run seed`
9. `yarn workspace medusa run start`
10. Open a new terminal tab
11. `yarn workspace medusa-storefront run start` -->

<!-- 3. `yarn run watch`
4. In a new terminal tab run `cd dev/medusa`
6. `medusa develop`
7. In a new terminal tab run `cd dev/medusa-storefront`
8. `npm run dev` -->
