import { Router } from "express";
import cors from "cors";
import {
  PaginatedResponse,
  transformStoreQuery,
  wrapHandler,
} from "@medusajs/medusa";
import { StoreGetBundlesParams } from "./list-bundles";
import { Bundle } from "../../../../models/bundle";
import { parseCorsOrigins } from "medusa-core-utils";
import { StoreGetBundlesBundleProductsParams } from "./list-products";
import { Product } from "../../../../models/product";

export default function storeRoutes(router: Router, options) {
  const storeRouter = Router();

  router.use("/store/bundles", storeRouter);

  storeRouter.use(
    cors({
      origin: parseCorsOrigins(options.store_cors || ""),
      credentials: true,
    })
  );

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

  storeRouter.get(
    "/:id/products",
    transformStoreQuery(StoreGetBundlesBundleProductsParams, {
      isList: true,
    }),
    wrapHandler(require("./list-products").default)
  );
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

/**
 * @schema StoreBundlesBundleProductsListRes
 * type: object
 * required:
 *   - products
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   products:
 *     type: array
 *     description: "An array of products details."
 *     items:
 *       $ref: "#/components/schemas/Product"
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
export type StoreBundlesBundleProductsListRes = PaginatedResponse & {
  products: Product[];
};
