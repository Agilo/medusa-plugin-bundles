import { Response } from "@medusajs/medusa-js";
import { useQuery } from "@tanstack/react-query";
import { useMedusa } from "medusa-react";
import qs from "qs";
import {
  AdminBundlesBundleProductsListRes,
  AdminBundlesListRes,
  AdminBundlesRes,
  AdminGetBundlesBundleProductsParams,
  AdminGetBundlesParams,
} from "../../../generated/models";
import { UseQueryOptionsWrapper } from "../../types";
import { queryKeysFactory } from "../utils/queryKeysFactory";

const ADMIN_BUNDLES_QUERY_KEY = `admin_bundles` as const;

export const adminBundleKeys = {
  ...queryKeysFactory(ADMIN_BUNDLES_QUERY_KEY),
  detailProducts(id: string, query?: any) {
    return [
      ...this.detail(id),
      "products" as const,
      { ...(query || {}) },
    ] as const;
  },
};

type BundleQueryKeys = typeof adminBundleKeys;

export const useAdminBundles = (
  query?: AdminGetBundlesParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminBundlesListRes>,
    Error,
    ReturnType<BundleQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa();

  let path = "/admin/bundles";

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
    ReturnType<BundleQueryKeys["detail"]>
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

export const useAdminBundleProducts = (
  id: string,
  query?: AdminGetBundlesBundleProductsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminBundlesBundleProductsListRes>,
    Error,
    ReturnType<BundleQueryKeys["detailProducts"]>
  >
) => {
  const { client } = useMedusa();

  let path = `/admin/bundles/${id}/products`;

  if (query) {
    const queryString = qs.stringify(query);
    path = `/admin/bundles/${id}/products?${queryString}`;
  }

  const { data, ...rest } = useQuery(
    adminBundleKeys.detailProducts(id, query),
    () => client.client.request("GET", path),
    options
  );

  return { ...data, ...rest } as const;
};
