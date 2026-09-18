import type { ReactNode } from 'react';

/** The back office is a desktop, traveller-density surface: 16px rows, one hairline between them. */
export const AdminTable = ({ columns, children }: { columns: readonly string[]; children: ReactNode }) => (
  <table className="w-full border-collapse overflow-hidden rounded-md border border-hairline bg-canvas text-left">
    <thead className="border-b border-hairline">
      <tr>
        {columns.map((column) => (
          <th key={column} scope="col" className="px-4 py-3 text-caption text-muted">
            {column}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="text-body-md text-ink">{children}</tbody>
  </table>
);

export const AdminRow = ({ children }: { children: ReactNode }) => (
  <tr className="border-b border-hairline-soft last:border-0">{children}</tr>
);

export const AdminCell = ({ children, muted = false }: { children: ReactNode; muted?: boolean }) => (
  <td className={`px-4 py-3 align-middle ${muted ? 'text-muted' : ''}`}>{children}</td>
);
