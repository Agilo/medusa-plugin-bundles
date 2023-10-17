import { ArrayNotEmpty, IsString } from "class-validator";
import { Request, Response } from "express";
import { EntityManager } from "typeorm";
import BundleService from "../../../../services/bundle";

/**
 * @oas [post] /admin/bundles/{id}/products/batch
 * operationId: "AdminPostProductsToBundle"
 * summary: "Add Products to Bundle"
 * description: "Add products to a product bundle."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the product bundle.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostProductsToBundleReq"
 * x-codegen:
 *   method: addProducts
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
 *          $ref: "#/components/schemas/AdminBundlesRes"
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params;
  const { validatedBody } = req as {
    validatedBody: AdminPostProductsToBundleReq;
  };

  const bundleService: BundleService = req.scope.resolve("bundleService");

  const manager: EntityManager = req.scope.resolve("manager");
  const updated = await manager.transaction(async (transactionManager) => {
    return await bundleService
      .withTransaction(transactionManager)
      .addProducts(id, validatedBody.product_ids);
  });

  const bundle = await bundleService.retrieve(updated.id);

  res.status(200).json({ bundle });
};

/**
 * @schema AdminPostProductsToBundleReq
 * type: object
 * required:
 *   - product_ids
 * properties:
 *   product_ids:
 *     description: "An array of Product IDs to add to the Product Bundle."
 *     type: array
 *     items:
 *       description: "The ID of a Product to add to the Product Bundle."
 *       type: string
 */
export class AdminPostProductsToBundleReq {
  @ArrayNotEmpty()
  @IsString({ each: true })
  product_ids: string[];
}
