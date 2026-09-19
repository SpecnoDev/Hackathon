import type { AdminAction } from '@prisma/client';
import { ADMIN_SUBJECT_TYPES, type AdminActionType, type AdminSubjectType } from '@/core/constants';
import { prisma } from '@/core/services';
import type { PageRange, Paged } from '@/shared/dto';
import {
  ADMIN_SUBJECT_LABELS,
  AUDIT_COPY,
  AUDIT_FALLBACK_SENTENCE,
  AUDIT_SENTENCES,
  AUDIT_SUBJECT_TOKEN,
} from '../constants';
import { countAdminActions, listAdminActions } from './admin-actions.service';

export interface AuditEntry {
  id: string;
  at: Date;
  actorEmail: string;
  /** "Henry suspended Nomsa Dlamini" — what the operator reads instead of a row of enum values. */
  sentence: string;
  reason: string | null;
  /** The stored `VERB:OUTCOME`, kept on the row so an unmapped action is still identifiable. */
  action: string;
  subjectLabel: string;
  subjectId: string;
}

const EMAIL_NAME_SEPARATORS = /[._-]+/;
const SUBJECT_KEY_SEPARATOR = '/';

/** "henry.javangwe@specno.com" -> "Henry". The full address stays on the row; this is only the sentence. */
const actorName = (email: string): string => {
  const [first = ''] = email.split('@')[0].split(EMAIL_NAME_SEPARATORS);

  return first ? `${first[0].toUpperCase()}${first.slice(1)}` : email;
};

const subjectKey = (subjectType: string, subjectId: string): string =>
  `${subjectType}${SUBJECT_KEY_SEPARATOR}${subjectId}`;

const idsOf = (rows: readonly AdminAction[], subjectType: AdminSubjectType): string[] =>
  rows.filter((row) => row.subjectType === subjectType).map((row) => row.subjectId);

/** One grouped lookup per subject table for the whole page, never one per row. */
const subjectNames = async (rows: readonly AdminAction[]): Promise<Map<string, string>> => {
  const [hosts, travellers, offerings] = await Promise.all([
    prisma.host.findMany({
      where: { id: { in: idsOf(rows, ADMIN_SUBJECT_TYPES.host) } },
      select: { id: true, fullName: true },
    }),
    prisma.traveller.findMany({
      where: { id: { in: idsOf(rows, ADMIN_SUBJECT_TYPES.traveller) } },
      select: { id: true, name: true },
    }),
    prisma.offering.findMany({
      where: { id: { in: idsOf(rows, ADMIN_SUBJECT_TYPES.offering) } },
      select: { id: true, title: true },
    }),
  ]);

  return new Map([
    ...hosts.map(({ id, fullName }) => [subjectKey(ADMIN_SUBJECT_TYPES.host, id), fullName] as const),
    ...travellers.map(({ id, name }) => [subjectKey(ADMIN_SUBJECT_TYPES.traveller, id), name] as const),
    ...offerings.map(({ id, title }) => [subjectKey(ADMIN_SUBJECT_TYPES.offering, id), title] as const),
  ]);
};

export const loadAuditTrail = async (
  action: AdminActionType | undefined,
  range: PageRange,
): Promise<Paged<AuditEntry>> => {
  const [rows, total] = await Promise.all([listAdminActions(action, range), countAdminActions(action)]);
  const names = await subjectNames(rows);

  return {
    total,
    rows: rows.map(({ id, createdAt, actorEmail, action: name, subjectType, subjectId, reason }) => {
      const subjectLabel = ADMIN_SUBJECT_LABELS[subjectType as AdminSubjectType] ?? subjectType;
      const subject = names.get(subjectKey(subjectType, subjectId)) ?? AUDIT_COPY.missingSubject(subjectLabel);
      const phrase = (AUDIT_SENTENCES[name] ?? AUDIT_FALLBACK_SENTENCE).replace(AUDIT_SUBJECT_TOKEN, subject);

      return {
        id,
        at: createdAt,
        actorEmail,
        sentence: `${actorName(actorEmail)} ${phrase}`,
        reason,
        action: name,
        subjectLabel,
        subjectId,
      };
    }),
  };
};
