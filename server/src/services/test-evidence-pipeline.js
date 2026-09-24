import { getRankedEvidence } from "./evidencePipeline.service.js";

const rankedEvidence = await getRankedEvidence(1);

console.log(rankedEvidence);