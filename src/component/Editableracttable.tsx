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
import { CloseButton, OverlayTrigger, Tooltip } from "react-bootstrap";

type Option = {
  접두접미: string;
  현재수치: any;
  최대수치: string;
  유효: string;
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
              type="text"
              size={5}
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
        header: () => {
          return (
            <p className="d-inline">
              최대수치&nbsp;
              <OverlayTrigger
                overlay={
                  <Tooltip id="tooltip-disabled">
                    접두/접미/겹침(+크래프트)
                  </Tooltip>
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-question-square "
                  viewBox="0 0 16 16"
                  style={{ verticalAlign: "-0.125rem" }}
                >
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                  <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                </svg>
              </OverlayTrigger>
            </p>
          );
        },
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

  React.useEffect(() => {
    table.setPageSize(20);
  }, []);

  return (
    <Table bordered className="my-2 table-sm align-middle" variant="dark">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th
                  className="align-middle"
                  key={header.id}
                  colSpan={header.colSpan}
                >
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
            <tr
              key={row.id}
              className={row.original["유효"] ? "text-warning" : ""}
            >
              {row.getVisibleCells().map((cell) => {
                return (
                  <td key={cell.id}>
                    <p className="fs-6 my-2">
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
  );
}

export default Editabletable;
