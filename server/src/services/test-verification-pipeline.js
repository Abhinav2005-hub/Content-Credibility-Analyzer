import { verifyClaimForAnalysis } from "./verificationPipeline.service.js";

const result = await verifyClaimForAnalysis(1, 2);

console.log(result);