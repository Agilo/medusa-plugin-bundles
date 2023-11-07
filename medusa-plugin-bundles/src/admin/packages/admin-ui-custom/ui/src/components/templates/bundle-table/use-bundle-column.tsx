import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ImagePlaceholder from "../../../../../../admin-ui/ui/src/components/fundamentals/image-placeholder";
import StatusIndicator from "../../../../../../admin-ui/ui/src/components/fundamentals/status-indicator";

const useBundleTableColumn = (/*{ setTileView, setListView, showList }*/) => {
  const { t } = useTranslation();

  const getBundleStatus = (status) => {
    switch (status) {
      case "published":
        return (
          <StatusIndicator
            title={t("bundle-table-published-title", "Published")}
            variant={"success"}
          />
        );
      case "draft":
        return (
          <StatusIndicator
            title={t("bundle-table-draft-title", "Draft")}
            variant={"default"}
          />
        );
      default:
        return <StatusIndicator title={status} variant={"default"} />;
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: t("bundle-table-name", "Name"),
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex items-center">
              <div className="my-1.5 mr-4 flex h-[40px] w-[30px] items-center">
                {original.thumbnail ? (
                  <img
                    src={original.thumbnail}
                    className="rounded-soft h-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              {original.title}
            </div>
          );
        },
      },
      {
        Header: t("bundle-table-handle", "Handle"),
        accessor: "handle",
        Cell: ({ cell: { value } }) => <div>/{value}</div>,
      },
      {
        Header: t("bundle-table-description", "Description"),
        accessor: "description",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex items-center">{original.description}</div>
          );
        },
      },
      {
        Header: t("bundle-table-status", "Status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => getBundleStatus(value),
      },
      {
        Header: t("bundle-table-id", "ID"),
        accessor: "id",
        Cell: ({ row: { original } }) => {
          return <div className="flex items-center">{original.id}</div>;
        },
      },
      {
        accessor: "col-3",
        Header: <div className="flex justify-end text-right"></div>,
      },
    ],
    [
      /*showList*/
    ]
  );

  return [columns] as const;
};

export default useBundleTableColumn;
