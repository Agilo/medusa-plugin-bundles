import express, { Router } from "express";
import adminRoutes from "./routes/admin";
import storeRoutes from "./routes/store";
// import { errorHandler } from "@medusajs/medusa";

export default (rootDirectory, options) => {
  const router = Router();

  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));

  adminRoutes(router, options);
  storeRoutes(router, options);

  // router.use(errorHandler());

  return router;
};