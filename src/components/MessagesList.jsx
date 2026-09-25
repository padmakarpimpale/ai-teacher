import { useAITeacher } from "@/hooks/useAITeacher";
import { useEffect, useRef } from "react";
import { TutorAnswer } from "./TutorAnswer";

export const MessagesList = () => {
  const messages = useAITeacher((state) => state.messages);
  const currentMessage = useAITeacher((state) => state.currentMessage);
  const playMessage = useAITeacher((state) => state.playMessage);
  const stopMessage = useAITeacher((state) => state.stopMessage);
  const classroom = useAITeacher((state) => state.classroom);
  const container = useRef(null);

  useEffect(() => {
    container.current?.scrollTo({ top: container.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  return (
    <div
      ref={container}
      className={`${classroom === "default" ? "w-[1288px] h-[676px]" : "w-[2528px] h-[856px]"} p-10 overflow-y-auto flex flex-col gap-10 bg-transparent text-white`}
      aria-live="polite"
    >
      {messages.length === 0 && (
        <div className="h-full grid place-content-center text-center">
          <h2 className="text-6xl font-semibold">Welcome to your classroom</h2>
          <p className="text-3xl mt-5 text-white/80">Ask a question to begin.</p>
        </div>
      )}
      {messages.map((message) => (
        <article key={message.id} className="rounded-2xl bg-slate-950/65 p-7 shadow-lg">
          <div className="flex items-start justify-between gap-8">
            <p className="text-2xl text-sky-200">{message.question}</p>
            <button
              type="button"
              className="text-3xl text-white/80 shrink-0"
              aria-label={currentMessage === message ? "Stop reading" : "Read answer aloud"}
              onClick={() => currentMessage === message ? stopMessage() : playMessage(message)}
            >
              {currentMessage === message ? "■" : "▶"}
            </button>
          </div>
          <TutorAnswer answer={message.answer} />
        </article>
      ))}
    </div>
  );
};
