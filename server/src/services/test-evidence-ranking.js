import { rankEvidence } from "./evidenceRanking.service.js";

const claimText = "India has a large software industry.";

const evidenceList = [
    {
        id: 1,
        text: "India has a large software and IT industry."
    },
    {
        id: 2,
        text: "India has many historical monuments."
    },
    {
        id: 3,
        text: "India's software sector employs millions of people."
    }
];

const rankedEvidence = rankEvidence(
    claimText,
    evidenceList
);

console.log(rankedEvidence);