import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Request, Response } from "express";
import { EntityManager } from "typeorm";
import BundleService from "../../../../services/bundle";

/**
 * @oas [post] /admin/bundles
 * operationId: "AdminPostBundles"
 * summary: "Create a Bundle"
 * x-authenticated: true
 * description: "Create a new Bundle. This endpoint can also be used to create a gift card if the `is_giftcard` field is set to `true`."
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostBundlesReq"
 * x-codegen:
 *   method: create
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
 *           $ref: "#/components/schemas/AdminBundlesRes"
 */
export default async (req: Request, res: Response) => {
  const { validatedBody } = req as { validatedBody: AdminPostBundlesReq };

  const bundleService: BundleService = req.scope.resolve("bundleService");
  const manager: EntityManager = req.scope.resolve("manager");

  const created = await manager.transaction(async (transactionManager) => {
    return await bundleService
      .withTransaction(transactionManager)
      .create(validatedBody);
  });

  const bundle = await bundleService.retrieve(
    created.id,
    {},
    {
      relations: ["products"],
    }
  );

  res.status(200).json({
    bundle,
  });
};

/**
 * @schema AdminPostBundlesReq
 * type: object
 * required:
 *   - title
 * properties:
 *   title:
 *     description: "The title of the Bundle"
 *     type: string
 *   handle:
 *     type: string
 *     description: An optional handle to be used in slugs. If none is provided, the kebab-case version of the title will be used.
 *   description:
 *     description: "The description of the Bundle."
 *     type: string
 */
export class AdminPostBundlesReq {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  handle?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
