import { isObject } from "lodash";
import { describe, expect, it } from "vitest";
import config from "../../config";
import { recursiveStripTimestamps } from "../../utils";

function testAndSanitizeData(data: any) {
  expect(isObject(data)).toBe(true);
  expect(isObject(data.bundle)).toBe(true);

  expect(typeof data.bundle.created_at).toBe("string");
  expect(typeof data.bundle.updated_at).toBe("string");

  recursiveStripTimestamps(data);
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

  it("should return a 404 not found response because bundle does not exist", async () => {
    const id = "bundle_dummy";
    const response = await fetch(`${config.storeApiUrl}/store/bundles/${id}`);
    const data = await response.json();

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/get-bundle/get-bundle-${id}.json`
    );
  });

  it("should return a 404 not found response because bundle is not published", async () => {
    const id = "bundle_coffeemugs11";
    const response = await fetch(`${config.storeApiUrl}/store/bundles/${id}`);
    const data = await response.json();

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/get-bundle/get-bundle-${id}.json`
    );
  });
});
