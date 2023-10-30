import {
  PaginatedResponse,
  allowedStoreProductsFields,
  allowedStoreProductsRelations,
  defaultStoreProductsFields,
  defaultStoreProductsRelations,
  transformStoreQuery,
  wrapHandler,
} from "@medusajs/medusa";
import cors from "cors";
import { Router } from "express";
import { parseCorsOrigins } from "medusa-core-utils";
import { Bundle } from "../../../../models/bundle";
import { StoreGetBundlesParams } from "./list-bundles";
import { StoreGetBundlesBundleProductsParams } from "./list-products";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";

export default function storeRoutes(router: Router, store_cors: string) {
  const storeRouter = Router();

  router.use("/store/bundles", storeRouter);

  storeRouter.use(
    cors({
      origin: parseCorsOrigins(store_cors),
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

  // storeRouter.get(
  //   "/:id/products",
  //   transformStoreQuery(StoreGetBundlesBundleProductsParams, {
  //     isList: true,
  //   }),
  //   wrapHandler(require("./list-products").default)
  // );

  storeRouter.get(
    "/:id/products",
    // withDefaultSalesChannel({ attachChannelAsArray: true }),
    transformStoreQuery(StoreGetBundlesBundleProductsParams, {
      defaultRelations: defaultStoreProductsRelations,
      defaultFields: defaultStoreProductsFields,
      allowedFields: allowedStoreProductsFields,
      allowedRelations: allowedStoreProductsRelations,
      isList: true,
    }),
    wrapHandler(require("./list-products").default)
  );

  // storeRouter.get(
  //   "/:id/products2",
  //   transformStoreQuery(StoreGetBundlesBundleProducts2Params, {
  //     isList: true,
  //   }),
  //   wrapHandler(require("./list-products2").default)
  // );
}

// export const defaultStoreProductsRelations = [
//   "variants",
//   "variants.prices",
//   "variants.options",
//   "options",
//   "options.values",
//   "images",
//   "tags",
//   "collection",
//   "type",
//   "profiles",
// ];

// export const defaultStoreProductsFields: (keyof Product)[] = [
//   "id",
//   "title",
//   "subtitle",
//   "status",
//   "external_id",
//   "description",
//   "handle",
//   "is_giftcard",
//   "discountable",
//   "thumbnail",
//   "collection_id",
//   "type_id",
//   "weight",
//   "length",
//   "height",
//   "width",
//   "hs_code",
//   "origin_country",
//   "mid_code",
//   "material",
//   "created_at",
//   "updated_at",
//   "deleted_at",
//   "metadata",
// ];

// export const allowedStoreProductsFields = [
//   ...defaultStoreProductsFields,
//   // profile_id is not a column in the products table, so it should be ignored as it
//   // will be rejected by typeorm as invalid, though, it is an entity property
//   // that we want to return, so it part of the allowedStoreProductsFields
//   "profile_id",
//   "variants.title",
//   "variants.prices.amount",
// ];

// export const allowedStoreProductsRelations = [
//   ...defaultStoreProductsRelations,
//   "variants.inventory_items",
//   "sales_channels",
// ];

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
 * x-expanded-relations:
 *   field: products
 *   relations:
 *     - collection
 *     - images
 *     - options
 *     - options.values
 *     - tags
 *     - type
 *     - variants
 *     - variants.options
 *     - variants.prices
 *   totals:
 *     - variants.purchasable
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
 *       $ref: "#/components/schemas/PricedProduct"
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
  products: PricedProduct[];
};
