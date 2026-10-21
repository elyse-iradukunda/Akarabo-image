import type { ReactNode } from 'react';

export interface DataTableProps<T> {
  /** Column definitions. */
  columns: Array<{
    key: string;
    header: string;
    render: (row: T) => ReactNode;
    align?: 'left' | 'right' | 'center';
    width?: string;
  }>;
  /** Rows to render. */
  rows: T[];
  /** Stable key for each row. */
  rowKey: (row: T) => string;
  /** Rendered when there are no rows. */
  empty?: ReactNode;
  /** Extra class on the wrapping element. */
  className?: string;
}

/** Thin wrapper around a semantic table with consistent styling. */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty,
  className,
}: DataTableProps<T>) {
  if (rows.length === 0 && empty) {
    return <>{empty}</>;
  }

  return (
    <div className={`ak-table-wrap${className ? ` ${className}` : ''}`}>
      <table className="ak-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
                className={
                  column.align === 'right'
                    ? 'ak-table__align-right'
                    : column.align === 'center'
                      ? 'ak-table__align-center'
                      : undefined
                }
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={
                    column.align === 'right'
                      ? 'ak-table__align-right'
                      : column.align === 'center'
                        ? 'ak-table__align-center'
                        : undefined
                  }
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
