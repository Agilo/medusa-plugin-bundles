import {
  IsOptional,
  IsString,
  IsEnum,
  NotEquals,
  ValidateIf,
} from "class-validator";
import { Request, Response } from "express";
import { EntityManager } from "typeorm";
import BundleService from "../../../../services/bundle";
import { BundleStatus } from "../../../../models/bundle";
import { validator } from "@medusajs/medusa";

/**
 * @oas [post] /admin/bundles/{id}
 * operationId: "AdminPostBundlesBundle"
 * summary: "Update a Bundle"
 * description: "Update a Bundle's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Bundle.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostBundlesBundleReq"
 * x-codegen:
 *   method: update
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
  const { id } = req.params;

  const validated = await validator(AdminPostBundlesBundleReq, req.body);

  const bundleService: BundleService = req.scope.resolve("bundleService");
  const manager: EntityManager = req.scope.resolve("manager");

  const updated = await manager.transaction(async (transactionManager) => {
    return await bundleService
      .withTransaction(transactionManager)
      .update(id, validated);
  });

  const bundle = await bundleService.retrieve(updated.id, {
    relations: ["products"],
  });

  res.status(200).json({ bundle });
};

/**
 * @schema AdminPostBundlesBundleReq
 * type: object
 * properties:
 *   title:
 *     description: "The title of the Bundle"
 *     type: string
 *   description:
 *     description: "The description of the Bundle."
 *     type: string
 *   status:
 *     description: The status of the bundle. The bundle is shown to the customer only if its status is `published`.
 *     type: string
 *     enum: [draft, published]
 */
export class AdminPostBundlesBundleReq {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(BundleStatus)
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  status?: BundleStatus;
}
