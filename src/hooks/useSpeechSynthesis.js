import { useCallback } from "react";

const useSpeechSynthesis = () => {
  const speak = useCallback((text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";      // Language: English
      utterance.rate = 1;            // Speed of speech
      utterance.pitch = 1;           // Tone of voice
      speechSynthesis.speak(utterance);
    } else {
      console.error("Speech Synthesis not supported in this browser.");
    }
  }, []);

  return { speak };
};

export default useSpeechSynthesis;
