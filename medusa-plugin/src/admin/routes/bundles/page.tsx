import { RouteConfig } from "@medusajs/admin";
import BundleIndex from "../../packages/admin-ui-custom/ui/src/domain/bundles/overview";

const Page = () => {
  return <BundleIndex />;
};

export const config: RouteConfig = {
  link: {
    label: "Bundles",
    // icon: CustomIcon,
  },
};

export default Page;
