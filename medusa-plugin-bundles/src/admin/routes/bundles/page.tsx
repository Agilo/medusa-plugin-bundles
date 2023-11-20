import { RouteConfig } from "@medusajs/admin";
import BundleIndex from "../../packages/admin-ui-custom/ui/src/domain/bundles/overview";
import SquaresPlus from "../../packages/admin-ui/ui/src/components/fundamentals/icons/squares-plus";

const Page = () => {
  return <BundleIndex />;
};

export const config: RouteConfig = {
  link: {
    label: "Bundles",
    icon: SquaresPlus,
  },
};

export default Page;
