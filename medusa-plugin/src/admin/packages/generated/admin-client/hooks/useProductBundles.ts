/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminBundlesRes } from '../models/AdminBundlesRes';
import type { AdminDeleteProductsFromBundleReq } from '../models/AdminDeleteProductsFromBundleReq';
import type { AdminDeleteProductsFromBundleRes } from '../models/AdminDeleteProductsFromBundleRes';
import type { AdminPostProductsToBundleReq } from '../models/AdminPostProductsToBundleReq';

const { client } = useMedusaAdmin()

export const useProductBundlesAddProducts = (
  id: string,
  requestBody: AdminPostProductsToBundleReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.productBundles.addProducts>>, unknown, AdminPostProductsToBundleReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('productBundles')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.productBundles.addProducts>>, unknown, AdminPostProductsToBundleReq>(
    ['productBundles', 'addProducts', id,requestBody],
    () => client.productBundles.addProducts(id,requestBody),
    options
  );
};

export const useProductBundlesRemoveProducts = (
  id: string,
  requestBody: AdminDeleteProductsFromBundleReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.productBundles.removeProducts>>, unknown, AdminDeleteProductsFromBundleReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('productBundles')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.productBundles.removeProducts>>, unknown, AdminDeleteProductsFromBundleReq>(
    ['productBundles', 'removeProducts', id,requestBody],
    () => client.productBundles.removeProducts(id,requestBody),
    options
  );
};


