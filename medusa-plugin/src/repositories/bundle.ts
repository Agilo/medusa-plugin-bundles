import { Bundle } from "../models/bundle";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { In, DeleteResult } from "typeorm";

export const BundleRepository = dataSource.getRepository(Bundle).extend({
  async addProducts(bundleId: string, productIds: string[]): Promise<void> {
    const valuesToInsert = productIds.map((id) => ({
      bundle_id: bundleId,
      product_id: id,
    }));

    await this.createQueryBuilder()
      .insert()
      .into(Bundle.bundleProductJoinTable)
      .values(valuesToInsert)
      .orIgnore()
      .execute();
  },
  async removeProducts(
    bundleId: string,
    productIds: string[]
  ): Promise<DeleteResult> {
    return await this.createQueryBuilder()
      .delete()
      .from(Bundle.bundleProductJoinTable)
      .where({
        bundle_id: bundleId,
        product_id: In(productIds),
      })
      .execute();
  },
});

export default BundleRepository;
