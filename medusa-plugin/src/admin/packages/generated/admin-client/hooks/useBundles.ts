/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminBundlesDeleteRes } from '../models/AdminBundlesDeleteRes';
import type { AdminBundlesListRes } from '../models/AdminBundlesListRes';
import type { AdminBundlesRes } from '../models/AdminBundlesRes';
import type { AdminGetBundlesParams } from '../models/AdminGetBundlesParams';
import type { AdminPostBundlesBundleReq } from '../models/AdminPostBundlesBundleReq';
import type { AdminPostBundlesReq } from '../models/AdminPostBundlesReq';

const { client } = useMedusaAdmin()

export const useBundlesList = (
  queryParams: AdminGetBundlesParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.bundles.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.bundles.list>>>(
    ['bundles', 'list', queryParams],
    () => client.bundles.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useBundlesCreate = (
  requestBody: AdminPostBundlesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.bundles.create>>, unknown, AdminPostBundlesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('bundles')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.bundles.create>>, unknown, AdminPostBundlesReq>(
    ['bundles', 'create', requestBody],
    () => client.bundles.create(requestBody),
    options
  );
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

export const useBundlesUpdate = (
  id: string,
  requestBody: AdminPostBundlesBundleReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.bundles.update>>, unknown, AdminPostBundlesBundleReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('bundles')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.bundles.update>>, unknown, AdminPostBundlesBundleReq>(
    ['bundles', 'update', id,requestBody],
    () => client.bundles.update(id,requestBody),
    options
  );
};

export const useBundlesDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.bundles.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('bundles')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.bundles.delete>>, unknown, void>(
    ['bundles', 'delete', id],
    () => client.bundles.delete(id),
    options
  );
};


