import { retrieveEvidence } from "./evidenceRetrieval.service.js";

const evidence = await retrieveEvidence(1);

console.log(evidence);