import BundleService from "../../../../services/bundle";
import { cleanResponseData } from "@medusajs/medusa";

/**
 * @oas [get] /store/bundles/{id}
 * operationId: GetBundlesBundle
 * summary: Get a Bundle
 * description: |
 *   Retrieve a Bundle's details.
 *
 * parameters:
 *   - (path) id=* {string} The ID of the Bundle.
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

  const bundle = await bundleService.retrieve(id, { relations: ["products"] });

  res.json({
    bundle: cleanResponseData(bundle, [
      "id",
      "title",
      "description",
      "status",
      "products",
      "created_at",
      "updated_at",
    ]),
  });
};
