import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import BundleService from "../../../services/bundle";

export default async (req, res) => {
  const { skip, take } = req.listConfig;

  const bundleService: BundleService = req.scope.resolve("bundleService");

  const [bundles, count] = await bundleService.listAndCount(
    req.filterableFields,
    req.listConfig
  );

  res.status(200).json({
    bundles,
    count,
    offset: skip,
    limit: take,
  });
};

export class AdminGetBundlesParams {
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
