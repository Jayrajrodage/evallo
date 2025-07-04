import React from "react";
import {
  TableHeader,
  TableColumn,
  TableBody,
  Table,
  TableRow,
  TableCell,
  Spinner,
  Chip,
  Pagination,
} from "@heroui/react";

import { LogEntry, logTableProps } from "@/types";
import { columns } from "@/config/utils";

const LogsTable = ({
  filters,
  setFilters,
  isFetching,
  data,
}: logTableProps) => {
  const pages = data.pagination.totalPages;
  const renderCell = React.useCallback(
    (log: LogEntry, columnKey: React.Key) => {
      const cellValue = log[columnKey as keyof LogEntry];

      switch (columnKey) {
        case "traceId":
          return <div className="text-base">{log.traceId}</div>;

        case "spanId":
          return <div className="text-base">{log.spanId}</div>;

        case "commit":
          return <div className="font-mono text-base">{log.commit}</div>;

        case "resourceId":
          return <div className="text-base">{log.resourceId}</div>;

        case "timestamp":
          return (
            <div className="text-base">
              {new Date(log.timestamp).toLocaleString()}
            </div>
          );

        case "level":
          return (
            <Chip
              className={`${
                log.level === "error"
                  ? "bg-red-100 text-red-800"
                  : log.level === "warn"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
              }`}
            >
              {log.level}
            </Chip>
          );

        case "message":
          return (
            <div className="text-base line-clamp-2 max-w-[300px]">
              {log.message}
            </div>
          );

        case "metadata":
          return (
            <div className="text-base">{JSON.stringify(log.metadata)}</div>
          );

        default:
          return <div>{String(cellValue)}</div>;
      }
    },
    []
  );

  const bottomContent = React.useMemo(() => {
    return (
      <Pagination
        showControls
        classNames={{
          cursor: "bg-foreground text-background",
        }}
        color="default"
        page={filters.page}
        total={pages}
        variant="light"
        onChange={(page) =>
          setFilters((prev) => ({ ...prev, page: Number(page) }))
        }
      />
    );
  }, [data?.pagination.total, filters.page, pages]);

  return (
    <Table
      isHeaderSticky
      removeWrapper
      aria-label="Table"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      checkboxesProps={{
        classNames: {
          wrapper: "after:bg-foreground after:text-background text-background",
        },
      }}
      classNames={{
        th: ["bg-transparent", "border-b", "border-divider", "text-base"],
      }}
      selectionMode="single"
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        emptyContent={<div className="text-center">No data found!</div>}
        isLoading={isFetching}
        items={data?.data}
        loadingContent={<Spinner />}
      >
        {(item: LogEntry) => (
          <TableRow key={item.traceId}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default LogsTable;
