import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePagination, useTable } from "react-table";
import { useAdminBundleProducts } from "../../../../../../admin-client";
import Medusa from "../../../../../../admin-ui-custom/ui/src/services/api";
import Button from "../../../../../../admin-ui/ui/src/components/fundamentals/button";
import TrashIcon from "../../../../../../admin-ui/ui/src/components/fundamentals/icons/trash-icon";
import Table from "../../../../../../admin-ui/ui/src/components/molecules/table";
import DeletePrompt from "../../../../../../admin-ui/ui/src/components/organisms/delete-prompt";
import TableContainer from "../../../../../../admin-ui/ui/src/components/organisms/table-container";
import useViewProductColumns from "../../../../../../admin-ui/ui/src/components/templates/collection-product-table/use-view-product-columns";
import { useDebounce } from "../../../../../../admin-ui/ui/src/hooks/use-debounce";

type ViewProductsTableProps = {
  bundleId: string;
  refetchBundle: () => void;
};

const ViewProductsTable: React.FC<ViewProductsTableProps> = ({
  bundleId,
  refetchBundle,
}) => {
  const limit = 10;
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const debouncedSearchTerm = useDebounce(query, 500);
  const { t } = useTranslation();

  const [showDelete, setShowDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | undefined>(undefined);

  const { products, count, isLoading, refetch } = useAdminBundleProducts(
    bundleId,
    {
      q: debouncedSearchTerm,
      limit,
      offset,
    }
  );

  useEffect(() => {
    refetch(); // Ensure we get the latest data
  }, [bundleId]);

  const handleRemoveProduct = () => {
    if (idToDelete) {
      Medusa.bundles
        .removeProducts(bundleId, {
          product_ids: [idToDelete],
        })
        .then(() => {
          refetch();
          refetchBundle();
        });
    }
  };

  const columns = useViewProductColumns();

  // const [sorted, sortingOptions] = useSortingOptions(products ?? []) TODO: Implement this with server side sorting

  const {
    rows,
    prepareRow,
    getTableBodyProps,
    getTableProps,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      data: products || [],
      columns: columns,
      manualPagination: true,
      initialState: {
        pageIndex: currentPage,
        pageSize: limit,
      },
      pageCount: numPages,
      getRowId: (row) => row.id,
    },
    usePagination,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        ...columns,
        {
          id: "actions",
          Cell: ({ row }) => {
            return (
              <Table.Cell className="pr-2xsmall w-[0%]">
                <Button
                  variant="ghost"
                  size="small"
                  className="text-grey-40"
                  onClick={() => {
                    setIdToDelete(row.original.id);
                    setShowDelete(true);
                  }}
                >
                  <TrashIcon size={20} />
                </Button>
              </Table.Cell>
            );
          },
        },
      ]);
    }
  );

  useEffect(() => {
    const controlledPageCount = Math.ceil(count! / limit);
    setNumPages(controlledPageCount);
  }, [products, count, limit]);

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
    <>
      <TableContainer
        isLoading={isLoading}
        hasPagination
        numberOfRows={pageSize}
        pagingState={{
          count: count!,
          offset: offset,
          pageSize: offset + rows.length,
          title: "Products",
          currentPage: pageIndex + 1,
          pageCount: pageCount,
          nextPage: handleNext,
          prevPage: handlePrev,
          hasNext: canNextPage,
          hasPrev: canPreviousPage,
        }}
      >
        <Table
          enableSearch
          handleSearch={handleSearch}
          searchPlaceholder={t(
            "bundle-product-table-search-products",
            "Search Products"
          )}
          {...getTableProps()}
          className="h-full"
        >
          <Table.Body {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Table.Row
                  color={"inherit"}
                  {...row.getRowProps()}
                  className="px-base"
                >
                  {row.cells.map((cell, index) => {
                    return cell.render("Cell", { index });
                  })}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </TableContainer>
      {showDelete && (
        <DeletePrompt
          onDelete={async () => handleRemoveProduct()}
          handleClose={() => setShowDelete(!showDelete)}
          heading={t(
            "bundle-product-table-remove-product-from-bundle",
            "Remove product from bundle"
          )}
          successText={t(
            "bundle-product-table-product-removed-from-bundle",
            "Product removed from bundle"
          )}
        />
      )}
    </>
  );
};

export default ViewProductsTable;
