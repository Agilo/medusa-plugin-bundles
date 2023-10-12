// import { Product } from "@medusajs/medusa";
import { Bundle } from "../../../../../../../../models/bundle";
import { useAdminCustomDelete } from "medusa-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useImperativeDialog from "../../../../../../admin-ui/ui/src/hooks/use-imperative-dialog";
// import useNotification from "../../../../../../admin-ui/ui/src/hooks/use-notification";
// import { getErrorMessage } from "../../../utils/error-messages";
// import DuplicateIcon from "../../../../../../admin-ui/ui/src/components/fundamentals/icons/duplicate-icon";
import EditIcon from "../../../../../../admin-ui/ui/src/components/fundamentals/icons/edit-icon";
// import PublishIcon from "../../../../../../admin-ui/ui/src/components/fundamentals/icons/publish-icon";
import TrashIcon from "../../../../../../admin-ui/ui/src/components/fundamentals/icons/trash-icon";
// import UnpublishIcon from "../../../../../../admin-ui/ui/src/components/fundamentals/icons/unpublish-icon";
import { ActionType } from "../../../../../../admin-ui/ui/src/components/molecules/actionables";
import { AdminBundleDeleteRes } from "../../../../../../../../api/routes/admin/delete-bundle";
// import useCopyProduct from "./use-copy-product";

const useBundleActions = (bundle: Bundle) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const notification = useNotification();
  const dialog = useImperativeDialog();
  // const copyProduct = useCopyProduct();

  const deleteBundle = useAdminCustomDelete<AdminBundleDeleteRes>(
    `/bundles/${bundle.id}`,
    ["bundles"]
  );

  // const updateProduct = useAdminUpdateProduct(bundle?.id);

  const handleDelete = async () => {
    const shouldDelete = await dialog({
      heading: t("bundle-table-delete-bundle", "Delete Bundle"),
      text: t(
        "bundle-table-confirm-delete",
        "Are you sure you want to delete this product?"
      ),
    });

    if (shouldDelete) {
      deleteBundle.mutate();
    }
  };

  const getActions = (): ActionType[] => [
    {
      label: t("product-table-edit", "Edit"),
      onClick: () => navigate(`/a/bundles/${bundle.id}`),
      icon: <EditIcon size={20} />,
    },
    // {
    //   label:
    //     bundle.status === "published"
    //       ? t("product-table-unpublish", "Unpublish")
    //       : t("product-table-publish", "Publish"),
    //   onClick: () => {
    //     const newStatus =
    //       bundle.status === "published"
    //         ? t("product-table-draft", "draft")
    //         : t("product-table-published", "published");
    //     updateProduct.mutate(
    //       {
    //         status: newStatus,
    //       },
    //       {
    //         onSuccess: () => {
    //           notification(
    //             t("product-table-success", "Success"),
    //             product.status === "published"
    //               ? t(
    //                   "product-table-successfully-unpublished-product",
    //                   "Successfully unpublished product"
    //                 )
    //               : t(
    //                   "product-table-successfully-published-product",
    //                   "Successfully published product"
    //                 ),
    //             "success"
    //           );
    //         },
    //         onError: (err) =>
    //           notification(
    //             t("product-table-error", "Error"),
    //             getErrorMessage(err),
    //             "error"
    //           ),
    //       }
    //     );
    //   },
    //   icon:
    //     product.status === "published" ? (
    //       <UnpublishIcon size={20} />
    //     ) : (
    //       <PublishIcon size={20} />
    //     ),
    // },
    // {
    //   label: t("product-table-duplicate", "Duplicate"),
    //   onClick: () => copyProduct(product),
    //   icon: <DuplicateIcon size={20} />,
    // },
    {
      label: t("bundle-table-delete", "Delete"),
      variant: "danger",
      onClick: handleDelete,
      icon: <TrashIcon size={20} />,
    },
  ];

  return {
    getActions,
  };
};

export default useBundleActions;
