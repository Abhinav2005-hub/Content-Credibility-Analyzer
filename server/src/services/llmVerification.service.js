import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export async function verifyClaim(claimText, rankedEvidence) {
    if (!claimText) {
        throw new Error("Claim text is required");
    }

    if (!Array.isArray(rankedEvidence)) {
        throw new Error("Ranked evidence must be an array");
    }

    if (rankedEvidence.length === 0) {
        return {
            assessment: "insufficient_evidence",
            explanation: "No evidence was available to verify this claim.",
            confidence: "low"
        };
    }

    const evidenceText = rankedEvidence
        .slice(0, 5)
        .map((evidence, index) => {
            return `Evidence ${index + 1}:
${evidence.text}
Source: ${evidence.source?.url ?? "Unknown"}`;
        })
        .join("\n\n");

    const prompt = `
You are a content verification assistant.

Your task is to evaluate a claim using ONLY the evidence provided below.

Claim:
${claimText}

Evidence:
${evidenceText}

Return your assessment using these rules:

- "supported" if the evidence supports the claim.
- "contradicted" if the evidence conflicts with the claim.
- "insufficient_evidence" if the evidence is not enough to determine whether the claim is true.

Also provide:
- a short explanation based only on the evidence
- a confidence level: "low", "medium", or "high"

Do not invent facts or evidence.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    assessment: {
                        type: "string",
                        enum: [
                            "supported",
                            "contradicted",
                            "insufficient_evidence"
                        ]
                    },
                    explanation: {
                        type: "string"
                    },
                    confidence: {
                        type: "string",
                        enum: [
                            "low",
                            "medium",
                            "high"
                        ]
                    }
                },
                required: [
                    "assessment",
                    "explanation",
                    "confidence"
                ]
            }
        }
    });

    return JSON.parse(response.text);
}