import clsx from "clsx";
import { useTranslation } from "react-i18next";
// import useEditProductActions from "../../../hooks/use-edit-product-actions";
import useNotification from "../../../../../../admin-ui/ui/src/hooks/use-notification";
import useToggleState from "../../../../../../admin-ui/ui/src/hooks/use-toggle-state";
import { getErrorMessage } from "../../../../../../admin-ui/ui/src/utils/error-messages";
import TwoStepDelete from "../../../../../../admin-ui/ui/src/components/atoms/two-step-delete";
import Button from "../../../../../../admin-ui/ui/src/components/fundamentals/button";
// import Section from "../../organisms/section";
import Section from "../../../../../../admin-ui/ui/src/components/organisms/section";
import ThumbnailModal from "./thumbnail-modal";
import { useBundlesUpdate } from "../../../hooks/useBundles";
import { Bundle } from "../../../../../../admin-client";

type Props = {
  bundle: Bundle;
};

const BundleThumbnailSection = ({ bundle }: Props) => {
  const { t } = useTranslation();
  // const { onUpdate, updating } = useEditProductActions(bundle.id);
  const updateBundle = useBundlesUpdate(bundle.id);
  const { state, toggle, close } = useToggleState();

  const notification = useNotification();

  const handleDelete = () => {
    // onUpdate(
    //   {
    //     // @ts-ignore
    //     thumbnail: null,
    //   },
    //   {
    //     onSuccess: () => {
    //       notification(
    //         t("bundle-thumbnail-section-success", "Success"),
    //         t(
    //           "bundle-thumbnail-section-successfully-deleted-thumbnail",
    //           "Successfully deleted thumbnail"
    //         ),
    //         "success"
    //       );
    //     },
    //     onError: (err) => {
    //       notification(
    //         t("bundle-thumbnail-section-error", "Error"),
    //         getErrorMessage(err),
    //         "error"
    //       );
    //     },
    //   }
    // );
    updateBundle.mutate(
      // @ts-ignore TODO fix images being required
      {
        // @ts-ignore
        thumbnail: null,
      },
      {
        onSuccess: () => {
          notification(
            t("bundle-thumbnail-section-success", "Success"),
            t(
              "bundle-thumbnail-section-successfully-deleted-thumbnail",
              "Successfully deleted thumbnail"
            ),
            "success"
          );
        },
        onError: (err) => {
          notification(
            t("bundle-thumbnail-section-error", "Error"),
            getErrorMessage(err),
            "error"
          );
        },
      }
    );
  };

  return (
    <>
      <Section
        title="Thumbnail"
        customActions={
          <div className="gap-x-xsmall flex items-center">
            <Button
              variant="secondary"
              size="small"
              type="button"
              onClick={toggle}
            >
              {bundle.thumbnail
                ? t("bundle-thumbnail-section-edit", "Edit")
                : t("bundle-thumbnail-section-upload", "Upload")}
            </Button>
            {bundle.thumbnail && (
              <TwoStepDelete
                onDelete={handleDelete}
                deleting={updateBundle.isLoading}
              />
            )}
          </div>
        }
      >
        <div
          className={clsx("gap-xsmall mt-base grid grid-cols-3", {
            hidden: !bundle.thumbnail,
          })}
        >
          {bundle.thumbnail && (
            <div className="flex aspect-square items-center justify-center">
              <img
                src={bundle.thumbnail}
                alt={`Thumbnail for ${bundle.title}`}
                className="rounded-rounded max-h-full max-w-full object-contain"
              />
            </div>
          )}
        </div>
      </Section>

      <ThumbnailModal bundle={bundle} open={state} onClose={close} />
    </>
  );
};

export default BundleThumbnailSection;
