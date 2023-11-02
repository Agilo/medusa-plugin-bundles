import { ProductDetailsWidgetProps, WidgetConfig } from "@medusajs/admin";
import ProductBundlesSection from "../packages/admin-ui-custom/ui/src/components/organisms/product-bundles-section";

const BundleListWidget = ({ product }: ProductDetailsWidgetProps) => {
  return <ProductBundlesSection product={product} />;
};

export const config: WidgetConfig = {
  zone: "product.details.after",
};

export default BundleListWidget;
