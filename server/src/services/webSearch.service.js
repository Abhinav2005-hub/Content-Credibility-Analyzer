import "dotenv/config";
import { tavily } from "@tavily/core";

const client = tavily({
    apiKey: process.env.TAVILY_API_KEY
});

export async function searchWeb(query) {
    if (!query || typeof query !== "string") {
        throw new Error("Search query is required");
    }

    const response = await client.search(query, {
        searchDepth: "basic",
        maxResults: 5
    });

    return response.results.map((result) => ({
        title: result.title,
        url: result.url,
        content: result.content
    }));
}