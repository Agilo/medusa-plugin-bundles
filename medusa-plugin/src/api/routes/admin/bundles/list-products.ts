import { IsString, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { Request, Response } from "express";
import BundleService from "../../../../services/bundle";

export default async (req: Request, res: Response) => {
  const { id } = req.params;
  const { skip, take } = req.listConfig;

  const bundleService: BundleService = req.scope.resolve("bundleService");

  const [products, count] = await bundleService.listAndCountProducts(
    {
      bundle_id: id,
      ...req.filterableFields,
    },
    // req.listConfig
  );

  res.status(200).json({
    products,
    count,
    offset: skip,
    limit: take,
  });
};

export class AdminListBundleProductsParams {
  @IsString()
  @IsOptional()
  @Type(() => String)
  q?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
