/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreBundlesBundleProductsListRes } from '../models/StoreBundlesBundleProductsListRes';
import type { StoreBundlesListRes } from '../models/StoreBundlesListRes';
import type { StoreBundlesRes } from '../models/StoreBundlesRes';
import type { StoreGetBundlesBundleProductsParams } from '../models/StoreGetBundlesBundleProductsParams';
import type { StoreGetBundlesParams } from '../models/StoreGetBundlesParams';

const { client } = useMedusaStore()

export const useBundlesList = (
  queryParams: StoreGetBundlesParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.bundles.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.bundles.list>>>(
    ['bundles', 'list', queryParams],
    () => client.bundles.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useBundlesRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.bundles.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.bundles.retrieve>>>(
    ['bundles', 'retrieve', id],
    () => client.bundles.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useBundlesListProducts = (
  id: string,
  queryParams: StoreGetBundlesBundleProductsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.bundles.listProducts>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.bundles.listProducts>>>(
    ['bundles', 'listProducts', id,queryParams],
    () => client.bundles.listProducts(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};


