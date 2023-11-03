import { cleanResponseData } from "@medusajs/medusa";
import { BundleStatus } from "../../../../models/bundle";
import BundleService from "../../../../services/bundle";

/**
 * @oas [get] /store/bundles/{id}
 * operationId: GetBundlesBundle
 * summary: Get a Bundle
 * description: |
 *   Retrieve a Bundle's details.
 *
 * parameters:
 *   - (path) id=* {string} The ID of the Bundle.
 * x-codegen:
 *   method: retrieve
 * tags:
 *   - Bundles
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreBundlesRes"
 */
export default async (req, res) => {
  const { id } = req.params;
  const bundleService: BundleService = req.scope.resolve("bundleService");

  /**
   * We don't want to include products relation here because we don't want to deal with
   * cleanResponseData(bundle.products) and selecting only published products,
   * there's a /store/bundles/{id}/products endpoint for that.
   */
  const bundle = await bundleService.retrieve(id, {
    status: BundleStatus.PUBLISHED,
  });

  res.json({
    bundle: cleanResponseData(bundle, [
      "id",
      "title",
      "description",
      "status",
      // "products",
      "created_at",
      "updated_at",
    ]),
  });
};
