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
} from "../../../../admin-client";

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
