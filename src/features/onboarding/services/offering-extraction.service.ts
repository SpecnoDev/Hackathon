import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import { CLAUDE_MODEL, EXTRACTION_MAX_TOKENS } from '@/core/constants';
import { ExtractedOfferings } from '@/core/interfaces';

const OfferingSchema = z.object({
  title: z.string().describe('Short name for the service, e.g. "Geyser installation"'),
  category: z.string().describe('A single broad trade category, e.g. "Plumbing"'),
  description: z.string().describe("One sentence describing the service in the provider's own terms"),
  pricingModel: z.enum(['hourly', 'fixed', 'quote_on_request']),
  rateAmount: z.number().nullable().describe('Numeric rate if stated, otherwise null'),
  currency: z.string().describe('ISO currency code, default ZAR when unstated'),
  tags: z.array(z.string()),
});

const ExtractionSchema = z.object({
  offerings: z.array(OfferingSchema),
  clarifications: z
    .array(z.string())
    .describe('Questions to ask if pricing or scope is missing. Empty when the description is complete.'),
});

const SYSTEM_PROMPT = [
  'You structure informal service descriptions from South African service providers into catalogue entries.',
  'Split genuinely distinct services into separate offerings; do not invent services that were not mentioned.',
  'Never invent a price. If no rate is given, set rateAmount to null and pricingModel to quote_on_request.',
  "Default currency to ZAR. Keep descriptions in the provider's own register, lightly cleaned up.",
  'Raise a clarification only when a stated service is missing pricing or its scope is genuinely ambiguous.',
].join(' ');

export class OfferingExtractionService {
  private readonly client = new Anthropic();

  async extract(description: string): Promise<ExtractedOfferings> {
    const response = await this.client.messages.parse({
      model: CLAUDE_MODEL,
      max_tokens: EXTRACTION_MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: description }],
      output_config: { format: zodOutputFormat(ExtractionSchema), effort: 'low' },
    });

    if (!response.parsed_output) {
      throw new Error(`Extraction returned no parsed output (stop_reason: ${response.stop_reason})`);
    }

    return response.parsed_output;
  }
}
