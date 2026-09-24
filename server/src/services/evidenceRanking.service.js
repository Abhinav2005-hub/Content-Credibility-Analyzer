export function rankEvidence(claimText, evidenceList) {
    if (!claimText || !Array.isArray(evidenceList)) {
        throw new Error("Claim text and evidence list are required");
    }

    const claimWords = claimText
        .toLowerCase()
        .split(/\W+/)
        .filter(word => word.length > 2);

    const rankedEvidence = evidenceList.map((evidence) => {
        const evidenceText = evidence.text.toLowerCase();

        let score = 0;

        for (const word of claimWords) {
            if (evidenceText.includes(word)) {
                score++;
            }
        }

        return {
            ...evidence,
            relevanceScore: score
        };
    });

    return rankedEvidence.sort(
        (a, b) => b.relevanceScore - a.relevanceScore
    );
}