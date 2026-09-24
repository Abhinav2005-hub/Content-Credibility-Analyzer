import prisma from "../config/database.js";

export async function retrieveEvidence(claimId) {
    if (!claimId) {
        throw new Error("Claim ID is required");
    }

    const claim = await prisma.claim.findUnique({
        where: {
            id: claimId
        }
    });

    if (!claim) {
        throw new Error("Claim not found");
    }

    const evidence = await prisma.evidence.findMany({
        where: {
            claimId
        },
        include: {
            source: true,
            claim: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return evidence;
}