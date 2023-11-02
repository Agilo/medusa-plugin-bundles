import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePagination, useTable } from "react-table";
import { useAdminBundles } from "../../../../../../admin-client";
import Table from "../../../../../../admin-ui/ui/src/components/molecules/table";
import TableContainer from "../../../../../../admin-ui/ui/src/components/organisms/table-container";
import { useDebounce } from "../../../../../../admin-ui/ui/src/hooks/use-debounce";
import useBundleActions from "./use-bundle-actions";
import useBundleTableColumn from "./use-bundle-column";

const BundleTable = () => {
  const { t } = useTranslation();

  const limit = 10;
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const debouncedSearchTerm = useDebounce(query, 500);

  const { bundles, isLoading, count } = useAdminBundles({
    q: debouncedSearchTerm,
    limit,
    offset,
  });

  useEffect(() => {
    if (typeof count !== "undefined") {
      const controlledPageCount = Math.ceil(count / limit);
      setNumPages(controlledPageCount);
    }
  }, [count]);

  const [columns] = useBundleTableColumn();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    gotoPage,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: bundles || [],
      manualPagination: true,
      initialState: {
        // pageIndex: Math.floor(offs / limit),
        pageIndex: currentPage,
        pageSize: limit,
        // hiddenColumns,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  );

  const handleNext = () => {
    if (canNextPage) {
      setOffset((old) => old + pageSize);
      setCurrentPage((old) => old + 1);
      nextPage();
    }
  };

  const handlePrev = () => {
    if (canPreviousPage) {
      setOffset((old) => old - pageSize);
      setCurrentPage((old) => old - 1);
      previousPage();
    }
  };

  const handleSearch = (q) => {
    setOffset(0);
    setQuery(q);
  };

  return (
    <TableContainer
      numberOfRows={15} // pushes pagination further down on the screen to the same level as the other (default) tables
      hasPagination
      pagingState={{
        count: count!,
        offset: offset,
        pageSize: offset + rows.length,
        title: t("bundle-table-bundles", "Bundles"),
        currentPage: pageIndex + 1,
        pageCount: pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: canNextPage,
        hasPrev: canPreviousPage,
      }}
      isLoading={isLoading}
    >
      <Table
        enableSearch
        searchValue={query}
        handleSearch={handleSearch}
        {...getTableProps()}
      >
        <>
          <Table.Head>
            {headerGroups?.map((headerGroup) => (
              <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((col) => (
                  <Table.HeadCell
                    className="min-w-[100px]"
                    {...col.getHeaderProps()}
                  >
                    {col.render("Header")}
                  </Table.HeadCell>
                ))}
              </Table.HeadRow>
            ))}
          </Table.Head>

          <Table.Body {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return <BundleRow row={row} {...row.getRowProps()} />;
            })}
          </Table.Body>
        </>
      </Table>
    </TableContainer>
  );
};

const BundleRow = ({ row, ...rest }) => {
  const bundle = row.original;
  const { getActions } = useBundleActions(bundle);

  return (
    <Table.Row
      color={"inherit"}
      linkTo={`/a/bundles/${bundle.id}`}
      actions={getActions()}
      {...rest}
    >
      {row.cells.map((cell, index) => {
        return (
          <Table.Cell {...cell.getCellProps()}>
            {cell.render("Cell", { index })}
          </Table.Cell>
        );
      })}
    </Table.Row>
  );
};
export default BundleTable;
