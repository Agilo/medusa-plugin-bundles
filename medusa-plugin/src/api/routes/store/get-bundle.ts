import BundleService from "../../../services/bundle";
import { cleanResponseData } from "@medusajs/medusa";

export default async (req, res) => {
  const { id } = req.params;
  const bundleService: BundleService = req.scope.resolve("bundleService");

  const bundle = await bundleService.retrieve(id);

  res.json({
    bundle: cleanResponseData(bundle, req.allowedProperties || []),
  });
};
