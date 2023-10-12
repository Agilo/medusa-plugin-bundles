// import { DateComparisonOperator } from "@medusajs/medusa";
import { IsOptional, ValidateNested, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import BundleService from "../../../services/bundle";
import { cleanResponseData } from "@medusajs/medusa";

export default async (req, res) => {
  const bundleService: BundleService = req.scope.resolve("bundleService");

  const validated = req.validatedQuery as StoreGetBundlesParams;

  const [bundles, count] = await bundleService.listAndCount(
    req.filterableFields,
    req.listConfig
  );

  res.json({
    bundles: cleanResponseData(bundles, req.allowedProperties || []),
    count,
    offset: validated.offset,
    limit: validated.limit,
  });
};

export class StoreGetBundlesParams {
  // @IsString()
  // @IsOptional()
  // expand?: string;

  // @IsString()
  // @IsOptional()
  // fields?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 100;

  // @IsString()
  // @IsOptional()
  // order?: string;

  // @IsOptional()
  // @IsType([String, [String]])
  // id?: string | string[];

  // @IsString()
  // @IsOptional()
  // q?: string;

  // @IsArray()
  // @IsOptional()
  // collection_id?: string[];

  // @IsArray()
  // @IsOptional()
  // tags?: string[];

  // @IsString()
  // @IsOptional()
  // title?: string;

  // @IsString()
  // @IsOptional()
  // description?: string;

  // @IsString()
  // @IsOptional()
  // handle?: string;

  // @IsBoolean()
  // @IsOptional()
  // @Transform(({ value }) => optionalBooleanMapper.get(value.toLowerCase()))
  // is_giftcard?: boolean;

  // @IsArray()
  // @IsOptional()
  // type_id?: string[];

  // @FeatureFlagDecorators(SalesChannelFeatureFlag.key, [IsOptional(), IsArray()])
  // sales_channel_id?: string[];

  // @IsArray()
  // @IsOptional()
  // category_id?: string[];

  // @IsBoolean()
  // @IsOptional()
  // @Transform(({ value }) => optionalBooleanMapper.get(value.toLowerCase()))
  // include_category_children?: boolean;

  // @IsOptional()
  // @ValidateNested()
  // @Type(() => DateComparisonOperator)
  // created_at?: DateComparisonOperator;

  // @IsOptional()
  // @ValidateNested()
  // @Type(() => DateComparisonOperator)
  // updated_at?: DateComparisonOperator;
}
