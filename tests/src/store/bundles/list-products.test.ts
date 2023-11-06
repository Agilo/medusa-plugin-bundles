import { isArray, isObject } from "lodash";
import { describe, expect, it } from "vitest";
import config from "../../config";
import { recursiveStripTimestamps } from "../../utils";

function testAndSanitizeData(data: any) {
  recursiveStripTimestamps(data);

  expect(isObject(data)).toBe(true);
  expect(isArray(data.products)).toBe(true);

  data.products.map((product: any) => {
    expect(isObject(product)).toBe(true);
  });
}

describe("/store/bundles/list-products", () => {
  it("should return first page of products", async () => {
    const id = "bundle_coffeemugs01";
    const qs = "offset=0&limit=10";
    const response = await fetch(
      `${config.storeApiUrl}/store/bundles/${id}/products?${qs}`
    );
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-products/list-products-${id}-${qs}.json`
    );
  });

  it("should return second page of products", async () => {
    const id = "bundle_coffeemugs01";
    const qs = "offset=10&limit=10";
    const response = await fetch(
      `${config.storeApiUrl}/store/bundles/${id}/products?${qs}`
    );
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-products/list-products-${id}-${qs}.json`
    );
  });

  it("should return third (empty) page of products", async () => {
    const id = "bundle_coffeemugs01";
    const qs = "offset=20&limit=10";
    const response = await fetch(
      `${config.storeApiUrl}/store/bundles/${id}/products?${qs}`
    );
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-products/list-products-${id}-${qs}.json`
    );
  });

  it("should return properly filtered products when product id provided", async () => {
    const id = "bundle_coffeemugs01";
    const qs =
      "id[]=prod_medusacoffeemug01&id[]=prod_medusacoffeemug02&id[]=prod_medusacoffeemug18";
    const response = await fetch(
      `${config.storeApiUrl}/store/bundles/${id}/products?${qs}`
    );
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-products/list-products-${id}-${qs}.json`
    );
  });

  it("should return empty list of products because product id does not exist", async () => {
    const id = "bundle_coffeemugs01";
    const qs = "id[]=prod_dummy";
    const response = await fetch(
      `${config.storeApiUrl}/store/bundles/${id}/products?${qs}`
    );
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-products/list-products-${id}-${qs}.json`
    );
  });

  it("should return a 404 not found response because bundle does not exist", async () => {
    const id = "bundle_dummy";
    const response = await fetch(
      `${config.storeApiUrl}/store/bundles/${id}/products`
    );
    const data = await response.json();

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-products/list-products-${id}.json`
    );
  });

  it("should return a 404 not found response because bundle is not published", async () => {
    const id = "bundle_coffeemugs11";
    const response = await fetch(
      `${config.storeApiUrl}/store/bundles/${id}/products`
    );
    const data = await response.json();

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-products/list-products-${id}.json`
    );
  });
});
