import { extractClaims } from "./claimExtraction.service.js";

const text = `
India has a large population.
The country has many software companies.
The IT industry is growing rapidly.
`;

const claims = extractClaims(text);

console.log(claims);