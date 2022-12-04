import React from "react";
import Table from "react-bootstrap/Table";

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
} from "@tanstack/react-table";
import { CloseButton } from "react-bootstrap";

type Option = {
  접두접미: string;
  현재수치: any;
  최대수치: string;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    removeData: (rowIndex: number) => void;
  }
}

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<Option>> = {};

function useSkipper() {
  const shouldSkipRef = React.useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = React.useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  React.useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

function Editabletable({ optionlist, setOptionList }) {
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const columns = React.useMemo<ColumnDef<Option>[]>(
    () => [
      {
        header: "접두접미",
        accessorKey: "접두접미",
        footer: (props) => props.column.id,
      },
      {
        header: "현재수치",
        accessorKey: "현재수치",
        footer: (props) => props.column.id,
        cell: function Cell({
          getValue,
          row: { index },
          column: { id },
          table,
        }) {
          const initialValue = getValue();
          // We need to keep and update the state of the cell normally
          const [value, setValue] = React.useState(initialValue);

          // When the input is blurred, we'll call our table meta's updateData function
          const onBlur = () => {
            table.options.meta?.updateData(index, id, value);
          };

          // If the initialValue is changed external, sync it up with our state
          React.useEffect(() => {
            setValue(initialValue);
          }, [initialValue]);

          return (
            <input
              className="bg-dark text-white"
              value={value as string}
              onChange={(e) => setValue(e.target.value)}
              onBlur={onBlur}
              style={{ border: "0 solid black", cursor: "pointer" }}
            />
          );
        },
      },
      {
        header: "최대수치(접두/접미/겹침)",
        accessorKey: "최대수치",
        footer: (props) => props.column.id,
      },
      {
        id: "delete",
        cell: function Cell({ row: { index }, column: { id }, table }) {
          return (
            <CloseButton
              variant="white"
              style={{
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              }}
              onClick={() => {
                table.options.meta?.removeData(index);
              }}
            ></CloseButton>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: optionlist,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip age index reset until after next rerender
        skipAutoResetPageIndex();
        setOptionList((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },

      removeData: (rowIndex) => {
        skipAutoResetPageIndex();
        const datacopy = [...optionlist];
        datacopy.splice(rowIndex, 1);
        setOptionList(datacopy);
      },
    },
    debugTable: true,
  });

  return (
    <div>
      <Table bordered className="my-2 table-sm align-middle" variant="dark">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      <p className="fs-6">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </p>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default Editabletable;
