// import { isEmpty } from "lodash";
import { useAdminProducts, useAdminCustomQuery } from "medusa-react";
// import qs from "qs";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { usePagination, useTable } from "react-table";
import { useTranslation } from "react-i18next";
// import ProductsFilter from "../../../domain/products/filter-dropdown";
// import { useAnalytics } from "../../../providers/analytics-provider";
// import { useFeatureFlag } from "../../../providers/feature-flag-provider";
import Table from "../../../../../../admin-ui/ui/src/components/molecules/table";
import TableContainer from "../../../../../../admin-ui/ui/src/components/organisms/table-container";
// import ProductOverview from "./overview";
import useBundleActions from "./use-bundle-actions";
import useBundleTableColumn from "./use-bundle-column";
import { useDebounce } from "../../../../../../admin-ui/ui/src/hooks/use-debounce";
// import { useProductFilters } from "./use-product-filters";

// const DEFAULT_PAGE_SIZE = 15;
// const DEFAULT_PAGE_SIZE_TILE_VIEW = 18;

const defaultQueryProps = {
  fields: "id,title,description",
  // expand:
  //   "variants,options,variants.prices,variants.options,collection,tags,type,images",
  // is_giftcard: false,
};

const BundleTable = () => {
  const location = useLocation();
  const { t } = useTranslation();

  // const { isFeatureEnabled } = useFeatureFlag()
  // const { trackNumberOfProducts } = useAnalytics()

  // let hiddenColumns = ["sales_channel"]
  // if (isFeatureEnabled("sales_channels")) {
  //   defaultQueryProps.expand =
  //     "variants,options,variants.prices,variants.options,collection,tags,type,images,sales_channels"
  //   hiddenColumns = []
  // }

  // const {
  //   // reset,
  //   paginate,
  //   // setFilters,
  //   // setLimit,
  //   // filters,
  //   setQuery: setFreeText,
  //   queryObject,
  //   representationObject,
  // } = useProductFilters(location.search, defaultQueryProps);

  // const offs = parseInt(queryObject.offset) || 0;

  const limit = 10;
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const debouncedSearchTerm = useDebounce(query, 500);

  // const clearFilters = () => {
  //   reset();
  //   setQuery("");
  // };

  // const { products, isLoading, count } = useAdminProducts(
  //   {
  //     ...queryObject,
  //   },
  //   {
  //     keepPreviousData: true,
  //     onSuccess: ({ count }) => trackNumberOfProducts({ count }),
  //   }
  // )

  const { data, isLoading } = useAdminCustomQuery<any, any>(
    "/bundles",
    ["bundles"],
    {
      q: debouncedSearchTerm,
      limit,
      offset,
    }
  );

  const { bundles, count } = data ?? {};

  useEffect(() => {
    if (typeof count !== "undefined") {
      const controlledPageCount = Math.ceil(count / limit);
      setNumPages(controlledPageCount);
    }
  }, [count]);

  // const updateUrlFromFilter = (obj = {}) => {
  //   const stringified = qs.stringify(obj);
  //   window.history.replaceState(`/a/products`, "", `${`?${stringified}`}`);
  // };

  // const refreshWithFilters = () => {
  //   const filterObj = representationObject;

  //   if (isEmpty(filterObj)) {
  //     updateUrlFromFilter({ offset: 0, limit: DEFAULT_PAGE_SIZE });
  //   } else {
  //     updateUrlFromFilter(filterObj);
  //   }
  // };

  // useEffect(() => {
  //   refreshWithFilters();
  // }, [representationObject]);

  // const setTileView = () => {
  //   setLimit(DEFAULT_PAGE_SIZE_TILE_VIEW);
  //   setShowList(false);
  // };

  // const setListView = () => {
  //   setLimit(DEFAULT_PAGE_SIZE);
  //   setShowList(true);
  // };
  // const [showList, setShowList] = React.useState(true);
  // const [columns] = useProductTableColumn({
  //   setTileView,
  //   setListView,
  //   showList,
  // });
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

  // Debounced search
  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     if (query) {
  //       setFreeText(query);
  //       gotoPage(0);
  //     } else {
  //       if (typeof query !== "undefined") {
  //         // if we delete query string, we reset the table view
  //         reset();
  //       }
  //     }
  //   }, 400);

  //   return () => clearTimeout(delayDebounceFn);
  // }, [query]);

  // const handleNext = () => {
  //   if (canNextPage) {
  //     paginate(1);
  //     nextPage();
  //   }
  // };

  // const handlePrev = () => {
  //   if (canPreviousPage) {
  //     paginate(-1);
  //     previousPage();
  //   }
  // };

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
        // filteringOptions={
        //   <ProductsFilter
        //     filters={filters}
        //     submitFilters={setFilters}
        //     clearFilters={clearFilters}
        //     tabs={filterTabs}
        //     onTabClick={setTab}
        //     activeTab={activeFilterTab}
        //     onRemoveTab={removeTab}
        //     onSaveTab={saveTab}
        //   />
        // }
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
