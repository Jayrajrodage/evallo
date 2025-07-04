import type { DateValue } from "@heroui/react";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getLocalTimeZone } from "@internationalized/date";
import axios from "axios";

import { logsParams, LogsResponse } from "@/types";

function toUtcISOString(dateValue: DateValue): string {
  // Convert to JS Date in local timezone
  const jsDate = dateValue.toDate(getLocalTimeZone());

  // Convert to UTC ISO string

  return jsDate.toISOString();
}

export const useLogs = (params: logsParams) => {
  const filteredParams = {
    level: params.level,
    message: params.message,
    resourceId: params.resourceId,
    traceId: params.traceId,
    spanId: params.spanId,
    commit: params.commit,
    timestamp_start: params.dateRange?.start
      ? toUtcISOString(params.dateRange.start)
      : undefined,
    timestamp_end: params.dateRange?.end
      ? toUtcISOString(params.dateRange.end)
      : undefined,
    page: params.page || 1,
    limit: params.limit || 10,
  };

  return useQuery({
    queryKey: ["logs", filteredParams],
    queryFn: async () => {
      const response = await axios.get<LogsResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/logs`,
        {
          params: filteredParams,
        }
      );

      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });
};
