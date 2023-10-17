import {
  useAdminCustomDelete,
  useAdminCustomPost,
  useAdminCustomQuery,
} from "medusa-react";
import {
  AdminBundlesListRes,
  AdminBundlesRes,
  AdminPostBundlesBundleReq,
  AdminPostBundlesReq,
} from "../../../../../packages/generated/admin-client";
// import { AdminPostBundlesBundleReq } from "../../../../../../api/routes/admin/update-bundle";
// import { Bundle } from "../../../../../../models/bundle";

// export const useAdminUpdateBundle = (id: string) => {
//   return useAdminCustomPost<
//     { title?: string; description?: string; status?: "draft" | "published" },
//     { bundle: any }
//   >(`/bundles/${id}`, ["bundles", id]);
// };

// export const useAdminDeleteBundle = (id: string) => {
//   return useAdminCustomDelete(`/bundles/${id}`, ["bundles", id]);
// };

// new custom

export const useBundlesList = () => {
  return useAdminCustomQuery<undefined, AdminBundlesListRes>(`/bundles`, [
    "bundles",
  ]);
};

export const useBundlesCreate = () => {
  return useAdminCustomPost<AdminPostBundlesReq, AdminBundlesRes>(
    `/bundles`,
    ["bundles"],
    {
      product: true,
    }
  );
};

export const useBundlesRetrieve = (id: string) => {
  return useAdminCustomQuery<undefined, AdminBundlesRes>(`/bundles/${id}`, [
    "bundles",
    id,
  ]);
};

export const useBundlesUpdate = (id: string) => {
  return useAdminCustomPost<AdminPostBundlesBundleReq, AdminBundlesRes>(
    `/bundles/${id}`,
    ["bundles", id]
  );
};

export const useBundlesDelete = (id: string) => {
  return useAdminCustomDelete(`/bundles/${id}`, ["bundles", id]);
};

// new

// export const useAdminCreateBundle = (
//   options?: UseMutationOptions<
//     Response<AdminBundlesRes>,
//     Error,
//     AdminPostBundlesReq
//   >
// ) => {
//   const { client } = useMedusa();
//   const queryClient = useQueryClient();
//   return useMutation(
//     (payload: AdminPostBundlesBundleReq) =>
//       client.admin.products.create(payload),
//     buildOptions(queryClient, adminProductKeys.lists(), options)
//   );
// };

// export const useBundlesCreate = (
//   requestBody: AdminPostBundlesReq,
//   options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.bundles.create>>, unknown, AdminPostBundlesReq> = {}
// ) => {
//   if (!options?.onSuccess) {
//     const queryClient = useQueryClient()
//     options.onSuccess = async () => {
//       await queryClient.invalidateQueries('bundles')
//     }
//   }
//   return useMutation<Awaited<ReturnType<typeof client.bundles.create>>, unknown, AdminPostBundlesReq>(
//     ['bundles', 'create', requestBody],
//     () => client.bundles.create(requestBody),
//     options
//   );
// };
