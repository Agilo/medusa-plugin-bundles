import BundleService from "../../../../services/bundle";

/**
 * @oas [get] /admin/bundles/{id}
 * operationId: "AdminGetBundlesBundle"
 * summary: "Get a Bundle"
 * description: "Retrieve a Bundle's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Bundle.
 * x-codegen:
 *   method: retrieve
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
export default async (req, res) => {
  const { id } = req.params;
  const bundleService: BundleService = req.scope.resolve("bundleService");
  const bundle = await bundleService.retrieve(id, { relations: ["products"] });
  res.json({ bundle });
};
