import { runRagVerification } from "./ragVerification.service.js";

const result = await runRagVerification(4, 4);

console.log(JSON.stringify(result, null, 2));