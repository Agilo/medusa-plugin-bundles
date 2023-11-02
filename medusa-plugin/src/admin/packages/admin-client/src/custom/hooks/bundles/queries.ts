import { AdminProductsListTagsRes } from "@medusajs/medusa";
import { Response } from "@medusajs/medusa-js";
import { useQuery } from "@tanstack/react-query";
import { useMedusa } from "medusa-react";
import qs from "qs";
import {
  AdminBundlesListRes,
  AdminBundlesRes,
  AdminGetBundlesParams,
} from "../../../generated/models";
import { UseQueryOptionsWrapper } from "../../types";
import { queryKeysFactory } from "../utils/queryKeysFactory";

const ADMIN_BUNDLES_QUERY_KEY = `admin_bundles` as const;

export const adminBundleKeys = queryKeysFactory(ADMIN_BUNDLES_QUERY_KEY);

type BundlesQueryKeys = typeof adminBundleKeys;

export const useAdminBundles = (
  query?: AdminGetBundlesParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminBundlesListRes>,
    Error,
    ReturnType<BundlesQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa();

  let path = "/admin/bundles";

  // TODO: importing qs causes an error, fix this
  if (query) {
    const queryString = qs.stringify(query);
    path = `/admin/bundles?${queryString}`;
  }

  const { data, ...rest } = useQuery(
    adminBundleKeys.list(query),
    () => client.client.request("GET", path),
    options
  );
  return { ...data, ...rest } as const;
};

export const useAdminBundle = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminBundlesRes>,
    Error,
    ReturnType<BundlesQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa();
  const { data, ...rest } = useQuery(
    adminBundleKeys.detail(id),
    () => client.client.request("GET", `/admin/bundles/${id}`),
    options
  );
  return { ...data, ...rest } as const;
};

export const useAdminProductTagUsage = (
  options?: UseQueryOptionsWrapper<
    Response<AdminProductsListTagsRes>,
    Error,
    ReturnType<BundlesQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa();
  const { data, ...rest } = useQuery(
    adminBundleKeys.detail("tags"),
    () => client.admin.products.listTags(),
    options
  );
  return { ...data, ...rest } as const;
};
