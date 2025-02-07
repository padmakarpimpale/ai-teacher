// const { create } = require("zustand");

// export const teachers = ["Nanami", "Naoki"];

// export const useAITeacher = create((set, get) => ({
//   messages: [],
//   currentMessage: null,
//   teacher: teachers[0],
//   setTeacher: (teacher) => {
//     set(() => ({
//       teacher,
//       messages: get().messages.map((message) => {
//         message.audioPlayer = null; // New teacher, new Voice
//         return message;
//       }),
//     }));
//   },
//   classroom: "default",
//   setClassroom: (classroom) => {
//     set(() => ({
//       classroom,
//     }));
//   },
//   loading: false,
//   hindi: true,
//   sethindi: (hindi) => {
//     set(() => ({
//       hindi,
//     }));
//   },
//   english: true,
//   setEnglish: (english) => {
//     set(() => ({
//       english,
//     }));
//   },
//   speech: "formal",
//   setSpeech: (speech) => {
//     set(() => ({
//       speech,
//     }));
//   },
//   askAI: async (question) => {
//     if (!question) {
//       return;
//     }
//     const message = {
//       question,
//       id: get().messages.length,
//     };
//     set(() => ({
//       loading: true,
//     }));

//     const speech = get().speech;

//     // Ask AI
//     const res = await fetch(`/api/ai?question=${question}&speech=${speech}`);
//     const data = await res.json();
//     message.answer = data;
//     message.speech = speech;

//     set(() => ({
//       currentMessage: message,
//     }));

//     set((state) => ({
//       messages: [...state.messages, message],
//       loading: false,
//     }));
//     get().playMessage(message);
//   },
//   playMessage: async (message) => {
//     set(() => ({
//       currentMessage: message,
//     }));

//     if (!message.audioPlayer) {
//       set(() => ({
//         loading: true,
//       }));
//       // Get TTS
//       const audioRes = await fetch(
//         `/api/tts?teacher=${get().teacher}&text=${message.answer.japanese
//           .map((word) => word.word)
//           .join(" ")}`
//       );
//       const audio = await audioRes.blob();
//       const visemes = JSON.parse(await audioRes.headers.get("visemes"));
//       const audioUrl = URL.createObjectURL(audio);
//       const audioPlayer = new Audio(audioUrl);

//       message.visemes = visemes;
//       message.audioPlayer = audioPlayer;
//       message.audioPlayer.onended = () => {
//         set(() => ({
//           currentMessage: null,
//         }));
//       };
//       set(() => ({
//         loading: false,
//         messages: get().messages.map((m) => {
//           if (m.id === message.id) {
//             return message;
//           }
//           return m;
//         }),
//       }));
//     }

//     message.audioPlayer.currentTime = 0;
//     message.audioPlayer.play();
//   },
//   stopMessage: (message) => {
//     message.audioPlayer.pause();
//     set(() => ({
//       currentMessage: null,
//     }));
//   },
// }));


// const { create } = require("zustand");

// export const teachers = ["Nanami", "Naoki"];

// export const useAITeacher = create((set, get) => ({
//   messages: [],
//   currentMessage: null,
//   teacher: teachers[0],
//   setTeacher: (teacher) => {
//     set(() => ({
//       teacher,
//       messages: get().messages.map((message) => {
//         message.audioPlayer = null; // New teacher, new Voice
//         return message;
//       }),
//     }));
//   },
//   classroom: "default",
//   setClassroom: (classroom) => {
//     set(() => ({
//       classroom,
//     }));
//   },
//   loading: false,
//   hindi: true,
//   sethindi: (hindi) => {
//     set(() => ({
//       hindi,
//     }));
//   },
//   english: true,
//   setEnglish: (english) => {
//     set(() => ({
//       english,
//     }));
//   },
//   speech: "formal",
//   setSpeech: (speech) => {
//     set(() => ({
//       speech,
//     }));
//   },

//   // ================== ASK AI ==================
//   askAI: async (question) => {
//     if (!question) return;

//     const message = {
//       question,
//       id: get().messages.length,
//     };

//     set(() => ({ loading: true }));

