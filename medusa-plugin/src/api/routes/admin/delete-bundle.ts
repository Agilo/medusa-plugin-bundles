import { EntityManager } from "typeorm";
import BundleService from "../../../services/bundle";

export type AdminBundleDeleteRes = {
  id: string;
  object: "bundle";
  deleted: true;
};

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
