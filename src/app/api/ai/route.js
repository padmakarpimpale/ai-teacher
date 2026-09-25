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
  try {
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `You are a helpful tutor. Answer the student's question clearly in ${language}, using ${style}. Give a short explanation and a simple example when helpful.\n\nQuestion: ${question}` }] }],
        generationConfig: { maxOutputTokens: 700 },
      }),
      cache: "no-store",
    });
    if (!upstream.ok) {
      const detail = await upstream.text();
      console.error("Gemini failed", upstream.status, detail);
      const reason = upstream.status === 429 ? "The Gemini quota is exhausted. Try again later or check billing." :
        upstream.status === 404 ? `The configured Gemini model (${model}) is unavailable for this key.` :
        upstream.status === 400 || upstream.status === 401 || upstream.status === 403 ? "Gemini rejected the API key or model access. Check the Vercel key and model settings." :
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
