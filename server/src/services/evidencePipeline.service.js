import { retrieveEvidence } from "./evidenceRetrieval.service.js";
import { rankEvidence } from "./evidenceRanking.service.js";

export async function getRankedEvidence(claimId) {
    if (!claimId) {
        throw new Error("Claim ID is required");
    }

    const evidence = await retrieveEvidence(claimId);

    if (evidence.length === 0) {
        return [];
    }

    const claimText = evidence[0].claim?.text;

    if (!claimText) {
        throw new Error("Claim text not available");
    }

    const rankedEvidence = rankEvidence(
        claimText,
        evidence
    );

    return rankedEvidence;
}