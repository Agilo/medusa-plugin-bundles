import { Router } from "express";
import cors from "cors";
import {
  PaginatedResponse,
  authenticate,
  transformBody,
  transformQuery,
  wrapHandler,
} from "@medusajs/medusa";
import { AdminDeleteProductsFromBundleReq } from "./remove-products";
import { AdminPostProductsToBundleReq } from "./add-products";
import { AdminListBundleProductsParams } from "./list-products";
import { AdminGetBundlesParams } from "./list-bundles";
import { AdminPostBundlesReq } from "./create-bundle";
import { AdminPostBundlesBundleReq } from "./update-bundle";
import { Bundle } from "../../../../models/bundle";

export default function adminRoutes(router: Router, options) {
  const adminRouter = Router();

  router.use("/admin/bundles", adminRouter);

  adminRouter.use(
    cors({
      origin: options.admin_cors.split(","),
      credentials: true,
    })
  );
  adminRouter.use(authenticate());

  adminRouter.get(
    "/",
    transformQuery(AdminGetBundlesParams, {
      isList: true,
    }),
    wrapHandler(require("./list-bundles").default)
  );

  adminRouter.post(
    "/",
    transformBody(AdminPostBundlesReq),
    wrapHandler(require("./create-bundle").default)
  );

  adminRouter.post(
    "/:id",
    transformBody(AdminPostBundlesBundleReq),
    wrapHandler(require("./update-bundle").default)
  );

  adminRouter.get("/:id", wrapHandler(require("./get-bundle").default));

  adminRouter.delete("/:id", wrapHandler(require("./delete-bundle").default));

  adminRouter.post(
    "/:id/products/batch",
    transformBody(AdminPostProductsToBundleReq),
    wrapHandler(require("./add-products").default)
  );

  adminRouter.get(
    "/:id/products",
    transformQuery(AdminListBundleProductsParams, {
      isList: true,
    }),
    wrapHandler(require("./list-products").default)
  );

  adminRouter.delete(
    "/:id/products/batch",
    transformBody(AdminDeleteProductsFromBundleReq),
    wrapHandler(require("./remove-products").default)
  );
}

/**
 * @schema AdminBundlesRes
 * type: object
 * x-expanded-relations:
 *   field: bundle
 *   relations:
 *     - products
 * required:
 *   - bundle
 * properties:
 *   bundle:
 *     description: Bundle details.
 *     $ref: "#/components/schemas/Bundle"
 */
export type AdminBundlesRes = {
  bundle: Bundle;
};

/**
 * @schema AdminBundlesDeleteRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Bundle.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: bundle
 *   deleted:
 *     type: boolean
 *     description: Whether or not the items were deleted.
 *     default: true
 */
export type AdminBundlesDeleteRes = {
  id: string;
  object: "bundle";
  deleted: boolean;
};

/**
 * @schema AdminDeleteProductsFromBundleRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - removed_products
 * properties:
 *   id:
 *     type: string
 *     description: "The ID of the bundle"
 *   object:
 *     type: string
 *     description: "The type of object the removal was executed on"
 *     default: product-bundle
 *   removed_products:
 *     description: "The IDs of the products removed from the bundle"
 *     type: array
 *     items:
 *       description: "The ID of the Product removed from the Product Bundle."
 *       type: string
 */
export type AdminDeleteProductsFromBundleRes = {
  id: string;
  object: string;
  removed_products: string[];
};

/**
 * @schema AdminBundlesListRes
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
 *     description: An array of bundles details.
 *     items:
 *       $ref: "#/components/schemas/Bundle"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of bundles skipped when retrieving the bundles.
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminBundlesListRes = PaginatedResponse & {
  bundles: Bundle[];
};
