import { isArray, isObject } from "lodash";
import { describe, expect, it } from "vitest";
import config from "../../config";
import { recursiveStripProps } from "../../utils";

function testAndSanitizeData(data: any) {
  recursiveStripProps(data, [
    "data.bundles.created_at",
    "data.bundles.updated_at",
  ]);

  expect(isObject(data)).toBe(true);
  expect(isArray(data.bundles)).toBe(true);

  data.bundles.map((bundle: any) => {
    expect(isObject(bundle)).toBe(true);
  });
}

describe("/admin/bundles/list-bundles", () => {
  it("should return default first page of bundles", async () => {
    const response = await fetch(`${config.apiUrl}/admin/bundles`, {
      headers: {
        "x-medusa-access-token": config.apiToken,
      },
    });
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-bundles/list-bundles.json`
    );
  });

  it("should return first page of bundles", async () => {
    const qs = "offset=0&limit=10";

    const response = await fetch(`${config.apiUrl}/admin/bundles?${qs}`, {
      headers: {
        "x-medusa-access-token": config.apiToken,
      },
    });
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-bundles/list-bundles-${qs}.json`
    );
  });

  it("should return second page of bundles", async () => {
    const qs = "offset=10&limit=10";

    const response = await fetch(`${config.apiUrl}/admin/bundles?${qs}`, {
      headers: {
        "x-medusa-access-token": config.apiToken,
      },
    });
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-bundles/list-bundles-${qs}.json`
    );
  });

  it("should return third (empty) page of bundles", async () => {
    const qs = "offset=20&limit=10";

    const response = await fetch(`${config.apiUrl}/admin/bundles?${qs}`, {
      headers: {
        "x-medusa-access-token": config.apiToken,
      },
    });
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-bundles/list-bundles-${qs}.json`
    );
  });

  it("should return first page of searched bundles", async () => {
    const qs = "q=coffee&offset=0&limit=10";

    const response = await fetch(`${config.apiUrl}/admin/bundles?${qs}`, {
      headers: {
        "x-medusa-access-token": config.apiToken,
      },
    });
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-bundles/list-bundles-${qs}.json`
    );
  });

  it("should return second page of searched bundles", async () => {
    const qs = "q=coffee&offset=10&limit=10";

    const response = await fetch(`${config.apiUrl}/admin/bundles?${qs}`, {
      headers: {
        "x-medusa-access-token": config.apiToken,
      },
    });
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-bundles/list-bundles-${qs}.json`
    );
  });

  it("should return a list of bundles that contain product_id", async () => {
    const qs = "product_id=prod_medusacoffeemug02";

    const response = await fetch(`${config.apiUrl}/admin/bundles?${qs}`, {
      headers: {
        "x-medusa-access-token": config.apiToken,
      },
    });
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-bundles/list-bundles-${qs}.json`
    );
  });

  it("should return an empty list of bundles because product_id does not exist", async () => {
    const qs = "product_id=prod_dummy";

    const response = await fetch(`${config.apiUrl}/admin/bundles?${qs}`, {
      headers: {
        "x-medusa-access-token": config.apiToken,
      },
    });
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-bundles/list-bundles-${qs}.json`
    );
  });

  it("should return a single bundle by handle", async () => {
    const qs = "handle=coffee-mugs-02";

    const response = await fetch(`${config.apiUrl}/admin/bundles?${qs}`, {
      headers: {
        "x-medusa-access-token": config.apiToken,
      },
    });
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-bundles/list-bundles-by-handle-${qs}.json`
    );
  });

  it("should return an empty list of bundles because handle does not exist", async () => {
    const qs = "handle=coffee-mugs-dummy";

    const response = await fetch(`${config.apiUrl}/admin/bundles?${qs}`, {
      headers: {
        "x-medusa-access-token": config.apiToken,
      },
    });
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-bundles/list-bundles-by-handle-${qs}.json`
    );
  });

  it("should return a single bundle by handle even if bundle is not published", async () => {
    const qs = "handle=coffee-mugs-11";

    const response = await fetch(`${config.apiUrl}/admin/bundles?${qs}`, {
      headers: {
        "x-medusa-access-token": config.apiToken,
      },
    });
    const data = await response.json();

    testAndSanitizeData(data);

    expect({ data, status: response.status }).toMatchFileSnapshot(
      `../../fixtures/admin/bundles/list-bundles/list-bundles-by-handle-${qs}.json`
    );
  });
});
