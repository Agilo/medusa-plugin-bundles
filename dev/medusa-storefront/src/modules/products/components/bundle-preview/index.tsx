import clsx from "clsx"
import Link from "next/link"
import { ProductPreviewType } from "types/global"
import Thumbnail from "../thumbnail"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"

type BundlePreviewProps = {
  title: string
  products: PricedProduct[]
}

const BundlePreview = ({ title, products }: BundlePreviewProps) => {
  return (
    <Link href={`/products/${123}`}>
      <div>
        {/* <Thumbnail thumbnail={thumbnail} size="full" /> */}
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
