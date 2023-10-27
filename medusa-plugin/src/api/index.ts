import { errorHandler } from "@medusajs/medusa";
import express, { Router } from "express";
import { getConfigFile } from "medusa-core-utils";
import adminRoutes from "./routes/admin/bundles";
import storeRoutes from "./routes/store/bundles";

export default (rootDirectory, options) => {
  const { configModule } = getConfigFile(rootDirectory, "medusa-config");

  const admin_cors = (configModule as any)?.projectConfig?.admin_cors ?? "";
  const store_cors = (configModule as any)?.projectConfig?.store_cors ?? "";

  const router = Router();

  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));

  adminRoutes(router, admin_cors);
  storeRoutes(router, store_cors);

  router.use(errorHandler());

  return router;
};
