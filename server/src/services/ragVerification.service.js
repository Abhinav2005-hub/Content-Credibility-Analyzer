import prisma from "../config/database.js";
import { searchWeb } from "./webSearch.service.js";
import { saveSearchResults } from "./evidenceStorage.service.js";
import { retrieveEvidence } from "./evidenceRetrieval.service.js";
import { rankEvidence } from "./evidenceRanking.service.js";
import { verifyClaim } from "./llmVerification.service.js";

export async function runRagVerification(analysisId, claimId) {

    const analysis = await prisma.analysis.findUnique({
        where: {
            id: analysisId
        }
    });

    if (!analysis) {
        throw new Error("Analysis not found");
    }

    const claim = await prisma.claim.findFirst({
        where: {
            id: claimId,
            contentId: analysis.contentId
        }
    });

    if (!claim) {
        throw new Error("Claim not found for this analysis");
    }

    const searchResults = await searchWeb(claim.text);

    await saveSearchResults(
        claimId,
        searchResults
    );

    const evidence = await retrieveEvidence(claimId);

    const rankedEvidence = rankEvidence(
        claim.text,
        evidence
    );

    const verification = await verifyClaim(
        claim.text,
        rankedEvidence
    );

    const result = await prisma.verificationResult.create({
        data: {
            analysisId,
            claimId,
            assessment: verification.assessment,
            explanation: verification.explanation,
            confidence: verification.confidence
        }
    });

    return {
        result,
        evidence: rankedEvidence
    };
}