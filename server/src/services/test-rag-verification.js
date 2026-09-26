import { runRagVerification } from "./ragVerification.service.js";

const result = await runRagVerification(1, 2);

console.log(JSON.stringify(result, null, 2));