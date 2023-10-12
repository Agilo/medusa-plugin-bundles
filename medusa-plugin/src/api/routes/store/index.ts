import { Router } from "express";
import { transformStoreQuery, wrapHandler } from "@medusajs/medusa";
import { StoreGetBundlesParams } from "./list-bundles";
import { Bundle } from "../../../models/bundle";

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

  storeRouter.get(
    "/:id",
    // transformStoreQuery(StoreGetProductsProductParams, {
    //   defaultRelations: defaultStoreProductsRelations,
    //   defaultFields: defaultStoreProductsFields,
    //   allowedFields: allowedStoreProductsFields,
    //   allowedRelations: allowedStoreProductsRelations,
    // }),
    wrapHandler(require("./get-bundle").default)
  );
}

export const defaultStoreBundlesRelations = ["products"];

export const defaultStoreBundlesFields: (keyof Bundle)[] = [
  "id",
  "title",
  "description",
  "created_at",
  "updated_at",
];

export const allowedStoreBundlesRelations = [...defaultStoreBundlesRelations];

export const allowedStoreBundlesFields = [...defaultStoreBundlesFields];
