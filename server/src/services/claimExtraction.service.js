export function extractClaims(text) {
    if (!text || typeof text !== "string") {
        throw new Error("Content text is required");
    }

    const sentences = text
        .split(/[.!?]+/)
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 0);

    return sentences.map(sentence => ({
        text: sentence
    }));
}