import { getBundleByHandle } from "@lib/data"
import BundleDetailTemplate from "@modules/bundles/templates/detail"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: { handle: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bundles } = await getBundleByHandle(params.handle).catch((err) => {
    notFound()
  })

  const bundle = bundles[0]

  if (!bundle) {
    notFound()
  }

  return {
    title: `${bundle.title} | Acme Store`,
    description: `${bundle.title} bundle`,
  }
}

export default async function BundlePage({ params }: Props) {
  const { bundles } = await getBundleByHandle(params.handle).catch((err) => {
    notFound()
  })

  const bundle = bundles[0]

  if (!bundle) {
    notFound()
  }

  return <BundleDetailTemplate bundle={bundle} />
}
