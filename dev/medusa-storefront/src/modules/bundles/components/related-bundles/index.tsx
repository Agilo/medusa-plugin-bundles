import { getBundlesList } from "@lib/data"
import { getNumberOfBundleSkeletons } from "@lib/util/get-number-of-skeletons"
import repeat from "@lib/util/repeat"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import SkeletonBundlePreview from "@modules/skeletons/components/skeleton-bundle-preview"
import { useInfiniteQuery } from "@tanstack/react-query"
import BundlePreview from "../bundle-preview"
import Button from "@modules/common/components/button"

type RelatedBundlesProps = {
  product: PricedProduct
}

const RelatedBundles = ({ product }: RelatedBundlesProps) => {
  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery(
      [`infinite-bundles-${product.id}`],
      ({ pageParam }) =>
        getBundlesList({
          pageParam,
          queryParams: { product_id: product.id, limit: 8 },
        }),
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    )

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
        {data?.pages.map((page) =>
          page.response.bundles.map((bundle) => (
            <li key={bundle.id}>
              <BundlePreview {...bundle} />
            </li>
          ))
        )}
        {isLoading &&
          !data &&
          repeat(8).map((index) => (
            <li key={index}>
              <SkeletonBundlePreview />
            </li>
          ))}
        {isFetchingNextPage &&
          repeat(getNumberOfBundleSkeletons(data?.pages)).map((index) => (
            <li key={index}>
              <SkeletonBundlePreview />
            </li>
          ))}
      </ul>
      {hasNextPage && (
        <div className="flex items-center justify-center mt-8">
          <Button
            isLoading={isLoading}
            onClick={() => fetchNextPage()}
            className="w-72"
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  )
}

export default RelatedBundles
