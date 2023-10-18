/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreBundlesListRes } from '../models/StoreBundlesListRes';

const { client } = useMedusaStore()

export const useDefaultGetBundles = (
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
  },
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.default.getBundles>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.default.getBundles>>>(
    ['default', 'getBundles', queryParams],
    () => client.default.getBundles(queryParams),
    options
  );
  return { ...data, ...rest } as const
};


