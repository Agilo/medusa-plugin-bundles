import { describe, expect, expectTypeOf, it } from "vitest";
import config from "../../config";

function testAndSanitizeData(data: any) {
  expectTypeOf(data).toBeObject();
  expectTypeOf(data.bundle).toBeObject();

  expectTypeOf(data.bundle.created_at).toBeString();
  expectTypeOf(data.bundle.updated_at).toBeString();

  delete data.bundle["created_at"];
  delete data.bundle["updated_at"];
}

describe("store-get-bundle", () => {
  it("should return a bundle", async () => {
    const id = "bundle_coffeemugs01";
    const response = await fetch(`${config.storeApiUrl}/store/bundles/${id}`);
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/get-bundle/get-bundle-${id}.json`
    );
  });

  it("should not return a bundle which is draft", async () => {
    const id = "bundle_coffeemugs11";
    const response = await fetch(`${config.storeApiUrl}/store/bundles/${id}`);
    const data = await response.json();

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/get-bundle/get-bundle-${id}.json`
    );
  });

  it("should not return a bundle which does not exist", async () => {
    const id = "bundle_dummy";
    const response = await fetch(`${config.storeApiUrl}/store/bundles/${id}`);
    const data = await response.json();

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/get-bundle/get-bundle-${id}.json`
    );
  });
});
