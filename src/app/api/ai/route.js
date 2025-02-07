


// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export async function GET(req) {
//   const question = req.nextUrl.searchParams.get("question") || "What is AI?";
//   const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//   const result = await model.generateContent(question);
//   return Response.json({ answer: result.response.text() });
// }

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY; // Explicitly fetching API key

if (!API_KEY) {
  console.error("❌ ERROR: Google Gemini API key is missing. Set it in .env.local");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(req) {  
  try {
    const { question, language } = await req.json();
    console.log("🔹 AI Request Received:", { question, language });

    if (!question) {
      console.log("❌ Error: No question received!");
      return new Response(JSON.stringify({ error: "Question is required" }), { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = question;
    if (language === "hindi") {
      prompt = `Translate this response to Hindi: ${question}`;
    }

    const result = await model.generateContent(prompt);
    console.log("🔹 Raw API Response:", result);

    if (!result || !result.response || !result.response.candidates || result.response.candidates.length === 0) {
      console.error("❌ Error: Invalid Gemini API Response!");
      return new Response(JSON.stringify({ answer: "No response available." }), { status: 500 });
    }

    const answer = result.response.candidates[0].content.parts[0].text;
    console.log("✅ AI Answer Generated:", answer);
    return Response.json({ answer });

  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return new Response(JSON.stringify({ error: "Error generating response" }), { status: 500 });
  }
}


