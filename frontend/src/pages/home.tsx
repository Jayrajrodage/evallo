import React from "react";

import TableLoader from "@/components/tableLoader";
import { useLogs } from "@/hooks/useLogs";
import DefaultLayout from "@/layouts/default";
import { logsParams } from "@/types";
import FilterBar from "@/components/filterBar";
import LogsTable from "@/components/logsTable";

export default function Home() {
  const [filters, setFilters] = React.useState<logsParams>({
    message: undefined,
    resourceId: undefined,
    traceId: undefined,
    spanId: undefined,
    commit: undefined,
    level: undefined,
    dateRange: null,
    page: 1,
    limit: 10,
  });
  const { data, isLoading, isFetching, isError, isSuccess } = useLogs(filters);

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-5">
        <FilterBar filters={filters} setFilters={setFilters} />
        {isLoading ? (
          <TableLoader />
        ) : isError ? (
          <div className="text-center text-red-500">Something went wrong</div>
        ) : isSuccess ? (
          <div>
            <LogsTable
              data={data}
              filters={filters}
              isFetching={isFetching}
              setFilters={setFilters}
            />
          </div>
        ) : (
          <div className="text-center text-red-500">Something went wrong</div>
        )}
      </div>
    </DefaultLayout>
  );
}
