import { cleanResponseData } from "@medusajs/medusa";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import BundleService from "../../../../services/bundle";

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
 *   - (query) product_id {string} Filter by product ID. When provided, only bundles that contain the specified product are retrieved.
 *   - (query) handle {string} Filter by handle.
 * x-codegen:
 *   method: list
 *   queryParams: StoreGetBundlesParams
 * tags:
 *   - Bundles
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

  const [bundles, count] = await bundleService.listAndCount(
    {
      ...req.filterableFields,
      product_status: ["published"],
    },
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

  @IsString()
  @IsOptional()
  @Type(() => String)
  product_id: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  handle?: string;
}
