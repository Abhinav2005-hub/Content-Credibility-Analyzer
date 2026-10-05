const HIGH_TRUST_DOMAINS = [
    "gov",
    "edu",
    "who.int",
    "nih.gov",
    "cdc.gov",
    "nasa.gov"
];

export function getSourceQuality(domain) {
    if (!domain || typeof domain !== "string") {
        return 0.3;
    }

    const normalizedDomain = domain.toLowerCase();

    if (
        HIGH_TRUST_DOMAINS.some(
            (trustedDomain) =>
                normalizedDomain === trustedDomain ||
                normalizedDomain.endsWith(`.${trustedDomain}`)
        )
    ) {
        return 1.0;
    }

    return 0.5;
}