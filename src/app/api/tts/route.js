// import * as sdk from "microsoft-cognitiveservices-speech-sdk";
// import { PassThrough } from "stream";

// export async function GET(req) {
//   // WARNING: Do not expose your keys
//   // WARNING: If you host publicly your project, add an authentication layer to limit the consumption of Azure resources

//   const speechConfig = sdk.SpeechConfig.fromSubscription(
//     process.env["SPEECH_KEY"],
//     process.env["SPEECH_REGION"]
//   );

//   // https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts
//   const teacher = req.nextUrl.searchParams.get("teacher") || "Nanami";
//   speechConfig.speechSynthesisVoiceName = `ja-JP-${teacher}Neural`;

//   const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
//   const visemes = [];
//   speechSynthesizer.visemeReceived = function (s, e) {
//     // console.log(
//     //   "(Viseme), Audio offset: " +
//     //     e.audioOffset / 10000 +
//     //     "ms. Viseme ID: " +
//     //     e.visemeId
//     // );
//     visemes.push([e.audioOffset / 10000, e.visemeId]);
//   };
//   const audioStream = await new Promise((resolve, reject) => {
//     speechSynthesizer.speakTextAsync(
//       req.nextUrl.searchParams.get("text") ||
//         "I'm excited to try text to speech",
//       (result) => {
//         const { audioData } = result;

//         speechSynthesizer.close();

//         // convert arrayBuffer to stream
//         const bufferStream = new PassThrough();
//         bufferStream.end(Buffer.from(audioData));
//         resolve(bufferStream);
//       },
//       (error) => {
//         console.log(error);
//         speechSynthesizer.close();
//         reject(error);
//       }
//     );
//   });
//   const response = new Response(audioStream, {
//     headers: {
//       "Content-Type": "audio/mpeg",
//       "Content-Disposition": `inline; filename=tts.mp3`,
//       Visemes: JSON.stringify(visemes),
//     },
//   });
//   // audioStream.pipe(response);
//   return response;
// }




// import { spawn } from "child_process";

// export async function GET(req) {
//   const text = req.nextUrl.searchParams.get("text") || "Hello!";
//   const apiKey = process.env.GEMINI_API_KEY;

//   return new Promise((resolve, reject) => {
//     const process = spawn("python", ["voice_assistant.py", text, apiKey]);

//     let output = "";
//     process.stdout.on("data", (data) => {
//       output += data.toString();
//     });

//     process.stderr.on("data", (error) => {
//       console.error(`Error: ${error}`);
//     });

//     process.on("close", (code) => {
//       if (code === 0) {
//         resolve(new Response(JSON.stringify({ message: output }), { status: 200 }));
//       } else {
//         reject(new Response(JSON.stringify({ error: "Voice assistant failed." }), { status: 500 }));
//       }
//     });
//   });
// }

import { spawn } from "child_process";

export async function POST(req) {  
  try {
    const { text, language } = await req.json();
    console.log("🔹 TTS Request Received:", { text, language });

    if (!text) {
      console.log("❌ Error: No text provided for TTS.");
      return new Response(JSON.stringify({ error: "Text is required" }), { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    return new Promise((resolve, reject) => {
      const process = spawn("python", ["voice_assistant.py", text, language, apiKey]);

      let output = "";
      process.stdout.on("data", (data) => {
        output += data.toString();
      });

      process.stderr.on("data", (error) => {
        console.error(`❌ TTS Error: ${error}`);
      });

      process.on("close", (code) => {
        if (code === 0) {
          console.log("✅ TTS Process Completed:", output.trim());
          resolve(new Response(JSON.stringify({ message: output.trim() }), { status: 200 }));
        } else {
          console.log("❌ TTS Process Failed.");
          reject(new Response(JSON.stringify({ error: "TTS processing failed" }), { status: 500 }));
        }
      });
    });

  } catch (error) {
    console.error("❌ TTS Processing Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

// ✅ Fix: Handle `GET` requests properly
export async function GET(req) {
  return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 });
}




