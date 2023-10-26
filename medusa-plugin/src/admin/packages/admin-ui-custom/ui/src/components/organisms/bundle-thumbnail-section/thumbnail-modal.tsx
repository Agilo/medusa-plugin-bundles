import { Product } from "@medusajs/medusa";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
// import useEditProductActions from "@src/admin/packages/admin-ui/ui/src/hooks/use-edit-product-actions";
import useNotification from "../../../../../../admin-ui/ui/src/hooks/use-notification";
import { FormImage } from "../../../../../../admin-ui/ui/src/types/shared";
import { prepareImages } from "../../../../../../admin-ui/ui/src/utils/images";
import { nestedForm } from "../../../../../../admin-ui/ui/src/utils/nested-form";
import ThumbnailForm, {
  ThumbnailFormType,
} from "../../../../../../admin-ui/ui/src/components/forms/product/thumbnail-form";
import Button from "../../../../../../admin-ui/ui/src/components/fundamentals/button";
import Modal from "../../../../../../admin-ui/ui/src/components/molecules/modal";
import { useBundlesUpdate } from "../../../hooks/useBundles";
import { getErrorMessage } from "../../../../../../admin-ui/ui/src/utils/error-messages";
import { Bundle } from "../../../../../../admin-client";

type Props = {
  bundle: Bundle;
  open: boolean;
  onClose: () => void;
};

type ThumbnailFormWrapper = {
  thumbnail: ThumbnailFormType;
};

const ThumbnailModal = ({ bundle, open, onClose }: Props) => {
  const { t } = useTranslation();
  // const { onUpdate, updating } = useEditProductActions(product.id);
  const updateBundle = useBundlesUpdate(bundle.id);
  const form = useForm<ThumbnailFormWrapper>({
    defaultValues: getDefaultValues(bundle),
  });

  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form;

  const notification = useNotification();

  useEffect(() => {
    reset(getDefaultValues(bundle));
  }, [bundle, reset]);

  const onReset = () => {
    reset(getDefaultValues(bundle));
    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    let preppedImages: FormImage[] = [];

    try {
      preppedImages = await prepareImages(data.thumbnail.images);
    } catch (error) {
      let errorMessage = t(
        "bundle-thumbnail-section-upload-thumbnail-error",
        "Something went wrong while trying to upload the thumbnail."
      );
      const response = (error as any).response as Response;

      if (response.status === 500) {
        errorMessage =
          errorMessage +
          " " +
          t(
            "bundle-thumbnail-section-you-might-not-have-a-file-service-configured-please-contact-your-administrator",
            "You might not have a file service configured. Please contact your administrator"
          );
      }

      notification(
        t("bundle-thumbnail-section-error", "Error"),
        errorMessage,
        "error"
      );
      return;
    }
    const url = preppedImages?.[0]?.url;

    updateBundle.mutate(
      // @ts-ignore TODO fix images being required
      {
        // @ts-ignore
        thumbnail: url || null,
      },
      {
        onSuccess: () => {
          notification("Success", "Bundle was successfully updated", "success");
          onReset();
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error");
        },
      }
    );
  });

  return (
    <Modal open={open} handleClose={onReset} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onReset}>
          <h1 className="inter-xlarge-semibold m-0">
            {t("bundle-thumbnail-section-upload-thumbnail", "Upload Thumbnail")}
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <h2 className="inter-large-semibold mb-2xsmall">
              {t("bundle-thumbnail-section-thumbnail", "Thumbnail")}
            </h2>
            <p className="inter-base-regular text-grey-50 mb-large">
              {t(
                "bundle-thumbnail-section-used-to-represent-your-bundle-during-checkout-social-sharing-and-more",
                "Used to represent your bundle during checkout, social sharing and more."
              )}
            </p>
            <ThumbnailForm form={nestedForm(form, "thumbnail")} />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full justify-end gap-x-2">
              <Button
                size="small"
                variant="secondary"
                type="button"
                onClick={onReset}
              >
                {t("bundle-thumbnail-section-cancel", "Cancel")}
              </Button>
              <Button
                size="small"
                variant="primary"
                type="submit"
                disabled={!isDirty}
                loading={updateBundle.isLoading}
              >
                {t("bundle-thumbnail-section-save-and-close", "Save and close")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};

const getDefaultValues = (bundle: Bundle): ThumbnailFormWrapper => {
  return {
    thumbnail: {
      images: bundle.thumbnail
        ? [
            {
              url: bundle.thumbnail,
            },
          ]
        : [],
    },
  };
};

export default ThumbnailModal;
