import Link from "next/link"
import Thumbnail from "../../../products/components/thumbnail"

type BundlePreviewProps = {
  title: string
  handle: string
  thumbnail: string | null
}

const BundlePreview = ({ title, handle, thumbnail }: BundlePreviewProps) => {
  return (
    <Link href={`/bundles/${handle}`}>
      <div>
        <Thumbnail thumbnail={thumbnail} size="full" />
        <div className="text-base-regular mt-2">
          <span>{title}</span>
        </div>
      </div>
    </Link>
  )
}

export default BundlePreview
