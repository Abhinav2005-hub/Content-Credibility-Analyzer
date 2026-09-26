import { verifyClaim } from "./llmVerification.service.js";

const claimText =
    "India has a large software and IT industry.";

const rankedEvidence = [
    {
        id: 1,
        text: "India has a large software and IT industry.",
        relevanceScore: 5,
        source: {
            url: "https://example.com/source"
        }
    },
    {
        id: 2,
        text: "India has many historical monuments.",
        relevanceScore: 1,
        source: {
            url: "https://example.com/other-source"
        }
    }
];

const result = await verifyClaim(
    claimText,
    rankedEvidence
);

console.log(result);