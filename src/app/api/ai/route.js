export const runtime = "nodejs";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question || question.length > 2000) {
    return Response.json({ error: "Enter a question under 2,000 characters." }, { status: 400 });
  }
  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: "AI service is not configured. Add GEMINI_API_KEY to Vercel." }, { status: 503 });
  }

  const language = body.language === "hindi" ? "Hindi" : "English";
  const style = body.speech === "casual" ? "a friendly, conversational tone" : "a clear, professional tone";
  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const teachingGuide = `You are a patient classroom teacher. Reply in ${language} in ${style}.
Answer the student's actual question first. Keep the lesson focused: a simple fact or arithmetic question needs only 1–2 sentences; a formula question can use about 100–160 words. Use short paragraphs and headings only when useful. Do not add unrelated facts, repeated explanations, or a generic introduction.
Use Markdown for headings and steps. For mathematical expressions, write valid LaTeX in $...$ for inline math. For displayed formulas, put $$ alone on one line, the formula on the next line, and $$ alone on the following line. Never show raw LaTeX commands outside math delimiters, and never put formulas in code fences.
For a formula question: first explain what each symbol means, then show the textbook formula as a displayed equation, then give one small worked example with the numbers substituted into a displayed equation and the final answer with correct units. Check arithmetic and distinguish length from area. If required values are missing, explain the method and label the example as an example. For non-math questions, use formulas only if needed.`;
  try {
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: teachingGuide }] },
        contents: [{ role: "user", parts: [{ text: question }] }],
        generationConfig: { maxOutputTokens: 650, temperature: 0.3 },
      }),
      cache: "no-store",
    });
    if (!upstream.ok) {
      const detail = await upstream.text();
      console.error("Gemini failed", upstream.status, detail);
      const invalidKey = /API_KEY_INVALID|API key not valid|API key expired|API key was reported as leaked|API key has been revoked/i.test(detail);
      const restrictedKey = /API_KEY_SERVICE_BLOCKED|API key not allowed|API has not been used|API is disabled/i.test(detail);
      const reason = invalidKey ? "The Gemini API key in Vercel is invalid, expired, or revoked. Replace it and redeploy." :
        restrictedKey ? "The Gemini API key is restricted from this service. Check its API restrictions." :
        upstream.status === 429 ? "The Gemini quota is exhausted. Try again later or check billing." :
        upstream.status === 404 ? `The configured Gemini model (${model}) is unavailable for this key.` :
        upstream.status === 400 || upstream.status === 401 || upstream.status === 403 ? `Gemini rejected the request (HTTP ${upstream.status}). Check the API key and model access in Vercel.` :
        `Gemini returned HTTP ${upstream.status}. Check the Vercel function logs.`;
      return Response.json({ error: reason }, { status: 502 });
    }
    const data = await upstream.json();
    const answer = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
    if (!answer) return Response.json({ error: "No answer was returned. Try another question." }, { status: 502 });
    return Response.json({ answer });
  } catch (error) {
    console.error("Gemini connection error", error);
    return Response.json({ error: "Could not connect to AI service." }, { status: 502 });
  }
}
