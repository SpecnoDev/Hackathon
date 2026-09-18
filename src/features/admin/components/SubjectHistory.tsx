import type { AdminAction } from '@prisma/client';
import {
  ADMIN_COPY,
  ADMIN_TIMESTAMP,
  AUDIT_FALLBACK_SENTENCE,
  AUDIT_SENTENCES,
  AUDIT_SUBJECT_TOKEN,
} from '../constants';

interface SubjectHistoryProps {
  entries: readonly AdminAction[];
  /** The trail reads about a person, not an id, so the row is told who the subject is. */
  subjectName: string;
  emptyMessage: string;
}

export const SubjectHistory = ({ entries, subjectName, emptyMessage }: SubjectHistoryProps) =>
  entries.length === 0 ? (
    <p className="text-body-md text-muted">{emptyMessage}</p>
  ) : (
    <ol className="flex flex-col divide-y divide-hairline-soft">
      {entries.map(({ id, createdAt, actorEmail, action, reason }) => (
        <li key={id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
          <p className="text-body-md text-ink">
            {`${actorEmail} ${(AUDIT_SENTENCES[action] ?? AUDIT_FALLBACK_SENTENCE).replace(AUDIT_SUBJECT_TOKEN, subjectName)}`}
          </p>
          <p className="text-caption text-muted">
            <time dateTime={createdAt.toISOString()}>{ADMIN_TIMESTAMP.format(createdAt)}</time>
          </p>
          {reason ? <p className="text-body-sm text-body">{ADMIN_COPY.host.reasonOnRecord(reason)}</p> : null}
        </li>
      ))}
    </ol>
  );
