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
import IconTooltip from "../../../../../../admin-ui/ui/src/components/molecules/icon-tooltip";
import InputField from "../../../../../../admin-ui/ui/src/components/molecules/input";
import Modal from "../../../../../../admin-ui/ui/src/components/molecules/modal";
import TextArea from "../../../../../../admin-ui/ui/src/components/molecules/textarea";
import { Bundle } from "../../../../../../generated/admin-client";
import { useBundlesCreate, useBundlesUpdate } from "../../../hooks/useBundles";
// import { MetadataField } from "../../../../../../admin-ui/ui/src/components/organisms/metadata";

type BundleModalProps = {
  onClose: () => void;
  // onSubmit: (values: any /*, metadata: MetadataField[]*/) => void;
  isEdit?: boolean;
  bundle?: Bundle;
};

type BundleModalFormData = {
  title: string;
  handle: string | undefined;
  description: string | undefined;
};

const BundleModal: React.FC<BundleModalProps> = ({
  onClose,
  isEdit = false,
  bundle,
}) => {
  const { t } = useTranslation();
  const updateBundle = useBundlesUpdate(bundle?.id);
  const createBundle = useBundlesCreate();

  const form = useForm<BundleModalFormData>({
    defaultValues: {
      title: bundle?.title,
      handle: bundle?.handle,
      description: bundle?.description,
    },
  });
  const { register, handleSubmit, reset } = form;

  useEffect(() => {
    if (bundle) {
      reset({
        title: bundle.title,
        handle: bundle.handle,
        description: bundle.description,
      });
    }
  }, [bundle, reset]);

  const notification = useNotification();

  if (isEdit && !bundle) {
    throw new Error("Bundle is required for edit");
  }

  const submit = (data: BundleModalFormData) => {
    if (isEdit) {
      updateBundle.mutate(
        {
          title: data.title,
          handle: data.handle,
          description: data.description,
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
      createBundle.mutate(
        {
          title: data.title,
          handle: data.handle,
          description: data.description,
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
              <div className="gap-x-base flex items-center mb-small">
                <InputField
                  label={t("bundle-modal-title-label", "Title")}
                  required
                  placeholder={t("bundle-modal-title-placeholder", "Drumkit")}
                  {...register("title", { required: true })}
                />
                <InputField
                  label={t("bundle-modal-handle-label", "Handle")}
                  placeholder={t("bundle-modal-handle-placeholder", "drumkit")}
                  {...register("handle")}
                  prefix="/"
                  tooltip={
                    <IconTooltip
                      content={t(
                        "bundle-modal-slug-description",
                        "URL Slug for the bundle. Will be auto generated if left blank."
                      )}
                    />
                  }
                />
              </div>
              <TextArea
                label="Description"
                placeholder={
                  "The ideal first drum kit. Includes everything you need to get started."
                }
                rows={3}
                className="mb-small"
                {...register("description")}
                // errors={errors}
              />
              <p className="inter-base-regular text-grey-50">
                Give your bundle a short and clear description.
              </p>
            </div>
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
                loading={
                  isEdit ? updateBundle.isLoading : createBundle.isLoading
                }
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
