import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bundle,
  useAdminBundle,
  useAdminDeleteBundle,
  useAdminUpdateBundle,
} from "../../../../../../../admin-client";
import ViewProductsTable from "../../../../../../../admin-ui-custom/ui/src/components/templates/bundle-product-table/view-products-table";
import Medusa from "../../../../../../../admin-ui-custom/ui/src/services/api";
import BackButton from "../../../../../../../admin-ui/ui/src/components/atoms/back-button";
import Spinner from "../../../../../../../admin-ui/ui/src/components/atoms/spinner";
import EditIcon from "../../../../../../../admin-ui/ui/src/components/fundamentals/icons/edit-icon";
import TrashIcon from "../../../../../../../admin-ui/ui/src/components/fundamentals/icons/trash-icon";
import JSONView from "../../../../../../../admin-ui/ui/src/components/molecules/json-view";
import StatusSelector from "../../../../../../../admin-ui/ui/src/components/molecules/status-selector";
import DeletePrompt from "../../../../../../../admin-ui/ui/src/components/organisms/delete-prompt";
import Section from "../../../../../../../admin-ui/ui/src/components/organisms/section";
import AddProductsTable from "../../../../../../../admin-ui/ui/src/components/templates/collection-product-table/add-product-table";
import useNotification from "../../../../../../../admin-ui/ui/src/hooks/use-notification";
import { getErrorMessage } from "../../../../../../../admin-ui/ui/src/utils/error-messages";
import BundleThumbnailSection from "../../../../components/organisms/bundle-thumbnail-section";
import EditBundleModal from "../../../../components/templates/bundle-modal";

type BundleGeneralSectionProps = {
  bundle: Bundle;
  setShowEdit: (show: boolean) => void;
  setShowDelete: (show: boolean) => void;
  handleUpdateStatus: (newStatus: string) => void;
};

const BundleGeneralSection = ({
  bundle,
  setShowEdit,
  setShowDelete,
  handleUpdateStatus,
}: BundleGeneralSectionProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Section
        title={bundle.title}
        actions={[
          {
            label: t("details-edit-bundle", "Edit Bundle"),
            onClick: () => setShowEdit(true),
            icon: <EditIcon size="20" />,
          },
          {
            label: t("details-delete", "Delete"),
            onClick: () => setShowDelete(true),
            variant: "danger",
            icon: <TrashIcon size="20" />,
          },
        ]}
        // forceDropdown
        status={
          <StatusSelector
            isDraft={bundle.status === "draft"}
            activeState={t("bundle-general-section-published", "Published")}
            draftState={t("bundle-general-section-draft", "Draft")}
            onChange={() =>
              handleUpdateStatus(
                bundle.status === "draft" ? "published" : "draft"
              )
            }
          />
        }
      >
        <p className="inter-base-regular text-grey-50 mt-2 whitespace-pre-wrap">
          {bundle.description}
        </p>
      </Section>
    </>
  );
};

type BundleRawSectionProps = {
  bundle: any;
};

const BundleRawSection = ({ bundle }: BundleRawSectionProps) => {
  const { t } = useTranslation();
  return (
    <Section title={t("bundle-raw-section-raw-bundle", "Raw Bundle")}>
      <div className="pt-base">
        <JSONView data={bundle} />
      </div>
    </Section>
  );
};

const BundleDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const notification = useNotification();
  const [updates, setUpdates] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [showAddProducts, setShowAddProducts] = useState(false);

  const { bundle, isLoading, refetch } = useAdminBundle(id);
  const updateBundle = useAdminUpdateBundle(id);
  const deleteBundle = useAdminDeleteBundle(id);

  const handleUpdateStatus = (newStatus: string) => {
    updateBundle.mutate(
      { status: newStatus === "published" ? "published" : "draft" },
      {
        onSuccess: () => {
          const pastTense = newStatus === "published" ? "published" : "drafted";
          notification(
            "Success",
            `Product ${pastTense} successfully`,
            "success"
          );
        },
        onError: (err) => {
          notification("Ooops", getErrorMessage(err), "error");
        },
      }
    );
  };

  // const handleUpdateDetails = (data: {
  //   title: string;
  //   description?: string;
  // }) => {
  //   updateBundle.mutate(data, {
  //     onSuccess: () => {
  //       setShowEdit(false);
  //       refetch();
  //     },
  //   });
  // };

  const handleDelete = () => {
    deleteBundle.mutate(undefined, {
      onSuccess: () => navigate(`/a/bundles`),
    });
  };

  const handleAddProducts = async (
    addedIds: string[],
    removedIds: string[]
  ) => {
    try {
      if (addedIds.length > 0) {
        await Medusa.bundles.addProducts(bundle?.id, {
          product_ids: addedIds,
        });
      }

      if (removedIds.length > 0) {
        await Medusa.bundles.removeProducts(bundle?.id, {
          product_ids: removedIds,
        });
      }

      setShowAddProducts(false);
      notification(
        t("details-success", "Success"),
        t("details-updated-products-in-bundle", "Updated products in bundle"),
        "success"
      );
      refetch();
    } catch (error) {
      notification(
        t("details-error", "Error"),
        getErrorMessage(error),
        "error"
      );
    }
  };

  useEffect(() => {
    setUpdates(updates + 1); // force re-render product table when products are added/removed
  }, [bundle?.products]);

  if (isLoading || !bundle) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    );
  }

  return (
    <>
      <div className="pb-5xlarge">
        <BackButton
          path="/a/bundles"
          label="Back to Bundles"
          className="mb-xsmall"
        />
        <div className="gap-y-xsmall flex flex-col">
          {/* getWidgets("bundle.details.before") */}
          <div className="gap-x-base grid grid-cols-12">
            <div className="gap-y-xsmall col-span-12 flex flex-col">
              <BundleGeneralSection
                bundle={bundle}
                setShowEdit={setShowEdit}
                setShowDelete={setShowDelete}
                handleUpdateStatus={handleUpdateStatus}
              />
              {/* getWidgets("bundle.details.after") */}
              <Section
                title="Products"
                actions={[
                  {
                    label: t("details-edit-products", "Edit Products"),
                    icon: <EditIcon size="20" />,
                    onClick: () => setShowAddProducts(!showAddProducts),
                    // onClick: () => alert("Add Products"),
                  },
                ]}
              >
                <p className="text-grey-50 inter-base-regular mt-xsmall mb-base">
                  {t(
                    "details-products-in-this-bundle",
                    "Products in this bundle"
                  )}
                </p>
                {bundle && (
                  <ViewProductsTable
                    key={updates} // force re-render when collection is updated
                    bundleId={id}
                    refetchBundle={refetch}
                  />
                )}
              </Section>

              <BundleThumbnailSection bundle={bundle} />

              <BundleRawSection bundle={bundle} />
            </div>
          </div>
        </div>
      </div>
      {showEdit && (
        <EditBundleModal
          onClose={() => setShowEdit(!showEdit)}
          // onSubmit={handleUpdateDetails}
          isEdit
          bundle={bundle}
        />
      )}
      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(!showDelete)}
          heading={t("details-delete-bundle", "Delete bundle")}
          successText={t(
            "details-successfully-deleted-bundle",
            "Successfully deleted bundle"
          )}
          onDelete={async () => handleDelete()}
          confirmText={t("details-yes-delete", "Yes, delete")}
        />
      )}
      {showAddProducts && (
        <AddProductsTable
          onClose={() => setShowAddProducts(false)}
          onSubmit={handleAddProducts}
          existingRelations={bundle?.products ?? []}
        />
      )}
    </>
  );
};

export default BundleDetails;
