import { searchWeb } from "./webSearch.service.js";

const results = await searchWeb(
    "India software industry growth"
);

console.log(results);