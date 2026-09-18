import type { ReactNode } from 'react';

/**
 * The back office is a desktop, traveller-density surface: the table sits in a hairline card, the
 * header on the soft surface, one hairline between rows, and a hover the host side never gets.
 */
export const AdminTable = ({ columns, children }: { columns: readonly string[]; children: ReactNode }) => (
  <div className="overflow-hidden rounded-lg border border-hairline bg-canvas">
    <table className="w-full border-collapse text-left">
      <thead className="bg-surface-soft">
        <tr>
          {columns.map((column) => (
            <th key={column} scope="col" className="px-4 py-3 text-caption text-muted">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="text-body-sm text-ink">{children}</tbody>
    </table>
  </div>
);

export const AdminRow = ({ children }: { children: ReactNode }) => (
  <tr className="border-t border-hairline-soft transition-colors duration-150 hover:bg-surface-soft motion-reduce:transition-none">
    {children}
  </tr>
);

export const AdminCell = ({ children, muted = false }: { children: ReactNode; muted?: boolean }) => (
  <td className={`px-4 py-3 align-middle ${muted ? 'text-muted' : ''}`}>{children}</td>
);
