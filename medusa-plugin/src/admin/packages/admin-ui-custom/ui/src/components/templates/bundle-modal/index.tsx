import { useAdminCustomPost } from "medusa-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useNotification from "../../../../../../admin-ui/ui/src/hooks/use-notification";
import { getErrorMessage } from "../../../../../../admin-ui/ui/src/utils/error-messages";
// import { nestedForm } from "../../../../../../admin-ui/ui/src/utils/nested-form";
// import MetadataForm, {
//   getSubmittableMetadata,
//   MetadataFormType,
// } from "../../forms/general/metadata-form";
import Button from "../../../../../../admin-ui/ui/src/components/fundamentals/button";
// import IconTooltip from "../../../../../../admin-ui/ui/src/components/molecules/icon-tooltip";
import InputField from "../../../../../../admin-ui/ui/src/components/molecules/input";
import Modal from "../../../../../../admin-ui/ui/src/components/molecules/modal";
import TextArea from "../../../../../../admin-ui/ui/src/components/molecules/textarea";
import { Bundle } from "../../../../../../../../models/bundle";
// import { MetadataField } from "../../../../../../admin-ui/ui/src/components/organisms/metadata";

type BundleModalProps = {
  onClose: () => void;
  onSubmit: (values: any /*, metadata: MetadataField[]*/) => void;
  isEdit?: boolean;
  bundle?: Bundle;
};

type BundleModalFormData = {
  title: string;
  // handle: string | undefined;
  description: string | undefined;
  // metadata: MetadataFormType;
};

type AdminBundleReq = {
  title: string;
  description: string | undefined;
};

type AdminBundleRes = {
  bundle: Bundle;
};

const BundleModal: React.FC<BundleModalProps> = ({
  onClose,
  isEdit = false,
  bundle,
}) => {
  const { t } = useTranslation();
  // const { mutate: update, isLoading: updating } = useAdminUpdateCollection(
  //   bundle?.id!
  // );
  const { mutate: update, isLoading: updating } = useAdminCustomPost<
    AdminBundleReq,
    AdminBundleRes
  >(`/bundles/${bundle?.id}`, ["bundles", bundle?.id]);

  // const { mutate: create, isLoading: creating } = useAdminCreateCollection();
  const { mutate: create, isLoading: creating } = useAdminCustomPost<
    AdminBundleReq,
    AdminBundleRes
  >(`/bundles`, ["bundles"]);

  const form = useForm<BundleModalFormData>({
    defaultValues: {
      title: bundle?.title,
      // handle: bundle?.handle,
      description: bundle?.description,
      // metadata: {
      //   entries: Object.entries(collection?.metadata || {}).map(
      //     ([key, value]) => ({
      //       key,
      //       value: value as string,
      //       state: "existing",
      //     })
      //   ),
      // },
    },
  });
  const { register, handleSubmit, reset } = form;

  useEffect(() => {
    if (bundle) {
      reset({
        title: bundle.title,
        // handle: bundle.handle,
        description: bundle.description,
        // metadata: {
        //   entries: Object.entries(collection.metadata || {}).map(
        //     ([key, value]) => ({
        //       key,
        //       value: value as string,
        //       state: "existing",
        //     })
        //   ),
        // },
      });
    }
  }, [bundle, reset]);

  const notification = useNotification();

  if (isEdit && !bundle) {
    throw new Error("Bundle is required for edit");
  }

  const submit = (data: BundleModalFormData) => {
    if (isEdit) {
      update(
        {
          title: data.title,
          // handle: data.handle,
          description: data.description,
          // metadata: getSubmittableMetadata(data.metadata),
        },
        {
          onSuccess: () => {
            notification(
              t("bundle-modal-success", "Success"),
              t(
                "bundle-modal-successfully-updated-bundle",
                "Successfully updated bundle"
              ),
              "success"
            );
            onClose();
          },
          onError: (error) => {
            notification(
              t("bundle-modal-error", "Error"),
              getErrorMessage(error),
              "error"
            );
          },
        }
      );
    } else {
      create(
        {
          title: data.title,
          // handle: data.handle,
          description: data.description,
          // metadata: getSubmittableMetadata(data.metadata),
        },
        {
          onSuccess: () => {
            notification(
              t("bundle-modal-success", "Success"),
              t(
                "bundle-modal-successfully-created-bundle",
                "Successfully created bundle"
              ),
              "success"
            );
            onClose();
          },
          onError: (error) => {
            notification(
              t("bundle-modal-error", "Error"),
              getErrorMessage(error),
              "error"
            );
          },
        }
      );
    }
  };

  return (
    <Modal handleClose={onClose} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <div>
            <h1 className="inter-xlarge-semibold mb-2xsmall">
              {isEdit
                ? t("bundle-modal-edit-bundle", "Edit Bundle")
                : t("bundle-modal-add-bundle", "Add Bundle")}
            </h1>
            <p className="inter-small-regular text-grey-50">
              {t(
                "bundle-modal-description",
                "To create a bundle, all you need is a title and a description."
              )}
            </p>
          </div>
        </Modal.Header>
        <form onSubmit={handleSubmit(submit)}>
          <Modal.Content>
            <div>
              <h2 className="inter-base-semibold mb-base">
                {t("bundle-modal-details", "Details")}
              </h2>
              <div className="mb-small">
                <InputField
                  label={t("bundle-modal-title-label", "Title")}
                  required
                  placeholder={t(
                    "bundle-modal-title-placeholder",
                    "Sunglasses"
                  )}
                  {...register("title", { required: true })}
                />
                {/* <InputField
                  label={t("bundle-modal-handle-label", "Handle")}
                  placeholder={t(
                    "bundle-modal-handle-placeholder",
                    "sunglasses"
                  )}
                  {...register("handle")}
                  prefix="/"
                  tooltip={
                    <IconTooltip
                      content={t(
                        "bundle-modal-slug-description",
                        "URL Slug for the collection. Will be auto generated if left blank."
                      )}
                    />
                  }
                /> */}
              </div>
              <TextArea
                label="Description"
                placeholder={"Describe this bundle."}
                rows={3}
                className="mb-small"
                {...register("description")}
                // errors={errors}
              />
              <p className="inter-base-regular text-grey-50">
                Give your bundle a short and clear description.
                <br />
                120-160 characters is the recommended length for search engines.
              </p>
            </div>
            {/* <div className="mt-xlarge">
              <h2 className="inter-base-semibold mb-base">
                {t("bundle-modal-metadata", "Metadata")}
              </h2>
              <MetadataForm form={nestedForm(form, "metadata")} />
            </div> */}
          </Modal.Content>
          <Modal.Footer>
            <div className="gap-x-xsmall flex w-full items-center justify-end">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={onClose}
              >
                {t("bundle-modal-cancel", "Cancel")}
              </Button>
              <Button
                variant="primary"
                size="small"
                loading={isEdit ? updating : creating}
              >
                {isEdit
                  ? t("bundle-modal-save-bundle", "Save bundle")
                  : t("bundle-modal-publish-bundle", "Publish bundle")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default BundleModal;
