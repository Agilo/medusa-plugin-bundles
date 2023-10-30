import { getBundleByHandle } from "@lib/data"
import BundleTemplate from "@modules/bundles/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: { handle: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bundles } = await getBundleByHandle(params.handle)

  const bundle = bundles[0]

  if (!bundle) {
    notFound()
  }

  return {
    title: `${bundle.title} | Acme Store`,
    description: `${bundle.title} collection`,
  }
}

export default async function BundlePage({ params }: Props) {
  const { bundles } = await getBundleByHandle(params.handle)

  const bundle = bundles[0]

  return <BundleTemplate bundle={bundle} />
}
