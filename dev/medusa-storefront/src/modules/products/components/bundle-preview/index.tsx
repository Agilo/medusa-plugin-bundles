import Link from "next/link"
import Thumbnail from "../thumbnail"

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
          <div className="flex items-center gap-x-2 mt-1">
            {/* {price ? (
              <>
                {price.price_type === "sale" && (
                  <span className="line-through text-gray-500">
                    {price.original_price}
                  </span>
                )}
                <span
                  className={clsx("font-semibold", {
                    "text-rose-500": price.price_type === "sale",
                  })}
                >
                  {price.calculated_price}
                </span>
              </>
            ) : (
              <div className="w-20 h-6 animate-pulse bg-gray-100"></div>
            )} */}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BundlePreview
