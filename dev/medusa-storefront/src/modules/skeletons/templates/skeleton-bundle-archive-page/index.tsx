import repeat from "@lib/util/repeat"
import SkeletonBundlePreview from "@modules/skeletons/components/skeleton-bundle-preview"

const SkeletonBundleArchivePage = () => {
  return (
    <div className="content-container py-6">
      <div className="flex flex-row mb-8 text-2xl-semi gap-4">
        <h1>Bundles</h1>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-8">
        {repeat(8).map((index) => (
          <li key={index}>
            <SkeletonBundlePreview />
          </li>
        ))}
      </ul>
      <div className="py-16 flex justify-center items-center text-small-regular text-gray-700">
        <span></span>
      </div>
    </div>
  )
}

export default SkeletonBundleArchivePage
