require("dotenv").config();
const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: process.env.DATABASE_TYPE || "postgres",
  port: Number(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASS || "postgres",
  database: process.env.DATABASE_NAME || "medusa-docker",
  entities: [
    "node_modules/@medusajs/medusa/dist/models/*.js",
    "dist/models/*.js",
  ],
  migrations: [
    "node_modules/@medusajs/medusa/dist/migrations/*.js",
    "dist/migrations/*.js",
  ],
});

module.exports = {
  datasource: AppDataSource,
};
