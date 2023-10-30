import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { uniq } from "lodash";
import { DeleteResult, In } from "typeorm";
import { Bundle } from "../models/bundle";

export const BundleRepository = dataSource.getRepository(Bundle).extend({
  async listProductIds(id: string): Promise<string[]> {
    /**
     * TODO: the generated query looks like below, see if we can select only from ""public"."bundle_product"" instead.
     *
     * `qb.getQuery() SELECT product_id FROM "public"."bundle" "Bundle", "public"."bundle_product" "public.bundle_product" WHERE "public.bundle_product"."bundle_id" = :orm_param_0`
     */
    const results = await this.createQueryBuilder()
      .select(["product_id"])
      .from(Bundle.bundleProductJoinTable)
      .where({ bundle_id: id })
      .execute();
    return uniq(results.map((result) => result.product_id));
  },
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
