import BundleListTemplate from "@modules/bundles/templates/list"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  // const { product_categories } = await getCategoryByHandle(
  //   params.category
  // ).catch((err) => {
  //   notFound()
  // })

  // const category = product_categories[0]

  return {
    title: `Bundles | Acme Store`,
    description: `Bundles.`,
  }
}

export default async function BundleListPage() {
  // const { product_categories } = await getCategoryByHandle(
  //   params.category
  // ).catch((err) => {
  //   notFound()
  // })

  // const category = product_categories[0]

  return <BundleListTemplate />
}