//     const speech = get().speech;

//     // Ask AI
//     const res = await fetch(`/api/ai?question=${question}&speech=${speech}`);
//     const data = await res.json();
//     message.answer = data;
//     message.speech = speech;

//     set(() => ({
//       currentMessage: message,
//       messages: [...get().messages, message],
//       loading: false,
//     }));

//     get().playMessage(message);
//   },

//   // ================== PLAY MESSAGE ==================
//   playMessage: async (message) => {
//     set(() => ({
//       currentMessage: message,
//     }));

//     // Check if message is in English or Japanese
//     const isEnglish = get().english;

//     if (isEnglish) {
//       // ======= New English TTS with Web Speech API =======
//       const synth = window.speechSynthesis;
//       const utterance = new SpeechSynthesisUtterance(message.answer.english);
//       utterance.lang = "en-US";
//       utterance.rate = 1;

//       utterance.onend = () => {
//         set(() => ({
//           currentMessage: null,
//         }));
//       };

//       synth.speak(utterance);
//       message.audioPlayer = synth; // Store the synth object to stop later
//     } else {
//       // ======= Existing Japanese TTS =======
//       if (!message.audioPlayer) {
//         set(() => ({
//           loading: true,
//         }));

//         const audioRes = await fetch(
//           `/api/tts?teacher=${get().teacher}&text=${message.answer.japanese
//             .map((word) => word.word)
//             .join(" ")}`
//         );

//         const audio = await audioRes.blob();
//         const visemes = JSON.parse(await audioRes.headers.get("visemes"));
//         const audioUrl = URL.createObjectURL(audio);
//         const audioPlayer = new Audio(audioUrl);

//         message.visemes = visemes;
//         message.audioPlayer = audioPlayer;

//         message.audioPlayer.onended = () => {
//           set(() => ({
//             currentMessage: null,
//           }));
//         };

//         set(() => ({
//           loading: false,
//           messages: get().messages.map((m) =>
//             m.id === message.id ? message : m
//           ),
//         }));
//       }

//       message.audioPlayer.currentTime = 0;
//       message.audioPlayer.play();
//     }
//   },

//   // ================== STOP MESSAGE ==================
//   stopMessage: (message) => {
//     if (message.audioPlayer instanceof Audio) {
//       message.audioPlayer.pause();
//     } else if (window.speechSynthesis && message.audioPlayer) {
//       window.speechSynthesis.cancel(); // Stop Web Speech API
//     }
//     set(() => ({
//       currentMessage: null,
//     }));
//   },
// }));




const { create } = require("zustand");

export const teachers = ["Aishwarya", "paddy"];

