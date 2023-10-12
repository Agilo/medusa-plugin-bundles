import { Product } from "@medusajs/medusa";
import { Bundle } from "../models/bundle";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { In } from "typeorm";

export const BundleRepository = dataSource.getRepository(Bundle).extend({
  async bulkAddProducts(bundleId: string, productIds: string[]): Promise<void> {
    // const bundle = await this.findOneByOrFail({ id: bundleId });
    const bundle = await this.findOneOrFail({
      relations: ["products"],
      where: { id: bundleId },
    });

    const products = await dataSource
      .getRepository(Product)
      .findBy({ id: In(productIds) });

    if (products.length === 0) {
      throw new Error("No products found");
    }

    bundle.products = [...bundle.products, ...products];

    await dataSource.manager.save(bundle);

    return Promise.resolve();
  },
  async bulkRemoveProducts(
    bundleId: string,
    productIds: string[]
  ): Promise<void> {
    const bundle = await this.findOneOrFail({
      relations: ["products"],
      where: { id: bundleId },
    });

    bundle.products = bundle.products.filter((product) => {
      return !productIds.includes(product.id);
    });

    await dataSource.manager.save(bundle);

    return Promise.resolve();
  },
});

export default BundleRepository;
