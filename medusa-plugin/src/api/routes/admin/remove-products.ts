import { ArrayNotEmpty, IsString } from "class-validator";
import { Request, Response } from "express";
import { EntityManager } from "typeorm";
import BundleService from "../../../services/bundle";

export default async (req: Request, res: Response) => {
  const { id } = req.params;
  const { validatedBody } = req as {
    validatedBody: AdminDeleteProductsFromBundleReq;
  };

  const bundleService: BundleService = req.scope.resolve("bundleService");

  const manager: EntityManager = req.scope.resolve("manager");
  await manager.transaction(async (transactionManager) => {
    return await bundleService
      .withTransaction(transactionManager)
      .removeProducts(id, validatedBody.product_ids);
  });

  res.json({
    id,
    object: "product-bundle",
    removed_products: validatedBody.product_ids,
  });
};

export class AdminDeleteProductsFromBundleReq {
  @ArrayNotEmpty()
  @IsString({ each: true })
  product_ids: string[];
}
