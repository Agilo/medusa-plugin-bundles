import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

export const useAdminDeleteBundle = (
  id: string,
  options?: UseMutationOptions<Response<AdminProductsDeleteRes>, Error, void>
) => {
  const { client } = useMedusa();
  const queryClient = useQueryClient();

  return useMutation(
    () => client.admin.products.delete(id),
    buildOptions(
      queryClient,
      [adminProductKeys.lists(), adminProductKeys.detail(id)],
      options
    )
  );
};
