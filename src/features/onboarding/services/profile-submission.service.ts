import { ENV_KEYS, optionalEnv, requireEnv } from '@/core/constants';
import { ConversationSession } from '@/core/interfaces';
import { ProviderProfileDto } from '../dto';

export class ProfileSubmissionService {
  buildPayload(session: ConversationSession): ProviderProfileDto {
    const { kyc, extracted } = session;
    return {
      source: 'whatsapp',
      whatsappId: session.waId,
      submittedAt: new Date().toISOString(),
      kyc: {
        fullName: kyc.fullName!,
        idNumber: kyc.idNumber!,
        dateOfBirth: kyc.dateOfBirth!,
        email: kyc.email!,
        serviceArea: kyc.serviceArea!,
        idDocumentMediaId: kyc.idDocumentMediaId ?? null,
        verificationStatus: 'self_declared',
      },
      offerings: extracted?.offerings ?? [],
    };
  }

  /** Returns the registry's reference for the created profile. */
  async submit(session: ConversationSession): Promise<string> {
    const token = optionalEnv(ENV_KEYS.profileApiToken);

    const response = await fetch(requireEnv(ENV_KEYS.profileApiUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(this.buildPayload(session)),
    });

    if (!response.ok) {
      console.error(`[registry] submission failed ${response.status}: ${await response.text()}`);
      throw new Error('Registry rejected the profile');
    }

    const { reference } = (await response.json()) as { reference?: string };
    return reference ?? 'unknown';
  }
}
