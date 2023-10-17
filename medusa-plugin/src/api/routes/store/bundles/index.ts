import { Router } from "express";
import {
  PaginatedResponse,
  transformStoreQuery,
  wrapHandler,
} from "@medusajs/medusa";
import { StoreGetBundlesParams } from "./list-bundles";
import { Bundle } from "../../../../models/bundle";

export default function storeRoutes(router: Router, options) {
  // console.log("options", options);

  // const corsOptions = {
  //   origin: options.admin_cors.split(","),
  //   credentials: true,
  // };

  const storeRouter = Router();

  router.use("/store/bundles", storeRouter);

  // storeRouter.use(cors(corsOptions));
  // storeRouter.use(authenticate());

  storeRouter.get(
    "/",
    transformStoreQuery(StoreGetBundlesParams, {
      // defaultRelations: defaultStoreBundlesRelations,
      // defaultFields: defaultStoreBundlesFields,
      // allowedRelations: allowedStoreBundlesRelations,
      // allowedFields: allowedStoreBundlesFields,
      isList: true,
    }),
    wrapHandler(require("./list-bundles").default)
  );

  storeRouter.get("/:id", wrapHandler(require("./get-bundle").default));
}

// export const defaultStoreBundlesRelations = ["products"];

// export const defaultStoreBundlesFields: (keyof Bundle)[] = [
//   "id",
//   "title",
//   "description",
//   "created_at",
//   "updated_at",
// ];

// export const allowedStoreBundlesRelations = [...defaultStoreBundlesRelations];

// export const allowedStoreBundlesFields = [...defaultStoreBundlesFields];

/**
 * @schema StoreBundlesRes
 * type: object
 * x-expanded-relations:
 *   field: bundle
 *   relations:
 *     - products
 * required:
 *   - bundle
 * properties:
 *   bundle:
 *     description: "Bundle details."
 *     $ref: "#/components/schemas/Bundle"
 */
export type StoreBundlesRes = {
  bundle: Bundle;
};

/**
 * @schema StoreBundlesListRes
 * type: object
 * x-expanded-relations:
 *   field: bundles
 *   relations:
 *     - products
 * required:
 *   - bundles
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   bundles:
 *     type: array
 *     description: "An array of bundles details."
 *     items:
 *       $ref: "#/components/schemas/Bundle"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of products skipped when retrieving the products.
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type StoreBundlesListRes = PaginatedResponse & {
  bundles: Bundle[];
};
