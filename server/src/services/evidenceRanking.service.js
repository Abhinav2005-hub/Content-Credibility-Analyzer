import { getSourceQuality } from "./sourceQuality.service.js";

export function rankEvidence(claimText, evidenceList) {
    if (!claimText || !Array.isArray(evidenceList)) {
        throw new Error("Claim text and evidence list are required");
    }

    const claimWords = claimText
        .toLowerCase()
        .split(/\W+/)
        .filter((word) => word.length > 2);

    const rankedEvidence = evidenceList.map((evidence) => {
        const evidenceText = evidence.text.toLowerCase();

        let matchedWords = 0;

        for (const word of claimWords) {
            if (evidenceText.includes(word)) {
                matchedWords++;
            }
        }

        const relevanceScore =
            claimWords.length > 0
                ? matchedWords / claimWords.length
                : 0;

        const sourceQuality = getSourceQuality(
            evidence.source?.domain
        );

        const finalScore =
            relevanceScore * 0.7 +
            sourceQuality * 0.3;

        return {
            ...evidence,
            relevanceScore: Number(relevanceScore.toFixed(2)),
            sourceQuality: Number(sourceQuality.toFixed(2)),
            finalScore: Number(finalScore.toFixed(2)),
            matchedWords
        };
    });

    return rankedEvidence.sort(
        (a, b) => b.finalScore - a.finalScore
    );
}

export function selectTopEvidence(rankedEvidence, limit = 3) {
    if (!Array.isArray(rankedEvidence)) {
        throw new Error("Ranked evidence must be an array");
    }

    if (limit <= 0) {
        throw new Error("Evidence limit must be greater than 0");
    }

    return rankedEvidence
        .filter((evidence) => evidence.relevanceScore > 0)
        .slice(0, limit);
}