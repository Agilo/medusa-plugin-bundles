import { useState } from "react";
import { useTranslation } from "react-i18next";
import BundleTable from "../../../../../../admin-ui-custom/ui/src/components/templates/bundle-table";
import Button from "../../../../../../admin-ui/ui/src/components/fundamentals/button";
import PlusIcon from "../../../../../../admin-ui/ui/src/components/fundamentals/icons/plus-icon";
import BodyCard from "../../../../../../admin-ui/ui/src/components/organisms/body-card";
import TableViewHeader from "../../../../../../admin-ui/ui/src/components/organisms/custom-table-header";
import AddBundleModal from "../../../components/templates/bundle-modal";
import { useWidgets } from "@medusajs/admin-ui/ui/src/providers/widget-provider";
// import { Bundle } from "../../../../../../admin-client";
// import WidgetErrorBoundary from "@medusajs/admin-ui/ui/src/components/extensions/widget-container/widget-error-boundary";

// type UseWidgetContainerProps<T extends keyof EntityMap> = {
//   injectionZone: T
//   entity?: EntityMap[T]
// }

// export const useWidgetContainerProps = <T extends keyof EntityMap>({
//   injectionZone,
//   entity,
// }: UseWidgetContainerProps<T>) => {
//   const baseProps = useExtensionBaseProps() satisfies WidgetProps

//   /**
//    * Not all InjectionZones have an entity, so we need to check for it first, and then
//    * add it to the props if it exists.
//    */
//   if (entity) {
//     const propKey = injectionZone as keyof typeof PropKeyMap
//     const entityKey = PropKeyMap[propKey]

//     return {
//       ...baseProps,
//       [entityKey]: entity,
//     }
//   }

//   return baseProps
// }

// export const injectionZones = [
//   // Bundle injection zones
//   "bundle.details.before",
//   "bundle.details.after",
//   "bundle.list.before",
//   "bundle.list.after",
// ] as const;

// type InjectionZone = (typeof injectionZones)[number];

// export type Widget = {
//   origin: string;
//   Widget: ComponentType<any>;
// };

// export type EntityMap = {
//   // Details
//   "product.details.after": Bundle;
//   "product.details.before": Bundle;
//   // List
//   "product.list.after"?: never | null | undefined;
//   "product.list.before"?: never | null | undefined;
// };

// type WidgetContainerProps<T extends keyof EntityMap> = {
//   injectionZone: T;
//   widget: Widget;
//   entity: EntityMap[T];
// };

// const WidgetContainer = <T extends InjectionZone>({
//   injectionZone,
//   widget,
//   entity,
// }: WidgetContainerProps<T>) => {
//   const { Widget, origin } = widget;

//   const props = useWidgetContainerProps({
//     injectionZone,
//     entity,
//   });

//   return (
//     <WidgetErrorBoundary origin={origin}>
//       {React.createElement(Widget, props)}
//     </WidgetErrorBoundary>
//   );
// };

const VIEWS = ["bundles"];

const BundleIndex = () => {
  const { t } = useTranslation();
  const [showNewBundle, setShowNewBundle] = useState(false);

  const { getWidgets } = useWidgets();

  return (
    <>
      <div className="gap-y-xsmall flex h-full grow flex-col">
        {/* {
          // @ts-ignore
          getWidgets("bundle.list.before").map((w, i) => {
            return (
              <WidgetContainer
                key={i}
                // @ts-ignore
                injectionZone={"bundle.list.before"}
                widget={w}
                entity={undefined}
              />
            );
          })
        } */}
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
