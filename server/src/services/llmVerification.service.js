export function verifyClaim(claimText, rankedEvidence) {
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

    const topEvidence = rankedEvidence[0];

    if (topEvidence.relevanceScore > 0) {
        return {
            assessment: "supported",
            explanation: `The available evidence is relevant to the claim: "${topEvidence.text}"`,
            confidence: "medium"
        };
    }

    return {
        assessment: "insufficient_evidence",
        explanation: "The available evidence does not provide enough information to verify the claim.",
        confidence: "low"
    };
}