// geminiClient.js
import axios from 'axios';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export async function askGemini(question) {
  const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${GEMINI_API_KEY}`;

  const data = {
    prompt: {
      text: question,
    },
    temperature: 0.7,
    maxOutputTokens: 500,
  };

  try {
    const response = await axios.post(url, data);
    return response.data.candidates[0].output;
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    throw error;
  }
}
