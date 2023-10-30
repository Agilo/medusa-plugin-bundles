"use client"

import { getBundlesList } from "@lib/data"
import BundlePreview from "@modules/products/components/bundle-preview"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useCart } from "medusa-react"
import React, { useEffect } from "react"
import { useInView } from "react-intersection-observer"

const BundleListTemplate: React.FC = () => {
  const { cart } = useCart()
  const { ref, inView } = useInView()

  const {
    data: infiniteData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    [`get_bundles`],
    ({ pageParam }) =>
      getBundlesList({
        pageParam: pageParam,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  )

  // useEffect(() => {
  //   if (cart?.region_id) {
  //     refetch()
  //   }
  // }, [cart?.region_id, refetch])

  // const previews = usePreviews({
  //   pages: infiniteData?.pages,
  //   region: cart?.region,
  // })

  console.log("infiniteData", infiniteData)

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasNextPage])

  return (
    <div className="content-container py-6">
      <div className="flex flex-row mb-8 text-2xl-semi gap-4">
        <h1>Bundles</h1>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-8">
        {infiniteData?.pages.map((page) =>
          page.response.bundles.map((b) => (
            <li key={b.id}>
              <BundlePreview
                title={b.title}
                handle={b.handle}
                thumbnail={b.thumbnail}
              />
            </li>
          ))
        )}
        {/* {isFetchingNextPage &&
          repeat(getNumberOfSkeletons(infiniteData?.pages)).map((index) => (
            <li key={index}>
              <SkeletonProductPreview />
            </li>
          ))} */}
      </ul>
      <div
        className="py-16 flex justify-center items-center text-small-regular text-gray-700"
        ref={ref}
      >
        <span ref={ref}></span>
      </div>
    </div>
  )
}

export default BundleListTemplate
