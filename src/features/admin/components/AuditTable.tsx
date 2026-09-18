import { relativeTime } from '@/shared/utils';
import { ADMIN_TIMESTAMP, AUDIT_COPY } from '../constants';
import type { AuditEntry } from '../services';

interface AuditTableProps {
  entries: readonly AuditEntry[];
  /** Differs when a filter is on, so an empty screen never reads as "nothing ever happened". */
  emptyMessage: string;
}

const COLUMNS = Object.values(AUDIT_COPY.columns);

export const AuditTable = ({ entries, emptyMessage }: AuditTableProps) =>
  entries.length === 0 ? (
    <p className="rounded-lg border border-hairline bg-canvas p-6 text-body-md text-muted">{emptyMessage}</p>
  ) : (
    <div className="overflow-hidden rounded-lg border border-hairline bg-canvas">
      <table className="w-full border-collapse text-left">
        <thead className="bg-surface-soft">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} scope="col" className="px-4 py-3 text-caption text-muted">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-body-sm text-ink">
          {entries.map(({ id, at, actorEmail, sentence, reason, action, subjectLabel, subjectId }) => (
            <tr
              key={id}
              className="border-t border-hairline-soft align-top transition-colors duration-150 hover:bg-surface-soft motion-reduce:transition-none"
            >
              <td className="px-4 py-3 whitespace-nowrap">
                <time dateTime={at.toISOString()} title={ADMIN_TIMESTAMP.format(at)} className="block text-ink">
                  {relativeTime(at)}
                </time>
                <span className="block text-caption text-muted">{ADMIN_TIMESTAMP.format(at)}</span>
              </td>
              <td className="px-4 py-3 text-muted">{actorEmail}</td>
              <td className="px-4 py-3">
                <p className="text-body-md text-ink">{sentence}</p>
                <p className="mt-1 text-body-sm text-muted">{reason ?? AUDIT_COPY.noReason}</p>
                <p className="mt-1 text-caption text-muted-soft">
                  {[`${subjectLabel} ${subjectId}`, action].join(AUDIT_COPY.metaSeparator)}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
