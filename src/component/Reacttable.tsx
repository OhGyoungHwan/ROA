import * as React from "react";
import Table from "react-bootstrap/Table";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Option = {
  접두접미: string;
  현재수치: string;
  최대수치: string;
};

const columnHelper = createColumnHelper<Option>();

const columns = [
  columnHelper.accessor("접두접미", {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("현재수치", {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("최대수치", {
    cell: (info) => info.getValue(),
  }),
];

function Basictable({ optionlist }) {
  const defaultData: Option[] = [];
  const [data, setData] = React.useState(() => [...defaultData]);
  React.useEffect(() => {
    setData(defaultData);
    Object.keys(optionlist).map((value, idx) =>
      defaultData.push({
        접두접미: value,
        현재수치: optionlist[value],
        최대수치: "",
      })
    );
  }, [optionlist]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="p-2">
      <Table striped bordered hover className="my-2">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="h-4" />
    </div>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

export default Basictable;
