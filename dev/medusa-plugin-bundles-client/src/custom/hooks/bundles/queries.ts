import { queryKeysFactory } from "../utils/queryKeysFactory";
import { Response } from "@medusajs/medusa-js";
import { useMedusa } from "medusa-react";
import { useQuery } from "@tanstack/react-query";
import { UseQueryOptionsWrapper } from "../../types";
import qs from "qs";
import type { StoreBundlesListRes } from "../../../generated/models/StoreBundlesListRes";
import type { StoreBundlesRes } from "../../../generated/models/StoreBundlesRes";
import type { StoreGetBundlesParams } from "../../../generated/models/StoreGetBundlesParams";

const BUNDLES_QUERY_KEY = `bundles` as const;

export const bundleKeys =
  queryKeysFactory<typeof BUNDLES_QUERY_KEY, StoreGetBundlesParams>(
    BUNDLES_QUERY_KEY
  );
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

// export const useBundlesList = (
//   queryParams: StoreGetBundlesParams,
//   options: UseQueryOptionsWrapper<
//     Awaited<ReturnType<typeof client.bundles.list>>
//   > = {}
// ) => {
//   const { data, ...rest } = useQuery<
//     Awaited<ReturnType<typeof client.bundles.list>>
//   >(
//     ["bundles", "list", queryParams],
//     () => client.bundles.list(queryParams),
//     options
//   );
//   return { ...data, ...rest } as const;
// };

// export const useBundlesRetrieve = (
//   id: string,
//   options: UseQueryOptionsWrapper<
//     Awaited<ReturnType<typeof client.bundles.retrieve>>
//   > = {}
// ) => {
//   const { data, ...rest } = useQuery<
//     Awaited<ReturnType<typeof client.bundles.retrieve>>
//   >(["bundles", "retrieve", id], () => client.bundles.retrieve(id), options);
//   return { ...data, ...rest } as const;
// };
