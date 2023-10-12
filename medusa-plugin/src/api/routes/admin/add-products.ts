import { ArrayNotEmpty, IsString } from "class-validator";
import { Request, Response } from "express";
import { EntityManager } from "typeorm";
import BundleService from "../../../services/bundle";

export default async (req: Request, res: Response) => {
  const { id } = req.params;
  const { validatedBody } = req as {
    validatedBody: AdminPostProductsToBundleReq;
  };

  const bundleService: BundleService = req.scope.resolve("bundleService");

  const manager: EntityManager = req.scope.resolve("manager");
  const updated = await manager.transaction(async (transactionManager) => {
    return await bundleService
      .withTransaction(transactionManager)
      .addProducts(id, validatedBody.product_ids);
  });

  const bundle = await bundleService.retrieve(updated.id);

  res.status(200).json({ bundle });
};

export class AdminPostProductsToBundleReq {
  @ArrayNotEmpty()
  @IsString({ each: true })
  product_ids: string[];
}
