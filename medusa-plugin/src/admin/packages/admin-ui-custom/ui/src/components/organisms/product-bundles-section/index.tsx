import { Product } from "@medusajs/medusa";
import { useTranslation } from "react-i18next";
import { useAdminBundles } from "../../../../../../admin-client";
import Section from "../../../../../../admin-ui/ui/src/components/organisms/section";
import BundlesTable from "./table";

type Props = {
  product: Product;
};

const ProductBundlesSection = ({ product }: Props) => {
  const { t } = useTranslation();

  const { bundles, isLoading } = useAdminBundles({ product_id: [product.id] });

  return (
    <Section title="Bundles">
      <div className="mt-xlarge">
        <h2 className="inter-large-semibold mb-base">
          {t("product-bundles-section-bundles", "Bundles")}{" "}
          <span className="inter-large-regular text-grey-50">
            {bundles && `(${bundles.length})`}
          </span>
        </h2>
        {isLoading ? <div>Loading...</div> : <BundlesTable bundles={bundles} />}
      </div>
    </Section>
  );
};

export default ProductBundlesSection;
