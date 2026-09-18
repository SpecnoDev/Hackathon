import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import { CLAUDE_MODEL, EXTRACTION_MAX_TOKENS } from '@/core/constants';
import { ExtractedOfferings } from '@/core/interfaces';

const OfferingSchema = z.object({
  title: z.string().describe('Short name a traveller would recognise, e.g. "Home-cooked lunch in Langa"'),
  category: z
    .enum(['TOUR', 'FOOD', 'TRANSPORT', 'ACCOMMODATION', 'CONCIERGE', 'SECURITY'])
    .describe('TOUR for walks, workshops, visits and stories. CONCIERGE when the host arranges access rather than hosting it.'),
  description: z.string().describe("One or two sentences a traveller would read, in the host's own voice"),
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
  'You turn what a South African host says about themselves into travel experiences a visitor can book.',
  'Hosts are local guides, drivers, home cooks, crafters and people who know who to call.',
  'Split genuinely different experiences into separate offerings; never invent one that was not mentioned.',
  'Never invent a price. If no rate is given, set rateAmount to null and pricingModel to quote_on_request.',
  'Default currency to ZAR. Write the description for a traveller deciding whether to book, keeping the',
  "host's own voice and any local words they used. Plain language, short sentences, no marketing copy.",
  'Raise a clarification only when an experience has no price, or its length or group size is genuinely unclear.',
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
