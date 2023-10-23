import { IsString, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { Request, Response } from "express";
import BundleService from "../../../../services/bundle";

/**
 * @oas [get] /store/bundles/{id}/products
 * operationId: GetBundlesBundleProducts
 * summary: List Bundle Products
 * description: |
 *   Retrieves a list of products.
 * parameters:
 *   - (path) id=* {string} The ID of the Bundle.
 *   - (query) q {string} term used to search bundles' title and description.
 *   - (query) offset=0 {integer} The number of bundles to skip when retrieving the bundles.
 *   - (query) limit=10 {integer} Limit the number of bundles returned.
 * x-codegen:
 *   method: list
 *   queryParams: StoreGetBundlesBundleProductsParams
 * tags:
 *   - Bundles
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreBundlesBundleProductsListRes"
 */
export default async (req, res) => {
  const { id } = req.params;
  const { skip, take } = req.listConfig;

  const bundleService: BundleService = req.scope.resolve("bundleService");

  req.filterableFields["status"] = "published";

  const [products, count] = await bundleService.listAndCountProducts(
    {
      bundle_id: id,
      ...req.filterableFields,
    },
    req.listConfig
  );

  res.status(200).json({
    products,
    count,
    offset: skip,
    limit: take,
  });
};

export class StoreGetBundlesBundleProductsParams {
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
