import { Router } from "express";
import cors from "cors";
import {
  authenticate,
  transformBody,
  transformQuery,
  wrapHandler,
} from "@medusajs/medusa";
import { AdminDeleteProductsFromBundleReq } from "./remove-products";
import { AdminPostProductsToBundleReq } from "./add-products";
import { AdminListBundleProductsParams } from "./list-products";
import { AdminGetBundlesParams } from "./list-bundles";
import { AdminCreateBundleReq } from "./create-bundle";
import { AdminUpdateBundleReq } from "./update-bundle";

export default function adminRoutes(router: Router, options) {
  console.log("options", options);

  const corsOptions = {
    origin: options.admin_cors.split(","),
    credentials: true,
  };

  const adminRouter = Router();

  router.use("/admin/bundles", adminRouter);

  adminRouter.use(cors(corsOptions));
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
    transformBody(AdminCreateBundleReq),
    wrapHandler(require("./create-bundle").default)
  );

  adminRouter.post(
    "/:id",
    transformBody(AdminUpdateBundleReq),
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
