import { Offering } from '@/core/interfaces';

/**
 * The contract this bot posts to the provider registry. Defined here because the
 * downstream API does not exist yet — when it does, reconcile this shape first.
 */
export interface ProviderProfileDto {
  source: 'whatsapp';
  whatsappId: string;
  submittedAt: string;
  kyc: {
    fullName: string;
    idNumber: string;
    dateOfBirth: string;
    email: string;
    serviceArea: string;
    idDocumentMediaId: string | null;
    verificationStatus: 'self_declared';
  };
  offerings: Offering[];
}
