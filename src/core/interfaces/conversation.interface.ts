export type OnboardingStage =
  | 'identify'
  | 'returning'
  | 'welcome'
  | 'kyc'
  | 'kyc_review'
  | 'offerings'
  | 'offerings_review'
  | 'submitting'
  | 'done';

export interface KycDraft {
  language?: string;
  documentType?: string;
  selfieMediaId?: string;
  offeringKind?: string;
  fullName?: string;
  idNumber?: string;
  dateOfBirth?: string;
  email?: string;
  serviceArea?: string;
  idDocumentMediaId?: string;
}

export interface Offering {
  title: string;
  category: string;
  description: string;
  pricingModel: 'hourly' | 'fixed' | 'quote_on_request';
  rateAmount: number | null;
  currency: string;
  tags: string[];
}

export interface ExtractedOfferings {
  offerings: Offering[];
  clarifications: string[];
}

export interface ConversationSession {
  waId: string;
  stage: OnboardingStage;
  stepIndex: number;
  displayName?: string;
  kyc: KycDraft;
  rawOfferingDescription?: string;
  extracted?: ExtractedOfferings;
  updatedAt: number;
}
