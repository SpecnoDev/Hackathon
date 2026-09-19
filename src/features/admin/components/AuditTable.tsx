import { relativeTime } from '@/shared/utils';
import { ADMIN_TIMESTAMP, AUDIT_COPY } from '../constants';
import type { AuditEntry } from '../services';

const COLUMNS = Object.values(AUDIT_COPY.columns);

/** The rows of the trail, for a `ListSurface`; the page decides what an empty trail says. */
export const AuditTable = ({ entries }: { entries: readonly AuditEntry[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-hairline">
          {COLUMNS.map((column) => (
            <th key={column} scope="col" className="whitespace-nowrap px-4 py-3 text-caption text-muted">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-hairline-soft text-body-sm text-ink">
        {entries.map(({ id, at, actorEmail, sentence, reason, action, subjectLabel, subjectId }) => (
          <tr key={id} className="align-top transition-colors duration-150 hover:bg-sand motion-reduce:transition-none">
            <td className="whitespace-nowrap px-4 py-3">
              <time dateTime={at.toISOString()} title={ADMIN_TIMESTAMP.format(at)} className="block text-ink">
                {relativeTime(at)}
              </time>
              <span className="block text-caption text-muted">{ADMIN_TIMESTAMP.format(at)}</span>
            </td>
            <td className="px-4 py-3 text-muted">{actorEmail}</td>
            <td className="px-4 py-3">
              <p className="text-body-md text-ink">{sentence}</p>
              <p className="mt-1 text-body-sm text-muted">{reason ?? AUDIT_COPY.noReason}</p>
              <p className="mt-1 text-caption text-muted-soft">{[`${subjectLabel} ${subjectId}`, action].join(AUDIT_COPY.metaSeparator)}</p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
