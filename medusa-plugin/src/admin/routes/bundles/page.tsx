import { RouteConfig } from "@medusajs/admin";
import BundleIndex from "../../packages/admin-ui-custom/ui/src/domain/bundles/overview";
// import { MedusaAdminProvider } from "../../packages/generated/admin-client";
// import { useQueryClient } from "react-query";
// import { MedusaProvider } from 'medusa-react';

const Page = () => {
  // const client = useQueryClient();

  // // client.getDefaultOptions().mutations.
  // client.defaultMutationOptions;

  return <BundleIndex />;
  // return (
  //   <MedusaAdminProvider
  //     baseUrl="http://localhost:9000"
  //     apiKey="apitoken"
  //     queryClientProviderProps={{ client }}
  //     children={<BundleIndex />}
  //   />
  // );
};

export const config: RouteConfig = {
  link: {
    label: "Bundles",
    // icon: CustomIcon,
  },
};

export default Page;
