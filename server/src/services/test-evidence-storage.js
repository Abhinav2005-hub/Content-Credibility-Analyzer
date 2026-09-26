import { searchWeb } from "./webSearch.service.js";
import { saveSearchResults } from "./evidenceStorage.service.js";

const claimId = 1;

const results = await searchWeb(
    "India software industry growth"
);

const savedEvidence = await saveSearchResults(
    claimId,
    results
);

console.log(savedEvidence);