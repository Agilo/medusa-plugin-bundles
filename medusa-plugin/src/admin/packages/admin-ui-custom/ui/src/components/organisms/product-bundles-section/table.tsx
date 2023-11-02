import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Column, useTable } from "react-table";
import { Bundle } from "../../../../../../admin-client";
import ImagePlaceholder from "../../../../../../admin-ui/ui/src/components/fundamentals/image-placeholder";
import StatusIndicator from "../../../../../../admin-ui/ui/src/components/fundamentals/status-indicator";
import Table from "../../../../../../admin-ui/ui/src/components/molecules/table";

type Props = {
  bundles: Bundle[];
};

export const useBundlesTableColumns = () => {
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

  const columns = useMemo<Column<Bundle>[]>(() => {
    return [
      {
        Header: t("product-bundles-section-title", "Name"),
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
              <Link to={`/a/bundles/${original.id}`}>{original.title}</Link>
            </div>
          );
        },
      },
      {
        Header: t("product-bundles-section-handle", "Handle"),
        accessor: "handle",
        Cell: ({ cell: { value } }) => <div>/{value}</div>,
      },
      {
        Header: t("product-bundles-section-status", "Status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => getBundleStatus(value),
      },
    ];
  }, []);

  return columns;
};

const BundlesTable = ({ bundles }: Props) => {
  const { t } = useTranslation();
  const columns = useBundlesTableColumns();

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: bundles,
      defaultColumn: {
        width: "auto",
      },
    });

  return (
    <Table {...getTableProps()} className="table-fixed">
      <Table.Head>
        {headerGroups?.map((headerGroup) => {
          const { key, ...rest } = headerGroup.getHeaderGroupProps();
          return (
            <Table.HeadRow key={key} {...rest}>
              {headerGroup.headers.map((col) => {
                const { key, ...rest } = col.getHeaderProps();

                return (
                  <Table.HeadCell key={key} {...rest}>
                    {col.render("Header")}
                  </Table.HeadCell>
                );
              })}
            </Table.HeadRow>
          );
        })}
      </Table.Head>
      <Table.Body {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          const { key, ...rest } = row.getRowProps();
          return (
            <Table.Row color={"inherit"} key={key} {...rest}>
              {row.cells.map((cell) => {
                const { key, ...rest } = cell.getCellProps();
                return (
                  <Table.Cell key={key} {...rest}>
                    {cell.render("Cell")}
                  </Table.Cell>
                );
              })}
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default BundlesTable;
