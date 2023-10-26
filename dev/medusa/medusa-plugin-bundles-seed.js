const express = require("express");
const fs = require("fs");
const { GracefulShutdownServer, getConfigFile } = require("medusa-core-utils");

const loaders = require("@medusajs/medusa/dist/loaders/index").default;

(async () => {
  /**
   * @param {string} directory The directory to find the config file in.
   * @param {string} seedFile Absolute path to the seed file
   */
  async function seed(directory, seedFile) {
    const app = express();
    const { container } = await loaders({
      directory,
      expressApp: app,
      isTest: false,
    });

    const manager = container.resolve("manager");

    const storeService = container.resolve("storeService");
    const userService = container.resolve("userService");
    const regionService = container.resolve("regionService");
    const productService = container.resolve("productService");
    const productCategoryService = container.resolve("productCategoryService");
    const publishableApiKeyService = container.resolve(
      "publishableApiKeyService"
    );
    const salesChannelService = container.resolve("salesChannelService");

    /* eslint-disable */
    const productVariantService = container.resolve("productVariantService");
    const shippingOptionService = container.resolve("shippingOptionService");
    const shippingProfileService = container.resolve("shippingProfileService");
    /* eslint-enable */

    const bundleService = container.resolve("bundleService");

    const {
      store: seededStore,
      regions,
      products,
      categories = [],
      shipping_options,
      users,
      publishable_api_keys = [],
      bundles = [],
    } = JSON.parse(fs.readFileSync(seedFile, `utf-8`));

    await manager.transaction(async (tx) => {
      const gcProfile = await shippingProfileService.retrieveGiftCardDefault();
      const defaultProfile = await shippingProfileService.retrieveDefault();

      if (seededStore) {
        await storeService.withTransaction(tx).update(seededStore);
      }

      const store = await storeService.retrieve();

      for (const u of users) {
        const pass = u.password;
        if (pass) {
          delete u.password;
        }
        await userService.withTransaction(tx).create(u, pass);
      }

      const regionIds = {};
      for (const r of regions) {
        let dummyId;
        if (!r.id || !r.id.startsWith("reg_")) {
          dummyId = r.id;
          delete r.id;
        }

        const reg = await regionService.withTransaction(tx).create(r);

        if (dummyId) {
          regionIds[dummyId] = reg.id;
        }
      }

      for (const so of shipping_options) {
        if (regionIds[so.region_id]) {
          so.region_id = regionIds[so.region_id];
        }

        so.profile_id = defaultProfile.id;
        if (so.is_giftcard) {
          so.profile_id = gcProfile.id;
          delete so.is_giftcard;
        }

        await shippingOptionService.withTransaction(tx).create(so);
      }

      const createProductCategory = async (
        parameters,
        parentCategoryId = null
      ) => {
        // default to the categories being visible and public
        parameters.is_active = parameters.is_active || true;
        parameters.is_internal = parameters.is_internal || false;
        parameters.parent_category_id = parentCategoryId;

        const categoryChildren = parameters.category_children || [];
        delete parameters.category_children;

        const category = await productCategoryService
          .withTransaction(tx)
          .create(parameters);

        if (categoryChildren.length) {
          for (const categoryChild of categoryChildren) {
            await createProductCategory(categoryChild, category.id);
          }
        }
      };

      for (const c of categories) {
        await createProductCategory(c);
      }

      for (const p of products) {
        const variants = p.variants;
        delete p.variants;

        // default to the products being visible
        p.status = p.status || "published";

        p.sales_channels = [{ id: store.default_sales_channel_id }];

        p.profile_id = defaultProfile.id;
        if (p.is_giftcard) {
          p.profile_id = gcProfile.id;
        }

        const newProd = await productService.withTransaction(tx).create(p);

        if (variants && variants.length) {
          const optionIds = p.options.map(
            (o) => newProd.options.find((newO) => newO.title === o.title)?.id
          );

          for (const v of variants) {
            const variant = {
              ...v,
              options: v.options.map((o, index) => ({
                ...o,
                option_id: optionIds[index],
              })),
            };

            await productVariantService
              .withTransaction(tx)
              .create(newProd.id, variant);
          }
        }
      }

      let defaultSalesChannel = null;

      try {
        defaultSalesChannel = await salesChannelService
          .withTransaction(tx)
          .retrieveDefault();
      } catch (e) {
        defaultSalesChannel = null;
      }

      for (const pak of publishable_api_keys) {
        const publishableApiKey = await publishableApiKeyService
          .withTransaction(tx)
          .create(pak, {
            loggedInUserId: "",
          });

        // attach to default sales channel if exists
        if (defaultSalesChannel) {
          await publishableApiKeyService.addSalesChannels(
            publishableApiKey.id,
            [defaultSalesChannel.id]
          );
        }
      }

      for (const b of bundles) {
        const bundle = await bundleService.withTransaction(tx).create(b);
        await bundleService
          .withTransaction(tx)
          .addProducts(bundle.id, b.products);
      }
    });
  }

  await seed(
    `${process.cwd()}`,
    `${process.cwd()}/data/seed-medusa-plugin-bundles.json`
  );
})();
