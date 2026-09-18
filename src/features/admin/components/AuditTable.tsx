import { ADMIN_TIMESTAMP, AUDIT_COPY } from '../constants';
import type { AuditEntry } from '../services';

interface AuditTableProps {
  entries: readonly AuditEntry[];
  /** Differs when a filter is on, so an empty screen never reads as "nothing ever happened". */
  emptyMessage: string;
}

export const AuditTable = ({ entries, emptyMessage }: AuditTableProps) =>
  entries.length === 0 ? (
    <p className="mt-6 rounded-md border border-hairline bg-canvas p-6 text-body-md text-muted">{emptyMessage}</p>
  ) : (
    <table className="mt-6 w-full border-collapse overflow-hidden rounded-md border border-hairline bg-canvas text-left">
      <thead className="border-b border-hairline">
        <tr className="text-caption text-muted">
          <th className="p-3">{AUDIT_COPY.columns.when}</th>
          <th className="p-3">{AUDIT_COPY.columns.who}</th>
          <th className="p-3">{AUDIT_COPY.columns.what}</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(({ id, at, actorEmail, sentence, reason, action, subjectLabel, subjectId }) => (
          <tr key={id} className="border-b border-hairline-soft align-top last:border-0">
            <td className="p-3 text-body-sm whitespace-nowrap text-muted">
              <time dateTime={at.toISOString()}>{ADMIN_TIMESTAMP.format(at)}</time>
            </td>
            <td className="p-3 text-body-sm text-muted">{actorEmail}</td>
            <td className="p-3">
              <p className="text-body-md text-ink">
                {sentence}
                {reason ? `${AUDIT_COPY.reasonSeparator}${reason}` : ''}
              </p>
              <p className="mt-1 text-caption text-muted">
                {[reason ? null : AUDIT_COPY.noReason, `${subjectLabel} ${subjectId}`, action]
                  .filter(Boolean)
                  .join(AUDIT_COPY.metaSeparator)}
              </p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
