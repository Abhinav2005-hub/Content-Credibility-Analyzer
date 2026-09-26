import prisma from "../config/database.js";

export async function saveSearchResults(claimId, results) {
    if (!claimId) {
        throw new Error("Claim ID is required");
    }

    if (!Array.isArray(results)) {
        throw new Error("Search results must be an array");
    }

    const claim = await prisma.claim.findUnique({
        where: {
            id: claimId
        }
    });

    if (!claim) {
        throw new Error("Claim not found");
    }

    const savedEvidence = [];

    for (const result of results) {
        if (!result.url || !result.content) {
            continue;
        }

        const source = await prisma.source.upsert({
            where: {
                url: result.url
            },
            update: {
                title: result.title
            },
            create: {
                title: result.title,
                url: result.url
            }
        });

        const evidence = await prisma.evidence.create({
            data: {
                claimId,
                sourceId: source.id,
                text: result.content
            },
            include: {
                source: true
            }
        });

        savedEvidence.push(evidence);
    }

    return savedEvidence;
}