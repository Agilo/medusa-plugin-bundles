import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import BundleService from "../../../../services/bundle";

/**
 * @oas [get] /admin/bundles
 * operationId: "AdminGetBundles"
 * summary: "List Bundles"
 * description: "Retrieve a list of bundles."
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} term to search bundles' title and description.
 *   - (query) offset=0 {integer} The number of bundles to skip when retrieving the bundles.
 *   - (query) limit=10 {integer} Limit the number of bundles returned.
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

  console.log("req.listConfig", req.listConfig);

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
