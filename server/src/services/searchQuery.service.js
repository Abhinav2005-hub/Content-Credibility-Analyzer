export function generateSearchQuery(claimText) {
    if (!claimText || typeof claimText !== "string") {
        throw new Error("Claim text is required");
    }

    return `"${claimText.trim()}"`;
}