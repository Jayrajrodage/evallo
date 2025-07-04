import React, { useEffect } from "react";
import {
  DateRangePicker,
  Input,
  Select,
  SelectItem,
  RangeValue,
  DateValue,
} from "@heroui/react";
import {
  parseAbsoluteToLocal,
  getLocalTimeZone,
} from "@internationalized/date";

import { SearchIcon } from "./icons";

import { paginationNumbers, severity } from "@/config/utils";
import { filterBarProps } from "@/types";
import { useDebounce } from "@/hooks/useDebounced";

const FilterBar = ({ filters, setFilters }: filterBarProps) => {
  const [messageInput, setMessageInput] = React.useState(""); // fast input
  const [resourceInput, setResourceInput] = React.useState(""); // fast input

  const debouncedMessage = useDebounce(messageInput, 500);
  const debouncedResource = useDebounce(resourceInput, 500);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      message: debouncedMessage,
      resourceId: debouncedResource,
      page: 1,
    }));
  }, [debouncedMessage, debouncedResource]);

  const LevelChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilters((prev) => ({
        ...prev,
        level: e.target.value,
        page: Number(1),
      }));
    },
    []
  );

  const DateChange = React.useCallback((e: RangeValue<DateValue> | null) => {
    if (!e?.start && !e?.end) {
      setFilters((prev) => ({
        ...prev,
        dateRange: null,
      }));
      return;
    }
    const startISO = e.start.toDate(getLocalTimeZone()).toISOString();
    const endISO = e.end.toDate(getLocalTimeZone()).toISOString();

    setFilters((prev) => ({
      ...prev,
      dateRange: {
        start: parseAbsoluteToLocal(startISO),
        end: parseAbsoluteToLocal(endISO),
      },
      page: Number(1),
    }));
  }, []);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilters((prev) => ({ ...prev, limit: Number(e.target.value) }));
    },
    []
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-center">
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <Input
          isClearable
          label="Message"
          placeholder="Search by message..."
          size="sm"
          startContent={<SearchIcon className="text-default-300" />}
          value={messageInput}
          variant="underlined"
          onValueChange={setMessageInput}
        />
        <Input
          isClearable
          label="Resource ID"
          placeholder="Search by resource id..."
          size="sm"
          startContent={<SearchIcon className="text-default-300" />}
          value={resourceInput}
          variant="underlined"
          onValueChange={setResourceInput}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <DateRangePicker
          hideTimeZone
          aria-label="data/time picker"
          granularity="minute"
          label="Filter by date/time"
          value={filters.dateRange}
          variant="underlined"
          visibleMonths={1}
          onChange={DateChange}
        />
        <Select
          label="Filter by severity"
          selectionMode="multiple"
          value={filters.level}
          variant="underlined"
          onChange={LevelChange}
        >
          {severity.map((item) => (
            <SelectItem key={item.key}>{item.label}</SelectItem>
          ))}
        </Select>
        <Select
          isRequired
          defaultSelectedKeys={["10"]}
          label="Rows per page:"
          selectionMode="single"
          variant="underlined"
          onChange={onRowsPerPageChange}
        >
          {paginationNumbers.map((num) => (
            <SelectItem key={num.key}>{num.label}</SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
