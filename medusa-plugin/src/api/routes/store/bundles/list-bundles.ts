// import { DateComparisonOperator } from "@medusajs/medusa";
import { IsOptional, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";
import BundleService from "../../../../services/bundle";
import { cleanResponseData } from "@medusajs/medusa";

/**
 * @oas [get] /store/bundles
 * operationId: GetBundles
 * summary: List Bundles
 * description: |
 *   Retrieves a list of bundles. The bundles can be filtered by `q` field. The bundles can also be paginated.
 * parameters:
 *   - (query) q {string} term used to search bundles' title and description.
 *   - (query) offset=0 {integer} The number of bundles to skip when retrieving the bundles.
 *   - (query) limit=10 {integer} Limit the number of bundles returned.
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreBundlesListRes"
 */
export default async (req, res) => {
  const bundleService: BundleService = req.scope.resolve("bundleService");

  const validated = req.validatedQuery as StoreGetBundlesParams;

  // get only published bundles for store endpoint
  req.filterableFields["status"] = "published";

  console.log("req.listConfig", req.listConfig);

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
  limit?: number = 10;

  // @IsString()
  // @IsOptional()
  // order?: string;

  // @IsOptional()
  // @IsType([String, [String]])
  // id?: string | string[];

  @IsString()
  @IsOptional()
  q?: string;

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
