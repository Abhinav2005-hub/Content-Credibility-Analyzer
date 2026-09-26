import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const response = await client.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: "Reply with exactly: Gemini connection successful"
});

console.log(response.text);