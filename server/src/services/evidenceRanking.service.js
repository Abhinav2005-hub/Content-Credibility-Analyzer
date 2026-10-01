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

        return {
            ...evidence,
            relevanceScore: Number(relevanceScore.toFixed(2)),
            matchedWords
        };
    });

    return rankedEvidence.sort(
        (a, b) => b.relevanceScore - a.relevanceScore
    );
}