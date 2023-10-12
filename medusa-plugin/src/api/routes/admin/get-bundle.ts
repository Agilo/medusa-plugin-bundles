import BundleService from "../../../services/bundle";

export default async (req, res) => {
  const { id } = req.params;
  const bundleService: BundleService = req.scope.resolve("bundleService");
  const bundle = await bundleService.retrieve(id, { relations: ["products"] });
  res.json({ bundle });
};
