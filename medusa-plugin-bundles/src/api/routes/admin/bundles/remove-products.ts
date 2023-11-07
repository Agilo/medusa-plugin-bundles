import { ArrayNotEmpty, IsString } from "class-validator";
import { Request, Response } from "express";
import { EntityManager } from "typeorm";
import BundleService from "../../../../services/bundle";

/**
 * @oas [delete] /admin/bundles/{id}/products/batch
 * operationId: "DeleteProductsFromBundle"
 * summary: "Remove Products from Bundle"
 * description: "Remove a list of products from a bundle. This would not delete the product, only the association between the product and the bundle."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product Bundle.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminDeleteProductsFromBundleReq"
 * x-codegen:
 *   method: removeProducts
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Product Bundles
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/AdminDeleteProductsFromBundleRes"
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params;
  const { validatedBody } = req as {
    validatedBody: AdminDeleteProductsFromBundleReq;
  };

  const bundleService: BundleService = req.scope.resolve("bundleService");

  const manager: EntityManager = req.scope.resolve("manager");
  await manager.transaction(async (transactionManager) => {
    return await bundleService
      .withTransaction(transactionManager)
      .removeProducts(id, validatedBody.product_ids);
  });

  res.json({
    id,
    object: "product-bundle",
    removed_products: validatedBody.product_ids,
  });
};

/**
 * @schema AdminDeleteProductsFromBundleReq
 * type: object
 * required:
 *   - product_ids
 * properties:
 *   product_ids:
 *     description: "An array of Product IDs to remove from the Product Bundle."
 *     type: array
 *     items:
 *       description: "The ID of a Product to add to the Product Bundle."
 *       type: string
 */
export class AdminDeleteProductsFromBundleReq {
  @ArrayNotEmpty()
  @IsString({ each: true })
  product_ids: string[];
}
