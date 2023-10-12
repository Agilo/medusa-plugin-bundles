import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Request, Response } from "express";
import { EntityManager } from "typeorm";
import BundleService from "../../../services/bundle";

export default async (req: Request, res: Response) => {
  const { validatedBody } = req as { validatedBody: AdminCreateBundleReq };

  const bundleService: BundleService = req.scope.resolve("bundleService");
  const manager: EntityManager = req.scope.resolve("manager");

  const created = await manager.transaction(async (transactionManager) => {
    return await bundleService
      .withTransaction(transactionManager)
      .create(validatedBody);
  });

  const bundle = await bundleService.retrieve(created.id, {
    relations: ["products"],
  });

  res.status(200).json({
    bundle,
  });
};

export class AdminCreateBundleReq {
  @IsString()
  @IsNotEmpty()
  title: string;

  // @IsString()
  // @IsOptional()
  // handle?: string;

  @IsString()
  @IsOptional()
  description?: string;

  // @IsObject()
  // @IsOptional()
  // metadata?: Record<string, unknown>;
}
