import { verifyClaim } from "./llmVerification.service.js";

const claimText = "India has a large software industry.";

const rankedEvidence = [
    {
        id: 1,
        text: "India has a large software and IT industry.",
        relevanceScore: 4
    },
    {
        id: 2,
        text: "India has many historical monuments.",
        relevanceScore: 1
    }
];

const result = verifyClaim(
    claimText,
    rankedEvidence
);

console.log(result);