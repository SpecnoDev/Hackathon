import type { ReactNode } from 'react';

/** The rows of a `ListSurface`: a hairline under the header, one soft hairline between rows, a hover the host side never gets. */
export const AdminTable = ({ columns, children }: { columns: readonly string[]; children: ReactNode }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-hairline">
          {columns.map((column) => (
            <th key={column} scope="col" className="whitespace-nowrap px-4 py-3 text-caption text-muted">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-hairline-soft text-body-sm text-ink">{children}</tbody>
    </table>
  </div>
);

export const AdminRow = ({ children }: { children: ReactNode }) => (
  <tr className="transition-colors duration-150 hover:bg-sand motion-reduce:transition-none">{children}</tr>
);

export const AdminCell = ({ children, muted = false }: { children: ReactNode; muted?: boolean }) => (
  <td className={`px-4 py-3 align-middle ${muted ? 'text-muted' : ''}`}>{children}</td>
);
