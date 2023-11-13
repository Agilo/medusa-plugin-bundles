import { Response } from "@medusajs/medusa-js";
import { useQuery } from "@tanstack/react-query";
import { useMedusa } from "medusa-react";
import qs from "qs";
import {
  StoreBundlesBundleProductsListRes,
  StoreGetBundlesBundleProductsParams,
} from "../../../generated/models";
import type { StoreBundlesListRes } from "../../../generated/models/StoreBundlesListRes";
import type { StoreBundlesRes } from "../../../generated/models/StoreBundlesRes";
import type { StoreGetBundlesParams } from "../../../generated/models/StoreGetBundlesParams";
import { UseQueryOptionsWrapper } from "../../types";
import { queryKeysFactory } from "../utils/queryKeysFactory";

const BUNDLES_QUERY_KEY = `bundles` as const;

export const bundleKeys = {
  ...queryKeysFactory<typeof BUNDLES_QUERY_KEY, StoreGetBundlesParams>(
    BUNDLES_QUERY_KEY
  ),
  detailProducts(id: string, query?: any) {
    return [
      ...this.detail(id),
      "products" as const,
      { ...(query || {}) },
    ] as const;
  },
};
type BundleQueryKey = typeof bundleKeys;

export const useBundles = (
  query?: StoreGetBundlesParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreBundlesListRes>,
    Error,
    ReturnType<BundleQueryKey["list"]>
  >
) => {
  const { client } = useMedusa();

  let path = "/store/bundles";

  if (query) {
    const queryString = qs.stringify(query);
    path = `/store/bundles?${queryString}`;
  }

  const { data, ...rest } = useQuery(
    bundleKeys.list(query),
    () => client.client.request("GET", path),
    options
  );
  return { ...data, ...rest } as const;
};

export const useBundle = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreBundlesRes>,
    Error,
    ReturnType<BundleQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa();
  const { data, ...rest } = useQuery(
    bundleKeys.detail(id),
    () => client.client.request("GET", `/store/bundles/${id}`),
    options
  );

  return { ...data, ...rest } as const;
};

export const useBundleProducts = (
  id: string,
  query?: StoreGetBundlesBundleProductsParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreBundlesBundleProductsListRes>,
    Error,
    ReturnType<BundleQueryKey["detailProducts"]>
  >
) => {
  const { client } = useMedusa();

  let path = `/store/bundles/${id}/products`;

  if (query) {
    const queryString = qs.stringify(query);
    path = `/store/bundles/${id}/products?${queryString}`;
  }

  const { data, ...rest } = useQuery(
    bundleKeys.detailProducts(id, query),
    () => client.client.request("GET", path),
    options
  );

  return { ...data, ...rest } as const;
};
