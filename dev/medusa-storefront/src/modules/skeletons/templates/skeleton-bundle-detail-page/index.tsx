import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonBundleDetailPage = () => {
  return (
    <div className="content-container py-6">
      <div className="animate-pulse mb-8 text-2xl-semi">
        <div className="w-96 h-[48px] bg-gray-100"></div>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-8">
        {repeat(12).map((index) => (
          <li key={index}>
            <SkeletonProductPreview />
          </li>
        ))}
      </ul>
      <div className="py-16 flex justify-center items-center text-small-regular text-gray-700">
        <span></span>
      </div>
    </div>
  )
}

export default SkeletonBundleDetailPage
