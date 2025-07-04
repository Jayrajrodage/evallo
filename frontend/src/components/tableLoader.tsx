import {
  Table,
  TableHeader,
  TableColumn,
  Skeleton,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

const TableLoader = () => {
  return (
    <Table aria-label="Table Skeleton">
      <TableHeader>
        <TableColumn>
          <Skeleton className="flex w-full h-10" />
        </TableColumn>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="flex rounded-full w-full h-7" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableLoader;
