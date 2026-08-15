// app/api/ai-search/route.ts
import { NextResponse } from 'next/server';
import { AmenitiesEnum } from '@/shared/enums/amenities.enums';
import { FeeTypeEnum } from '@/shared/enums/feeType.enums';
import { NigeriaStateEnum } from '@/shared/enums/nigeriaRegions.enums';
import { PaymentFrequencyEnum } from '@/shared/enums/paymentFreqency.enums';
import { structureType } from '@/shared/enums/structure.enum';

export async function POST(req: Request) {
  let userPrompt = '';

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key missing' },
        { status: 500 }
      );
    }

    const body = await req.json();
    userPrompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';

    if (!userPrompt) {
      return NextResponse.json({ error: 'Invalid search prompt' }, { status: 400 });
    }

    const validStates = Object.values(NigeriaStateEnum);
    const validPaymentFrequencies = Object.values(PaymentFrequencyEnum);
    const validAmenities = Object.values(AmenitiesEnum);
    const validPurposes = Object.values(FeeTypeEnum);
    const validStructureTypes = Object.values(structureType);

    const promptPayload = `
You are an intelligent real estate search reasoning engine for Conekta in Nigeria.
Your job is to analyze natural language queries, handle minor typos, extract explicit criteria, and map parameters for backend filtering.

### STRICT FIELD ALLOWLIST:
- **structure_type**: MUST be null or EXACTLY one of: [${validStructureTypes.join(', ')}]
- **state**: MUST be null or EXACTLY one of: [${validStates.join(', ')}]
- **payment_frequency**: MUST be null or EXACTLY one of: [${validPaymentFrequencies.join(', ')}]
- **purpose**: MUST be null or EXACTLY one of: [${validPurposes.join(', ')}]
- **amenities**: MUST be a single string matching one of: [${validAmenities.join(', ')}] or null.

### CRITICAL STRUCTURE RULES:
1. **structure_type Rules**:
   - ONLY set "structure_type" if the user EXPLICITLY mentions a matching structure name (e.g., "duplex", "triplex", "bungalow", "terrace") in their prompt.
   - NEVER guess or default to "structure_type" based on vague words like "family", "luxury", "cheap", or "modern".
   - If a structure type is explicitly mentioned, put it in "structure_type" and DO NOT duplicate it in "search".

2. **Search Keyword Extraction**:
   - Place general descriptive adjectives or unmapped search keywords (e.g. "luxury", "cheap", "modern", "furnished", "serviced") strictly into the "search" field.

3. **Location Mapping**:
   - Map states to allowed state enum values (e.g. "Lagos", "Abuja").
   - Place specific neighborhoods/areas (e.g. "Lekki", "Ikeja", "Yaba") into the "lga" field.

4. **Conversational Reply ("replyMessage")**:
   - Provide a concise summary of what was parsed.

User Query: "${userPrompt}"

Respond STRICTLY with valid JSON (no markdown fences, no code blocks) matching this schema:
{
  "replyMessage": "Friendly summary of what was parsed",
  "filters": {
    "search": null,
    "state": null,
    "lga": null,
    "structure_type": null,
    "purpose": null,
    "bedrooms": null,
    "bathrooms": null,
    "min_price": null,
    "max_price": null,
    "payment_frequency": null,
    "amenities": null
  }
}
`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/interactions?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-3.6-flash',
          input: promptPayload,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || 'Gemini API request failed');
    }

    const outputStep = data.steps?.find(
      (step: { type: string }) => step.type === 'model_output'
    );
    const rawText = outputStep?.content?.[0]?.text || '';

    const cleanedText = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    const parsedData = JSON.parse(cleanedText);

    // --- RUNTIME SAFETY SANITIZATION ---
    if (parsedData.filters) {
      // Always prevent legacy 'category' from slipping through
      delete (parsedData.filters as Record<string, unknown>).category;

      // Validate structure_type against structureType enum
      if (
        parsedData.filters.structure_type &&
        !validStructureTypes.includes(
          parsedData.filters.structure_type as structureType
        )
      ) {
        parsedData.filters.structure_type = null;
      }

      // Validate state against NigeriaStateEnum
      if (
        parsedData.filters.state &&
        !validStates.includes(parsedData.filters.state as NigeriaStateEnum)
      ) {
        parsedData.filters.state = null;
      }
    }

    return NextResponse.json(parsedData, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'AI parsing failed';
    console.error('❌ AI Route Execution Error:', errorMessage);

    return NextResponse.json(
      {
        error: errorMessage,
        replyMessage: `Searching listings for "${userPrompt}":`,
        filters: { search: userPrompt },
      },
      { status: 500 }
    );
  }
}