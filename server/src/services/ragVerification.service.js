import prisma from "../config/database.js";
import { searchWeb } from "./webSearch.service.js";
import { saveSearchResults } from "./evidenceStorage.service.js";
import { retrieveEvidence } from "./evidenceRetrieval.service.js";
import { rankEvidence, selectTopEvidence } from "./evidenceRanking.service.js";
import { verifyClaim } from "./llmVerification.service.js";
import { generateSearchQuery } from "./searchQuery.service.js";

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

    const searchQuery = generateSearchQuery(claim.text);

    const searchResults = await searchWeb(searchQuery);
    
    await saveSearchResults(
        claimId,
        searchResults,
        searchQuery
    );

    const evidence = await retrieveEvidence(claimId);

    const rankedEvidence = rankEvidence(
        claim.text,
        evidence
    );
    
    const selectedEvidence = selectTopEvidence(
        rankedEvidence,
        3
    );
    
    const verification = await verifyClaim(
        claim.text,
        selectedEvidence
    );

    const result = await prisma.verificationResult.upsert({
        where: {
            analysisId_claimId: {
                analysisId,
                claimId
            }
        },
        update: {
            assessment: verification.assessment,
            explanation: verification.explanation,
            confidence: verification.confidence
        },
        create: {
            analysisId,
            claimId,
            assessment: verification.assessment,
            explanation: verification.explanation,
            confidence: verification.confidence
        }
    });

    return {
        result,
        evidence: selectedEvidence
    };
}