export function extractClaims(text) {
    if (!text || typeof text !== "string") {
        throw new Error("Content text is required");
    }

    const sentences = text
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter(Boolean);

    const claims = sentences.filter((sentence) => {
        if (sentence.length < 20) {
            return false;
        }

        if (sentence.endsWith("?")) {
            return false;
        }

        return true;
    });

    return claims.map((sentence) => ({
        text: sentence.replace(/[.!?]+$/, "")
    }));
}