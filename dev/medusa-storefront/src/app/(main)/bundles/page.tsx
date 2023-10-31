import BundleArchiveTemplate from "@modules/bundles/templates/archive"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Bundles | Acme Store`,
    description: `Explore all of our bundles.`,
  }
}

export default async function BundleListPage() {
  return <BundleArchiveTemplate />
}
