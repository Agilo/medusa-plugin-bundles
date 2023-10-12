require("dotenv").config();
const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: process.env.DATABASE_TYPE,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  entities: [
    "../node_modules/@medusajs/medusa/dist/models/*.js",
    "dist/models/*.js",
  ],
  migrations: [
    "../node_modules/@medusajs/medusa/dist/migrations/*.js",
    "dist/migrations/*.js",
  ],
});

module.exports = {
  datasource: AppDataSource,
};
