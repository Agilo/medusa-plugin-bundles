import { describe, expect, expectTypeOf, it } from "vitest";
import config from "../../config";

function testAndSanitizeData(data: any) {
  expectTypeOf(data).toBeObject();
  expectTypeOf(data.bundles).toBeArray();

  data.bundles.map((bundle: any) => {
    expectTypeOf(bundle).toBeObject();
    expectTypeOf(bundle.created_at).toBeString();
    expectTypeOf(bundle.updated_at).toBeString();

    delete bundle["created_at"];
    delete bundle["updated_at"];
  });
}

describe("/store/bundles/list-bundles", () => {
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

  it("should return a list of bundles", async () => {
    const response = await fetch(`${config.storeApiUrl}/store/bundles`);
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/store/bundles/list-bundles/list-bundles.json`
    );
  });
});
