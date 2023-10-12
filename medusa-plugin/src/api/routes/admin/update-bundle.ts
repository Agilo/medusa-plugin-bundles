import { IsOptional, IsString } from "class-validator";
import { Request, Response } from "express";
import { EntityManager } from "typeorm";
import BundleService from "../../../services/bundle";

export default async (req: Request, res: Response) => {
  const { id } = req.params;
  const { validatedBody } = req as { validatedBody: AdminUpdateBundleReq };

  const bundleService: BundleService = req.scope.resolve("bundleService");
  const manager: EntityManager = req.scope.resolve("manager");

  const updated = await manager.transaction(async (transactionManager) => {
    return await bundleService
      .withTransaction(transactionManager)
      .update(id, validatedBody);
  });

  const bundle = await bundleService.retrieve(updated.id, {
    relations: ["products"],
  });

  res.status(200).json({ bundle });
};

export class AdminUpdateBundleReq {
  @IsString()
  @IsOptional()
  title: string;

  // @IsString()
  // @IsOptional()
  // handle?: string

  @IsString()
  @IsOptional()
  description?: string;

  // @IsObject()
  // @IsOptional()
  // metadata?: Record<string, unknown>
}
