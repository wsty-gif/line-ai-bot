import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro-latest" });

const result = await model.generateContent("こんにちは");
const text = result.response.text();
console.log(text);
