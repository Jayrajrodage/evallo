import type { RangeValue } from "@react-types/shared";
import type { DateValue } from "@react-types/datepicker";

import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type LogLevel = "error" | "warn" | "info";

export interface LogEntry {
  traceId: string;
  spanId: string;
  commit: string;
  resourceId: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata: Record<string, any>;
}

export interface logFromProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export interface logsParams {
  level?: string;
  message?: string;
  resourceId?: string;
  traceId?: string;
  spanId?: string;
  commit?: string;
  dateRange: RangeValue<DateValue> | null;
  page: number;
  limit: number;
}

export interface LogsResponse {
  success: boolean;
  data: LogEntry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface filterBarProps {
  filters: logsParams;
  setFilters: React.Dispatch<React.SetStateAction<logsParams>>;
}
export interface logTableProps extends filterBarProps {
  data: LogsResponse;
  isFetching: boolean;
}
