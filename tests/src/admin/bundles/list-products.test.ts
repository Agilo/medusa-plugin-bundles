import { isArray, isObject } from "lodash";
import { describe, expect, it } from "vitest";
import config from "../../config";
import { recursiveStripProps } from "../../utils";

function testAndSanitizeData(data: any) {
  recursiveStripProps(data, [
    "data.products.created_at",
    "data.products.images.created_at",
    "data.products.images.id",
    "data.products.images.updated_at",
    "data.products.options.created_at",
    "data.products.options.id",
    "data.products.options.updated_at",
    "data.products.options.values.created_at",
    "data.products.options.values.id",
    "data.products.options.values.option_id",
    "data.products.options.values.updated_at",
    "data.products.options.values.variant_id",
    "data.products.profile_id",
    "data.products.profile.created_at",
    "data.products.profile.id",
    "data.products.profile.updated_at",
    "data.products.profiles.created_at",
    "data.products.profiles.id",
    "data.products.profiles.updated_at",
    "data.products.sales_channels.created_at",
    "data.products.sales_channels.id",
    "data.products.sales_channels.updated_at",
    "data.products.updated_at",
    "data.products.updated_at",
    "data.products.variants.created_at",
    "data.products.variants.id",
    "data.products.variants.options.created_at",
    "data.products.variants.options.id",
    "data.products.variants.options.option_id",
    "data.products.variants.options.updated_at",
    "data.products.variants.options.variant_id",
    "data.products.variants.prices.created_at",
    "data.products.variants.prices.id",
    "data.products.variants.prices.updated_at",
    "data.products.variants.prices.variant_id",
    "data.products.variants.updated_at",
  ]);

  expect(isObject(data)).toBe(true);
  expect(isArray(data.products)).toBe(true);

  data.products.map((product: any) => {
    expect(isObject(product)).toBe(true);
  });
}

describe("/admin/bundles/list-products", () => {
  it("should return 401 unauthorized", async () => {
    const id = "bundle_coffeemugs01";
    const response = await fetch(
      `${config.apiUrl}/admin/bundles/${id}/products`
    );
    const data = await response.text();

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-products/list-products-401-${id}.json`
    );
  });

  it("should return first page of products", async () => {
    const id = "bundle_coffeemugs01";
    const qs = "offset=0&limit=20";
    const response = await fetch(
      `${config.apiUrl}/admin/bundles/${id}/products?${qs}`,
      {
        headers: {
          "x-medusa-access-token": config.apiToken,
        },
      }
    );
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-products/list-products-${id}-${qs}.json`
    );
  });

  it("should return second page of products", async () => {
    const id = "bundle_coffeemugs01";
    const qs = "offset=20&limit=20";
    const response = await fetch(
      `${config.apiUrl}/admin/bundles/${id}/products?${qs}`,
      {
        headers: {
          "x-medusa-access-token": config.apiToken,
        },
      }
    );
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-products/list-products-${id}-${qs}.json`
    );
  });

  it("should return third (empty) page of products", async () => {
    const id = "bundle_coffeemugs01";
    const qs = "offset=40&limit=20";
    const response = await fetch(
      `${config.apiUrl}/admin/bundles/${id}/products?${qs}`,
      {
        headers: {
          "x-medusa-access-token": config.apiToken,
        },
      }
    );
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-products/list-products-${id}-${qs}.json`
    );
  });

  it("should return properly filtered products when product id provided", async () => {
    const id = "bundle_coffeemugs01";
    const qs =
      "id[]=prod_medusacoffeemug01&id[]=prod_medusacoffeemug02&id[]=prod_medusacoffeemug18";
    const response = await fetch(
      `${config.apiUrl}/admin/bundles/${id}/products?${qs}`,
      {
        headers: {
          "x-medusa-access-token": config.apiToken,
        },
      }
    );
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-products/list-products-${id}-${qs}.json`
    );
  });

  it("should return empty list of products because product id does not exist", async () => {
    const id = "bundle_coffeemugs01";
    const qs = "id[]=prod_dummy";
    const response = await fetch(
      `${config.apiUrl}/admin/bundles/${id}/products?${qs}`,
      {
        headers: {
          "x-medusa-access-token": config.apiToken,
        },
      }
    );
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-products/list-products-${id}-${qs}.json`
    );
  });

  it("should return a 404 not found response because bundle does not exist", async () => {
    const id = "bundle_dummy";
    const response = await fetch(
      `${config.apiUrl}/admin/bundles/${id}/products`,
      {
        headers: {
          "x-medusa-access-token": config.apiToken,
        },
      }
    );
    const data = await response.json();

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-products/list-products-${id}.json`
    );
  });

  it("should return a list of products even if bundle is not published", async () => {
    const id = "bundle_coffeemugs11";
    const response = await fetch(
      `${config.apiUrl}/admin/bundles/${id}/products`,
      {
        headers: {
          "x-medusa-access-token": config.apiToken,
        },
      }
    );
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-products/list-products-${id}.json`
    );
  });
});