export const useAITeacher = create((set, get) => ({
  messages: [],
  currentMessage: null,
  teacher: teachers[0],

  setTeacher: (teacher) => {
    set(() => ({
      teacher,
      messages: get().messages.map((message) => {
        message.audioPlayer = null; // New teacher, new Voice
        return message;
      }),
    }));
  },

  classroom: "default",
  setClassroom: (classroom) => set(() => ({ classroom })),

  loading: false,
  hindi: true,
  sethindi: (hindi) => set(() => ({ hindi })),

  english: true,
  setEnglish: (english) => set(() => ({ english })),

  speech: "formal",
  setSpeech: (speech) => set(() => ({ speech })),

  // ================== ASK AI ==================
  askAI: async (question) => {
    if (!question) return;

    console.log("🔹 Sending AI Request:", question);

    const message = { question, id: get().messages.length };
    set(() => ({ loading: true }));

    try {
        const language = get().hindi ? "hindi" : "english";

        const res = await fetch("/api/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, language }),
        });

        if (!res.ok) {
            throw new Error(`❌ API Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log("🔹 AI Response Received:", data);

        // ✅ Fix: Ensure the answer is correctly set
        message.answer = data?.answer || "No response available.";
        message.language = language;

        set((state) => ({
            messages: [...state.messages, message],  // ✅ Ensuring state update
            currentMessage: message,
            loading: false,
        }));

        console.log("✅ State Updated with AI Response:", message);

        get().playMessage(message);
    } catch (error) {
        console.error("❌ Error in askAI:", error);
        set(() => ({ loading: false }));
    }
},


  // ================== PLAY MESSAGE ==================
  // playMessage: async (message) => {
  //   set(() => ({ currentMessage: message }));

  //   const isEnglish = get().english;

  //   try {
  //     if (isEnglish) {
  //       // ======= English TTS with Web Speech API =======
  //       const synth = window.speechSynthesis;
  //       const utterance = new SpeechSynthesisUtterance(message.answer.english || "No response available.");
  //       utterance.lang = "en-US";
  //       utterance.rate = 1;

  //       utterance.onend = () => {
  //         set(() => ({ currentMessage: null }));
  //       };

  //       synth.speak(utterance);
  //       message.audioPlayer = synth;
  //     } else {
  //       // ======= Japanese TTS (or Fallback) =======
  //       if (!message.audioPlayer) {
  //         set(() => ({ loading: true }));

  //         const textToSpeak = message.answer?.japanese
  //           ? message.answer.japanese.map((word) => word.word).join(" ")
  //           : message.answer?.english || "No text available.";

  //         const audioRes = await fetch(`/api/tts?teacher=${get().teacher}&text=${encodeURIComponent(textToSpeak)}`);
  //         const audio = await audioRes.blob();
  //         const visemes = JSON.parse(await audioRes.headers.get("visemes") || "[]");

  //         const audioUrl = URL.createObjectURL(audio);
  //         const audioPlayer = new Audio(audioUrl);

  //         message.visemes = visemes;
  //         message.audioPlayer = audioPlayer;

  //         message.audioPlayer.onended = () => {
  //           set(() => ({ currentMessage: null }));
  //         };

  //         set(() => ({
  //           loading: false,
  //           messages: get().messages.map((m) => (m.id === message.id ? message : m)),
  //         }));
  //       }

  //       message.audioPlayer.currentTime = 0;
  //       message.audioPlayer.play();
  //     }
  //   } catch (error) {
  //     console.error("Error in playMessage:", error);
  //     set(() => ({ loading: false, currentMessage: null }));
  //   }
  // },

//   playMessage: async (message) => {
//     set(() => ({ currentMessage: message }));

//     const isEnglish = get().english;
//     const isHindi = get().hindi;  // ✅ Fix: Check if Hindi is selected

//     try {
//         // ======= English TTS with Web Speech API =======
//         if (isEnglish) {
//             const synth = window.speechSynthesis;

//             // ✅ Fix: Use message.answer directly since it is a string now
//             const textToSpeak = typeof message.answer === "string" && message.answer.trim() !== "" 
//                 ? message.answer 
//                 : "No response available.";

//             console.log("🔹 English TTS Speaking:", textToSpeak);

//             const utterance = new SpeechSynthesisUtterance(textToSpeak);
//             utterance.lang = "en-US";
//             utterance.rate = 1;

//             utterance.onend = () => {
//                 set(() => ({ currentMessage: null }));
//             };

//             synth.speak(utterance);
//             message.audioPlayer = synth;
//         } 
//         // ======= Hindi TTS Using API Call =======
//            else if (isHindi) {
//             // ✅ Hindi TTS using Backend API
//             set(() => ({ loading: true }));

//             const textToSpeak = message.answer || "कोई उत्तर उपलब्ध नहीं है।";

//             console.log("🔹 Hindi TTS Request:", textToSpeak);

//             const audioRes = await fetch("/api/tts", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ text: textToSpeak, language: "hindi" }),
//             });

//             if (!audioRes.ok) {
//                 throw new Error(`❌ Hindi TTS API Error: ${audioRes.status} ${audioRes.statusText}`);
//             }

//             const audioBlob = await audioRes.blob();
//             const audioUrl = URL.createObjectURL(audioBlob);
//             const audioPlayer = new Audio(audioUrl);

//             message.audioPlayer = audioPlayer;
//             message.audioPlayer.onended = () => {
//                 set(() => ({ currentMessage: null }));
//             };

//             set(() => ({
//                 loading: false,
//                 messages: get().messages.map((m) => (m.id === message.id ? message : m)),
//             }));

//             console.log("✅ Hindi Speech Playing:", textToSpeak);

//             message.audioPlayer.currentTime = 0;
//             message.audioPlayer.play();
//         }
//     } catch (error) {
//         console.error("❌ Error in playMessage:", error);
//         set(() => ({ loading: false, currentMessage: null }));
//     }
// },
//         else if (isHindi) {
//             if (!message.audioPlayer) {
//                 set(() => ({ loading: true }));

//                 const textToSpeak = typeof message.answer === "string" && message.answer.trim() !== "" 
//                     ? message.answer 
//                     : "No text available.";

//                 console.log("🔹 Hindi TTS Request:", textToSpeak);

//                 // ✅ Fix: Use POST request to `/api/tts`
//                 const audioRes = await fetch("/api/tts", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ text: textToSpeak, language: "hindi" }),
//                 });

//                 if (!audioRes.ok) {
//                     throw new Error(`❌ TTS API Error: ${audioRes.status} ${audioRes.statusText}`);
//                 }

//                 const audioBlob = await audioRes.blob();
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 const audioPlayer = new Audio(audioUrl);

//                 message.audioPlayer = audioPlayer;
//                 message.audioPlayer.onended = () => {
//                     set(() => ({ currentMessage: null }));
//                 };

//                 set(() => ({
//                     loading: false,
//                     messages: get().messages.map((m) => (m.id === message.id ? message : m)),
//                 }));

//                 console.log("✅ Hindi Speech Playing:", textToSpeak);
//             }

//             message.audioPlayer.currentTime = 0;
//             message.audioPlayer.play();
//         }
//     } catch (error) {
//         console.error("❌ Error in playMessage:", error);
//         set(() => ({ loading: false, currentMessage: null }));
//     }
// },
 
playMessage: async (message) => {
  set(() => ({ currentMessage: message }));

  const isEnglish = get().english;
  const isHindi = get().hindi;

  try {
      if (isEnglish) {
          // ✅ English TTS using Web Speech API
          const synth = window.speechSynthesis;
          const textToSpeak = message.answer || "No response available.";

          console.log("🔹 English TTS Speaking:", textToSpeak);

          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.lang = "en-US";
          utterance.rate = 1;

          utterance.onend = () => {
              set(() => ({ currentMessage: null }));
          };

          synth.speak(utterance);
          message.audioPlayer = synth;
      } 
      else if (isHindi) {
          // ✅ Hindi TTS using Backend API
          set(() => ({ loading: true }));

          const textToSpeak = message.answer || "कोई उत्तर उपलब्ध नहीं है।";

          console.log("🔹 Hindi TTS Request:", textToSpeak);

          // ✅ Fix: Use POST request to `/api/tts`
          const audioRes = await fetch("/api/tts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: textToSpeak, language: "hindi" }),
          });

          if (!audioRes.ok) {
              throw new Error(`❌ Hindi TTS API Error: ${audioRes.status} ${audioRes.statusText}`);
          }

          const audioBlob = await audioRes.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audioPlayer = new Audio(audioUrl);

          message.audioPlayer = audioPlayer;
          message.audioPlayer.onended = () => {
              set(() => ({ currentMessage: null }));
          };

          set(() => ({
              loading: false,
              messages: get().messages.map((m) => (m.id === message.id ? message : m)),
          }));

          console.log("✅ Hindi Speech Playing:", textToSpeak);

          message.audioPlayer.currentTime = 0;
          message.audioPlayer.play();
      }
  } catch (error) {
      console.error("❌ Error in playMessage:", error);
      set(() => ({ loading: false, currentMessage: null }));
  }
},

  // ================== STOP MESSAGE ==================
  stopMessage: (message) => {
    try {
      if (message.audioPlayer instanceof Audio) {
        message.audioPlayer.pause();
      } else if (window.speechSynthesis && message.audioPlayer) {
        window.speechSynthesis.cancel();
      }

      set(() => ({ currentMessage: null }));
    } catch (error) {
      console.error("Error in stopMessage:", error);
    }
  },
}));
