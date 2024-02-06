# Medusa Bundles

Group products together in product bundles.

<p>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="Medusa Bundles is released under the MIT license." />
  </a>
  <a href="https://nodejs.org/" target="_blank">
    <img src="https://img.shields.io/badge/Node.js-%5E20-brightgreen" alt="Node.js ^20">
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=Agilo">
    <img src="https://img.shields.io/twitter/follow/Agilo" alt="X (formerly Twitter) Follow">
  </a>
</p>

## Features

- Group products together in product bundles from the admin dashboard.
- Use plugin Store API endpoints to list product bundles in your storefront.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

```bash
npm i @agilo/medusa-plugin-bundles
```

2\. In `medusa-config.js` add the following at the end of the `plugins` array:

```js
const plugins = [
  // ...
  {
    resolve: "@agilo/medusa-plugin-bundles",
    options: {
      enableUI: true,
    },
  },
];
```

3\. Run the following command in the directory of the Medusa backend to run the migrations:

```bash
medusa migrations run
```

---

## Test the Plugin

1\. Start your Medusa backend and admin dashboard, eg.:

```bash
npm run dev
```

2\. Visit Bundles in the admin dashboard to create a bundle.

3\. Implement your storefront.

- Either use `medusa-react` hooks from the [`@agilo/medusa-plugin-bundles-client`](https://github.com/Agilo/medusa-plugin-bundles/tree/master/dev/medusa-plugin-bundles-client) to list bundles in your storefront.
- Or directly consume the Store API endpoints that the plugin adds to Medusa:
  - http://localhost:9000/store/bundles - list bundles
  - http://localhost:9000/store/bundles/:id - get bundle by id
  - http://localhost:9000/store/bundles/:id/products - list products in bundle

## Contributing

We welcome contributions from the community to help make this project even better. Please feel free to open pull requests or issues. Thank you for considering contributing, and we look forward to collaborating with you!

Below you can find the [plugin development guide](#plugin-development) that will help you get started with running Medusa Bundles in your local environment.

### Plugin Development

#### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Node.js v20](https://nodejs.org/en/download/)
  - We suggest using [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) to manage your Node.js versions.
- [Yarn v3](https://v3.yarnpkg.com/getting-started/install)
- [Yalc](https://github.com/wclr/yalc)

#### Running Locally

Follow these step-by-step instructions to run the project locally:

1. `git clone https://github.com/Agilo/medusa-plugin-bundles.git` - clone the monorepo
2. `cd medusa-plugin-bundles` - position into the project directory
3. `cp .env.example .env` - set up docker-compose environment variables
4. `docker compose up` - start Medusa Docker containers
5. Open a new terminal tab
6. `yarn install && yarn run setup` - install dependencies in all packages
7. `cd dev/medusa && npx medusa migrations run && cd ../..` - run the migrations
8. `cd dev/medusa && yarn run seed:medusa-plugin-bundles && cd ../..` - seed the database
9. `yarn run start` - build the packages and start the Medusa dev server and plugin watcher

Medusa Admin is now available at http://localhost:7001 and Medusa Bundles admin screen is available at http://localhost:7001/a/bundles

Default credentials for Medusa Admin are:

```
admin@medusa-test.com
supersecret
```

Medusa Storefront is available at http://localhost:8000

- http://localhost:8000/bundles - example bundle listing page
- http://localhost:8000/bundles/medusa-winter-outfit - example bundle detail page

Once you have the project running locally you can start making changes to the plugin in `medusa-plugin-bundles/src` and see them reflected in the Medusa Admin and Storefront.

#### Generating migrations

Unfortunately DX when generating migrations which extend or relate to core entities is not great, but here's a workflow that works:

1. Make sure `yarn run start` is running
2. `cp medusa-plugin-bundles/.env.example medusa-plugin-bundles/.env` - copy and edit environment variables
3. Edit/create migration files in `medusa-plugin-bundles/src/migrations`
4. `npx typeorm migration:generate -d datasource.js src/migrations/BundleUpdate` - this will generate a migration file with a bunch of migrations in `src/migrations/<timestamp>-BundleUpdate.ts`, the migration file will contain migrations for both core medusa entities and your plugin entities. You can now cherry pick the migrations you want to run and delete the rest.
5. In the `dev/medusa` dir run `medusa migrations run`

#### Available Commands

- `yarn run setup` - install dependencies in all packages
- `yarn run start` - build the packages and start the Medusa dev server and plugin watcher
- `yarn run sync` - use yalc to publish and push `medusa-plugin-bundles` and `medusa-plugin-bundles-client` to Medusa backend and Medusa Storefront

#### Docker Services

Docker services are defined in `docker-compose.yml` file.

- `postgres` - PostgreSQL database server for Medusa available on localhost:5432, you can change credentials and port in `.env` and `dev/medusa/.env` files
- `pgadmin` - pgAdmin available on http://localhost:5050
- `redis` - Redis server for Medusa available on localhost:6379

## Additional Resources

- [Medusa Documentation](https://docs.medusajs.com/)
- [Medusa Development Documentation](https://docs.medusajs.com/development/overview)

## License

This project is licensed under the [MIT License](./LICENSE).

## Credits

Medusa Bundles is developed and maintained by [AGILO](https://agilo.co/).  
Huge thanks to [all contributors](https://github.com/Agilo/medusa-plugin-bundles/graphs/contributors).
