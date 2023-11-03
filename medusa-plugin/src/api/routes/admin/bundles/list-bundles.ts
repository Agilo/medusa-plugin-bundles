import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import BundleService from "../../../../services/bundle";

/**
 * @oas [get] /admin/bundles
 * operationId: AdminGetBundles
 * summary: List Bundles
 * description: |
 *   Retrieves a list of bundles. The bundles can be filtered by `q` field. The bundles can also be paginated.
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} term used to search bundles' title and description.
 *   - (query) offset=0 {integer} The number of bundles to skip when retrieving the bundles.
 *   - (query) limit=10 {integer} Limit the number of bundles returned.
 *   - (query) product_id {string} Filter by product ID. When provided, only bundles that contain the specified product are retrieved.
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetBundlesParams
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Bundles
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminBundlesListRes"
 */
export default async (req, res) => {
  const { skip, take } = req.listConfig;

  const bundleService: BundleService = req.scope.resolve("bundleService");

  const [bundles, count] = await bundleService.listAndCount(
    req.filterableFields,
    req.listConfig
  );

  res.json({
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

  @IsString()
  @IsOptional()
  @Type(() => String)
  product_id: string;
}
