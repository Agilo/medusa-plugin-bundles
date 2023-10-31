"use client"

import { getBundlesList } from "@lib/data"
import getNumberOfSkeletons from "@lib/util/get-number-of-skeletons"
import repeat from "@lib/util/repeat"
import BundlePreview from "@modules/products/components/bundle-preview"
import SkeletonBundlePreview from "@modules/skeletons/components/skeleton-bundle-preview"
import { useInfiniteQuery } from "@tanstack/react-query"
import React, { useEffect } from "react"
import { useInView } from "react-intersection-observer"

const BundleArchiveTemplate: React.FC = () => {
  const { ref, inView } = useInView()

  const {
    data: infiniteData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
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
          page.response.bundles.map((bundle) => (
            <li key={bundle.id}>
              <BundlePreview {...bundle} />
            </li>
          ))
        )}
        {isLoading &&
          !infiniteData &&
          repeat(8).map((index) => (
            <li key={index}>
              <SkeletonBundlePreview />
            </li>
          ))}
        {isFetchingNextPage &&
          repeat(getNumberOfSkeletons(infiniteData?.pages as any)).map(
            (index) => (
              <li key={index}>
                <SkeletonBundlePreview />
              </li>
            )
          )}
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

export default BundleArchiveTemplate
