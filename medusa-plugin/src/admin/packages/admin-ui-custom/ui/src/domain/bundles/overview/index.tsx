import { useState } from "react";
import { useTranslation } from "react-i18next";
import BundleTable from "../../../../../../admin-ui-custom/ui/src/components/templates/bundle-table";
import Button from "../../../../../../admin-ui/ui/src/components/fundamentals/button";
import PlusIcon from "../../../../../../admin-ui/ui/src/components/fundamentals/icons/plus-icon";
import BodyCard from "../../../../../../admin-ui/ui/src/components/organisms/body-card";
import TableViewHeader from "../../../../../../admin-ui/ui/src/components/organisms/custom-table-header";
import AddBundleModal from "../../../components/templates/bundle-modal";

const VIEWS = ["bundles"];

const BundleIndex = () => {
  const { t } = useTranslation();
  const [showNewBundle, setShowNewBundle] = useState(false);

  return (
    <>
      <div className="gap-y-xsmall flex h-full grow flex-col">
        <div className="flex w-full grow flex-col">
          <BodyCard
            forceDropdown={false}
            customActionable={
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setShowNewBundle(!showNewBundle)}
                  // onClick={() => alert("New Bundle")}
                >
                  <PlusIcon size={20} />
                  {t("overview-new-bundle", "New Bundle")}
                </Button>
              </div>
            }
            customHeader={
              <TableViewHeader
                views={VIEWS}
                // setActiveView={setView}
                // activeView={view}
              />
            }
            className="h-fit"
          >
            <BundleTable />
          </BodyCard>
        </div>
      </div>

      {showNewBundle && (
        <AddBundleModal onClose={() => setShowNewBundle(!showNewBundle)} />
      )}
    </>
  );
};

export default BundleIndex;
