import path from "path";
import { execa } from "execa";
import * as url from "url";
import replace from "replace-in-file";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const rootDir = path.resolve(__dirname, "..", "..");
const firstArg = process.argv[2]?.trim();
const type = (["store", "admin"].includes(firstArg) ? firstArg : "store") as
  | "store"
  | "admin";

const oasOperationIds = {
  store: ["GetBundles", "GetBundlesBundle", "GetBundlesBundleProducts"],
  admin: [
    "AdminPostProductsToBundle",
    "DeleteProductsFromBundle",
    "AdminDeleteBundlesBundle",
    "AdminGetBundles",
    "AdminGetBundlesBundle",
    "AdminPostBundles",
    "AdminPostBundlesBundle",
  ],
};

(async () => {
  await execa(
    "npx",
    [
      "medusa-oas",
      "oas",
      "--out-dir",
      ".oas",
      "--type",
      type,
      ...(type === "admin"
        ? ["--paths", "./medusa-plugin/src/"]
        : ["--paths", "./medusa-plugin/src/"]),
    ],
    {
      cwd: rootDir,
      stdio: "inherit",
    }
  );

  await execa(
    "npx",
    [
      "openapi-filter",
      `./.oas/${type}.oas.json`,
      `./.oas/filtered-${type}.oas.json`,
      "--inverse",
      "--valid",
      "--flags",
      "operationId",
      ...oasOperationIds[type].map((id) => ["-v", id]).flat(),
    ],
    {
      cwd: rootDir,
      stdio: "inherit",
    }
  );

  await execa(
    "npx",
    [
      "medusa-oas",
      "client",
      "--type",
      type,
      "--src-file",
      `./.oas/filtered-${type}.oas.json`,
      "--out-dir",
      type === "admin"
        ? `./medusa-plugin/src/admin/packages/generated/${type}-client`
        : `./dev/${type}-client/src/generated`,
      "--clean",
    ],
    {
      cwd: rootDir,
      stdio: "inherit",
    }
  );

  /**
   * Replace react-query imports with @tanstack/react-query
   */
  try {
    const results = replace.sync({
      files:
        type === "admin"
          ? [
              `./medusa-plugin/src/admin/packages/generated/${type}-client/**/*.{ts,tsx}`,
            ]
          : [`./dev/${type}-client/src/generated/**/*.{ts,tsx}`],
      from: / from ("|')react\-query("|');?$/gm,
      to: " from '@tanstack/react-query';",
    });
    // console.log("Replacement results:", results);
  } catch (error) {
    // console.error("Error occurred:", error);
  }
})();
