import prisma from "../config/database.js";
import { retrieveEvidence } from "./evidenceRetrieval.service.js";
import { rankEvidence } from "./evidenceRanking.service.js";
import { verifyClaim } from "./llmVerification.service.js";

export async function verifyClaimForAnalysis(analysisId, claimId) {
    if (!analysisId || !claimId) {
        throw new Error("Analysis ID and Claim ID are required");
    }

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