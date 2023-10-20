/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreBundlesListRes } from '../models/StoreBundlesListRes';
import type { StoreBundlesRes } from '../models/StoreBundlesRes';

const { client } = useMedusaStore()

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
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.bundles.getBundles>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.bundles.getBundles>>>(
    ['bundles', 'getBundles', queryParams],
    () => client.bundles.getBundles(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useBundlesGetBundlesBundle = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.bundles.getBundlesBundle>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.bundles.getBundlesBundle>>>(
    ['bundles', 'getBundlesBundle', id],
    () => client.bundles.getBundlesBundle(id),
    options
  );
  return { ...data, ...rest } as const
};


