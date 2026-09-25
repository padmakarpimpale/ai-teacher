# AI Tutor

An interactive 3D tutor built with Next.js, React Three Fiber and Gemini. Ask a question in English or Hindi, view the response on the classroom board, and play it with your browser's speech synthesis. Choose between two teacher avatars, classroom scenes, and formal or casual answers. Browsers without WebGL receive a usable text view.

**Live site:** https://aiteacher-eight.vercel.app/

## Run locally

Requirements: Node.js 20 or newer, npm, and a [Gemini API key](https://aistudio.google.com/app/apikey).

```bash
git clone https://github.com/padmakarpimpale/ai-teacher.git
cd ai-teacher
npm ci
```

Create `.env.local` in the project root:

```dotenv
GEMINI_API_KEY=your_api_key_here
# Optional if your key has access to a different supported model:
# GEMINI_MODEL=gemini-3.8-flash
```

Then run `npm run dev` and visit http://localhost:3000. Run `npm run build` to check a production build. The API key must stay server-side; never use a `NEXT_PUBLIC_` prefix or commit `.env.local`.

## Deploy to Vercel

Import this GitHub repository into Vercel as a Next.js project. In **Project Settings → Environment Variables**, add `GEMINI_API_KEY` for Production and Preview, then redeploy. The default model is `gemini-3.8-flash`. If your Gemini key cannot access it, set `GEMINI_MODEL` to a model available to your key and redeploy. Check available models in the [official Gemini documentation](https://ai.google.dev/gemini-api/docs/models).

The question endpoint is `POST /api/ai` with JSON `{ "question": "Explain gravity", "language": "english", "speech": "formal" }`. It returns `{ "answer": "..." }` on success, or `{ "error": "..." }` with a non-200 status on failure. A simple deployment check:

```bash
curl -X POST https://aiteacher-eight.vercel.app/api/ai \
  -H 'Content-Type: application/json' \
  -d '{"question":"What is gravity?","language":"english"}'
```

## How it works

The Next.js route calls Gemini from the server, keeping the API key out of the browser. Zustand manages the selected teacher, classroom, language, loading state, and messages. React Three Fiber renders the scene. Speech uses the browser's Web Speech API, so spoken voices and Hindi support depend on the visitor's browser and installed voices. The speech is approximate and does not drive accurate lip sync.

## Troubleshooting

- **The page loads, but questions fail:** Confirm the Vercel environment variable name is exactly `GEMINI_API_KEY`, redeploy after changes, and inspect function logs for model access or quota errors.
- **No speech:** Check device volume and browser speech support; try the play button after an answer. Hindi voice availability depends on the operating system.
- **3D scene does not appear:** The text view remains usable when WebGL is disabled. Try a browser with WebGL enabled for the 3D classroom. The large GLB scene assets may load slowly on weaker connections.

This is a prototype. It has no authentication or per-user rate limits; add both before sharing broadly with a paid API key.
