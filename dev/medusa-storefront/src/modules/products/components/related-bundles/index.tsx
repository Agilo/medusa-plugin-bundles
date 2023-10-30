import repeat from "@lib/util/repeat"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { useBundles } from "medusa-plugin-bundles-client"
import BundlePreview from "../bundle-preview"

type RelatedBundlesProps = {
  product: PricedProduct
}

const RelatedBundles = ({ product }: RelatedBundlesProps) => {
  const { bundles, isLoading } = useBundles({
    product_id: product.id ? [product.id, "123"] : [],
    limit: 8,
  })

  return (
    <div className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-base-regular text-gray-600 mb-6">
          Related bundles
        </span>
        <p className="text-2xl-regular text-gray-900 max-w-lg">
          You might also want to check out these bundles.
        </p>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-8">
        {bundles &&
          bundles.map((bundle) => (
            <li key={bundle.id}>
              <BundlePreview
                title={bundle.title}
                handle={bundle.handle}
                thumbnail={bundle.thumbnail}
              />
            </li>
          ))}
        {isLoading &&
          repeat(8).map((index) => (
            <li key={index}>
              <SkeletonProductPreview />
            </li>
          ))}
      </ul>
    </div>
  )
}

export default RelatedBundles
