/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreBundlesRes } from '../models/StoreBundlesRes';

const { client } = useMedusaStore()

export const useProductsGetBundlesBundle = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.products.getBundlesBundle>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.products.getBundlesBundle>>>(
    ['products', 'getBundlesBundle', id],
    () => client.products.getBundlesBundle(id),
    options
  );
  return { ...data, ...rest } as const
};


