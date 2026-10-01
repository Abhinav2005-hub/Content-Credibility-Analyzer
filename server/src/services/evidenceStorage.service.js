import prisma from "../config/database.js";

function extractDomain(url) {
    try {
        const hostname = new URL(url).hostname;

        return hostname.replace(/^www\./, "");
    } catch (error) {
        return null;
    }
}

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

        const domain = extractDomain(result.url);

        const source = await prisma.source.upsert({
            where: {
                url: result.url
            },
            update: {
                title: result.title,
                domain
            },
            create: {
                title: result.title,
                url: result.url,
                domain
            }
        });
        
        const existingEvidence = await prisma.evidence.findFirst({
            where: {
                claimId,
                sourceId: source.id,
                text: result.content
            },
            include: {
                source: true
            }
        });

        if (existingEvidence) {
            savedEvidence.push(existingEvidence);
            continue;
        }

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