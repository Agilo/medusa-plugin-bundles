import { EntityManager } from "typeorm";
import BundleService from "../../../../services/bundle";

/**
 * @oas [delete] /admin/bundles/{id}
 * operationId: "AdminDeleteBundlesBundle"
 * summary: "Delete a Bundle"
 * description: "Delete a Bundle."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Bundle.
 * x-codegen:
 *   method: delete
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
 *           $ref: "#/components/schemas/AdminBundlesDeleteRes"
 */
export default async (req, res) => {
  const { id } = req.params;

  const bundleService: BundleService = req.scope.resolve("bundleService");
  const manager: EntityManager = req.scope.resolve("manager");
  await manager.transaction(async (transactionManager) => {
    return await bundleService.withTransaction(transactionManager).delete(id);
  });

  res.json({
    id,
    object: "bundle",
    deleted: true,
  });
};
