import { generateSearchQuery } from "./searchQuery.service.js";

const claim = "JavaScript was created in 1995";

const query = generateSearchQuery(claim);

console.log("Generated search query:", query);