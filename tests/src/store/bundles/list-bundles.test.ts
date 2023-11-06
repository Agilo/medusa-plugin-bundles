import { isArray, isObject } from "lodash";
import { describe, expect, it } from "vitest";
import config from "../../config";
import { recursiveStripTimestamps } from "../../utils";

function testAndSanitizeData(data: any) {
  recursiveStripTimestamps(data);

  expect(isObject(data)).toBe(true);
  expect(isArray(data.bundles)).toBe(true);

  data.bundles.map((bundle: any) => {
    expect(isObject(bundle)).toBe(true);
  });
}

describe("/store/bundles/list-bundles", () => {
  it("should return default first page of bundles", async () => {
    const response = await fetch(`${config.storeApiUrl}/store/bundles`);
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-bundles/list-bundles.json`
    );
  });

  it("should return first page of bundles", async () => {
    const qs = "offset=0&limit=5";

    const response = await fetch(`${config.storeApiUrl}/store/bundles?${qs}`);
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-bundles/list-bundles-${qs}.json`
    );
  });

  it("should return second page of bundles", async () => {
    const qs = "offset=5&limit=5";

    const response = await fetch(`${config.storeApiUrl}/store/bundles?${qs}`);
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-bundles/list-bundles-${qs}.json`
    );
  });

  it("should return third page of bundles", async () => {
    const qs = "offset=10&limit=5";

    const response = await fetch(`${config.storeApiUrl}/store/bundles?${qs}`);
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-bundles/list-bundles-${qs}.json`
    );
  });

  it("should return fourth page of bundles", async () => {
    const qs = "offset=15&limit=5";

    const response = await fetch(`${config.storeApiUrl}/store/bundles?${qs}`);
    const data = await response.json();

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-bundles/list-bundles-${qs}.json`
    );
  });

  it("should return a list of searched bundles", async () => {
    const qs = "q=coffee&offset=0&limit=100";

    const response = await fetch(`${config.storeApiUrl}/store/bundles?${qs}`);
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-bundles/list-bundles-${qs}.json`
    );
  });

  it("should return a list of bundles that contain product_id", async () => {
    const qs = "product_id=prod_medusacoffeemug02";

    const response = await fetch(`${config.storeApiUrl}/store/bundles?${qs}`);
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-bundles/list-bundles-${qs}.json`
    );
  });

  it("should return an empty list of bundles because product_id does not exist", async () => {
    const qs = "product_id=prod_dummy";

    const response = await fetch(`${config.storeApiUrl}/store/bundles?${qs}`);
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-bundles/list-bundles-${qs}.json`
    );
  });

  it("should return a single bundle by handle", async () => {
    const qs = "handle=coffee-mugs-02";

    const response = await fetch(`${config.storeApiUrl}/store/bundles?${qs}`);
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-bundles/list-bundles-by-handle-${qs}.json`
    );
  });

  it("should return an empty list of bundles because handle does not exist", async () => {
    const qs = "handle=coffee-mugs-dummy";

    const response = await fetch(`${config.storeApiUrl}/store/bundles?${qs}`);
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-bundles/list-bundles-by-handle-${qs}.json`
    );
  });

  it("should return an empty list of bundles because bundle with handle is not published", async () => {
    const qs = "handle=coffee-mugs-11";

    const response = await fetch(`${config.storeApiUrl}/store/bundles?${qs}`);
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-bundles/list-bundles-by-handle-${qs}.json`
    );
  });
});
