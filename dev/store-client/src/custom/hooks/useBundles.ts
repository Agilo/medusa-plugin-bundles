/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../../generated/core/HookUtils';
import { useMedusaStore } from '../../generated/useMedusaStore';
import type { StoreBundlesListRes } from '../../generated/models/StoreBundlesListRes';
import type { StoreBundlesRes } from '../../generated/models/StoreBundlesRes';

export const useBundlesGetBundles = (
  queryParams: {
    /**
     * term used to search bundles' title and description.
     */
    q?: string,
    /**
     * The number of bundles to skip when retrieving the bundles.
     */
    offset?: number,
    /**
     * Limit the number of bundles returned.
     */
    limit?: number,
    /**
     * Filter by product IDs. When provided, only bundles that contain the specified products are retrieved.
     */
    product_id?: Array<string>,
  },
  options: UseQueryOptionsWrapper<Awaited<ReturnType<any>>> = {}
) => {
  const { client } = useMedusaStore()
  console.log('mark1::client', client);
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.bundles.getBundles>>>(
    ['bundles', 'getBundles', queryParams],
    () => client.bundles.getBundles(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useBundlesGetBundlesBundle = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<any>>> = {}
) => {
  const { client } = useMedusaStore()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.bundles.getBundlesBundle>>>(
    ['bundles', 'getBundlesBundle', id],
    () => client.bundles.getBundlesBundle(id),
    options
  );
  return { ...data, ...rest } as const
};


