import { getSourceQuality } from "./sourceQuality.service.js";

console.log("NASA:", getSourceQuality("nasa.gov"));
console.log("NIH:", getSourceQuality("nih.gov"));
console.log("Example:", getSourceQuality("example.com"));
console.log("Unknown:", getSourceQuality(null));