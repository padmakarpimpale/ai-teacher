import { create } from "zustand";

export const teachers = ["Aishwarya", "Paddy"];

export const useAITeacher = create((set, get) => ({
  messages: [],
  currentMessage: null,
  teacher: teachers[0],
  setTeacher: (teacher) => set({ teacher }),
  classroom: "default",
  setClassroom: (classroom) => set({ classroom }),
  loading: false,
  error: null,
  hindi: false,
  english: true,
  sethindi: (hindi) => set({ hindi, english: !hindi }),
  setEnglish: (english) => set({ english, hindi: !english }),
  speech: "formal",
  setSpeech: (speech) => set({ speech }),

  askAI: async (question) => {
    const trimmed = question?.trim();
    if (!trimmed || get().loading) return;
    set({ loading: true, error: null });
    try {
      const language = get().hindi ? "hindi" : "english";
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, language, speech: get().speech }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not get an answer.");
      const message = { id: crypto.randomUUID(), question: trimmed, answer: data.answer, language };
      set((state) => ({ messages: [...state.messages, message], loading: false }));
      get().playMessage(message);
    } catch (error) {
      set({ loading: false, error: error.message || "Something went wrong." });
    }
  },

  playMessage: (message) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.answer);
    utterance.lang = message.language === "hindi" ? "hi-IN" : "en-US";
    utterance.rate = 1;
    utterance.onend = () => set({ currentMessage: null });
    utterance.onerror = () => set({ currentMessage: null });
    set({ currentMessage: message });
    window.speechSynthesis.speak(utterance);
  },
  stopMessage: () => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    set({ currentMessage: null });
  },
}));
