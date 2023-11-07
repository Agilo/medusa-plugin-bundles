import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Bundle } from "../../../../../../../../models/bundle";
import { useAdminDeleteBundle } from "../../../../../../admin-client";
import EditIcon from "../../../../../../admin-ui/ui/src/components/fundamentals/icons/edit-icon";
import TrashIcon from "../../../../../../admin-ui/ui/src/components/fundamentals/icons/trash-icon";
import { ActionType } from "../../../../../../admin-ui/ui/src/components/molecules/actionables";
import useImperativeDialog from "../../../../../../admin-ui/ui/src/hooks/use-imperative-dialog";

const useBundleActions = (bundle: Bundle) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dialog = useImperativeDialog();

  const deleteBundle = useAdminDeleteBundle(bundle.id);

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
