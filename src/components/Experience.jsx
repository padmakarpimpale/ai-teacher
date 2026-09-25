"use client";
import { useAITeacher } from "@/hooks/useAITeacher";
import {
  CameraControls,
  Environment,
  Float,
  Gltf,
  Html,
  Loader,
  useGLTF,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva, button, useControls } from "leva";
import { Suspense, useEffect, useRef, useState } from "react";
import { degToRad } from "three/src/math/MathUtils";
import { BoardSettings } from "./BoardSettings";
import { MessagesList } from "./MessagesList";
import { Teacher } from "./Teacher";
import { TypingBox } from "./TypingBox";

const itemPlacement = {
  default: {
    classroom: {
      position: [0.2, -1.7, -2],
    },
    teacher: {
      position: [-1, -1.7, -3],
    },
    board: {
      position: [0.45, 0.382, -6],
    },
  },
  alternative: {
    classroom: {
      position: [0.3, -1.7, -1.5],
      rotation: [0, degToRad(-90), 0],
      scale: 0.4,
    },
    teacher: { position: [-1, -1.7, -3] },
    board: { position: [1.4, 0.84, -8] },
  },
};

export const Experience = () => {
  const teacher = useAITeacher((state) => state.teacher);
  const classroom = useAITeacher((state) => state.classroom);
  const [webgl, setWebgl] = useState(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setWebgl(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
  }, []);

  if (webgl === false) return <TextFallback />;
  if (webgl === null) return <main className="min-h-screen bg-slate-900" />;

  return (
    <>
      <div className="z-10 md:justify-center fixed bottom-4 left-4 right-4 flex gap-3 flex-wrap justify-stretch">
        <TypingBox />
      </div>
      <Leva hidden />
      <Loader />
      <Canvas
        camera={{
          position: [0, 0, 0.0001],
        }}
      >
        <CameraManager />

        <Suspense>
          <Float speed={0.5} floatIntensity={0.2} rotationIntensity={0.1}>
            <Html
              transform
              {...itemPlacement[classroom].board}
              distanceFactor={1}
            >
              <MessagesList />
              <BoardSettings />
            </Html>
            <Environment preset="sunset" />
            <ambientLight intensity={0.8} color="pink" />

            <Gltf
              src={`/models/classroom_${classroom}.glb`}
              {...itemPlacement[classroom].classroom}
            />
            <Teacher
              teacher={teacher}
              key={teacher}
              {...itemPlacement[classroom].teacher}
              scale={1.5}
              rotation-y={degToRad(20)}
            />
          </Float>
        </Suspense>
      </Canvas>
    </>
  );
};

const TextFallback = () => {
  const messages = useAITeacher((state) => state.messages);
  const playMessage = useAITeacher((state) => state.playMessage);
  const hindi = useAITeacher((state) => state.hindi);
  const sethindi = useAITeacher((state) => state.sethindi);
  const setEnglish = useAITeacher((state) => state.setEnglish);

  return (
    <main className="min-h-screen bg-slate-900 text-white p-5 pb-48">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold">AI Tutor</h1>
        <p className="text-white/70 mt-2">The 3D classroom needs WebGL. You can still ask questions here.</p>
        <div className="flex gap-3 mt-5">
          <button className={`rounded px-4 py-2 ${!hindi ? "bg-indigo-600" : "bg-slate-700"}`} onClick={() => setEnglish(true)}>English</button>
          <button className={`rounded px-4 py-2 ${hindi ? "bg-indigo-600" : "bg-slate-700"}`} onClick={() => sethindi(true)}>Hindi</button>
        </div>
        <div className="space-y-5 mt-8" aria-live="polite">
          {messages.map((message) => (
            <article key={message.id} className="rounded-xl bg-slate-800 p-5">
              <p className="text-white/60">You: {message.question}</p>
              <p className="whitespace-pre-wrap mt-3">{message.answer}</p>
              <button className="mt-3 text-blue-300" onClick={() => playMessage(message)}>Play answer</button>
            </article>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/90"><div className="max-w-3xl mx-auto"><TypingBox /></div></div>
    </main>
  );
};

const CAMERA_POSITIONS = {
  default: [0, 6.123233995736766e-21, 0.0001],
  loading: [
    0.00002621880610890309, 0.00000515037441056466, 0.00009636414192870058,
  ],
  speaking: [0, -1.6481333940859815e-7, 0.00009999846226827279],
};

const CAMERA_ZOOMS = {
  default: 1,
  loading: 1.3,
  speaking: 2.1204819420055387,
};

const CameraManager = () => {
  const controls = useRef();
  const loading = useAITeacher((state) => state.loading);
  const currentMessage = useAITeacher((state) => state.currentMessage);

  useEffect(() => {
    if (loading) {
      controls.current?.setPosition(...CAMERA_POSITIONS.loading, true);
      controls.current?.zoomTo(CAMERA_ZOOMS.loading, true);
    } else if (currentMessage) {
      controls.current?.setPosition(...CAMERA_POSITIONS.speaking, true);
      controls.current?.zoomTo(CAMERA_ZOOMS.speaking, true);
    }
  }, [loading]);

  useControls("Helper", {
    getCameraPosition: button(() => {
      const position = controls.current.getPosition();
      const zoom = controls.current.camera.zoom;
      console.log([...position], zoom);
    }),
  });

  return (
    <CameraControls
      ref={controls}
      minZoom={1}
      maxZoom={3}
      polarRotateSpeed={-0.3} // REVERSE FOR NATURAL EFFECT
      azimuthRotateSpeed={-0.3} // REVERSE FOR NATURAL EFFECT
      mouseButtons={{
        left: 1, //ACTION.ROTATE
        wheel: 16, //ACTION.ZOOM
      }}
      touches={{
        one: 32, //ACTION.TOUCH_ROTATE
        two: 512, //ACTION.TOUCH_ZOOM
      }}
    />
  );
};

useGLTF.preload("/models/classroom_default.glb");
useGLTF.preload("/models/classroom_alternative.glb");
