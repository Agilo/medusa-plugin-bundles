import { useNavigate, useParams } from "react-router-dom";
// import FormValidator from "form-validator"
import Spinner from "../../../../../../../admin-ui/ui/src/components/atoms/spinner";
import BackButton from "../../../../../../../admin-ui/ui/src/components/atoms/back-button";
import Section from "../../../../../../../admin-ui/ui/src/components/organisms/section";
import StatusSelector from "../../../../../../../admin-ui/ui/src/components/molecules/status-selector";
import { useTranslation } from "react-i18next";
import JSONView from "../../../../../../../admin-ui/ui/src/components/molecules/json-view";
import EditIcon from "../../../../../../../admin-ui/ui/src/components/fundamentals/icons/edit-icon";
import { useEffect, useState } from "react";
import useNotification from "../../../../../../../admin-ui/ui/src/hooks/use-notification";
import { getErrorMessage } from "../../../../../../../admin-ui/ui/src/utils/error-messages";
import AddProductsTable from "../../../../../../../admin-ui/ui/src/components/templates/collection-product-table/add-product-table";
import Medusa from "../../../../../../../admin-ui-custom/ui/src/services/api";
import ViewProductsTable from "../../../../../../../admin-ui-custom/ui/src/components/templates/bundle-product-table/view-products-table";
// import { ActionType } from "../../../../../../../admin-ui/ui/src/components/molecules/actionables";
import TrashIcon from "../../../../../../../admin-ui/ui/src/components/fundamentals/icons/trash-icon";
// import { Bundle, BundleStatus } from "../../../../../../../../../models/bundle";
import EditBundleModal from "../../../../components/templates/bundle-modal";
import DeletePrompt from "../../../../../../../admin-ui/ui/src/components/organisms/delete-prompt";
import {
  useBundlesDelete,
  useBundlesRetrieve,
  useBundlesUpdate,
} from "../../../../hooks/useBundles";
import BundleThumbnailSection from "../../../../components/organisms/bundle-thumbnail-section";
import { Bundle } from "../../../../../../../admin-client";

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
        {/* <ProductTags product={product} /> */}
        {/* <ProductDetails product={product} /> */}
        {/* <ProductSalesChannels product={product} /> */}
      </Section>

      {/* <GeneralModal product={product} open={infoState} onClose={closeInfo} /> */}

      {/* <FeatureToggle featureFlag="sales_channels">
        <ChannelsModal
          product={product}
          open={channelsState}
          onClose={closeChannels}
        />
      </FeatureToggle> */}
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

  // const { data, isLoading, refetch } = useAdminCustomQuery<any, any>(
  //   `/bundles/${id}`,
  //   ["bundles", id]
  // );

  const { data, isLoading, refetch } = useBundlesRetrieve(id);

  const { bundle } = data ?? {};

  // const updateBundle = useBundlesUpdate(id, undefined);
  // const deleteBundle = useBundlesDelete(id);
  const updateBundle = useBundlesUpdate(id);
  const deleteBundle = useBundlesDelete(id);

  // const foo: Bundle = {
  //   created_at: "",
  //   updated_at: "",
  //   products: [],
  //   id: "",
  //   title: "debug bundle",
  //   description: "",
  //   status: "draft",
  // };

  // console.log(foo);
  // alert(foo);

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
          {/* {getWidgets("product.details.before").map((w, i) => {
          return (
            <WidgetContainer
              key={i}
              injectionZone={"product.details.before"}
              widget={w}
              entity={product}
            />
          );
        })} */}
          <div className="gap-x-base grid grid-cols-12">
            <div className="gap-y-xsmall col-span-12 flex flex-col">
              <BundleGeneralSection
                bundle={bundle}
                setShowEdit={setShowEdit}
                setShowDelete={setShowDelete}
                handleUpdateStatus={handleUpdateStatus}
              />
              {/* <ProductVariantsSection product={product} />
            <ProductAttributesSection product={product} /> */}
              {/* {getWidgets("product.details.after").map((w, i) => {
              return (
                <WidgetContainer
                  key={i}
                  injectionZone={"product.details.after"}
                  widget={w}
                  entity={product}
                />
              );
            })} */}

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
            {/* <div className="gap-y-xsmall col-span-4 flex flex-col">
            <ProductThumbnailSection product={product} />
            <ProductMediaSection product={product} />
          </div> */}
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
