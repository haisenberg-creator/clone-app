"use client";

import { useState } from "react";
import InstructionScreen from "@/components/InstructionScreen";
import GameScreen from "@/components/GameScreen";
import ResultScreen from "@/components/ResultScreen";

export default function Page() {
  const [screen, setScreen] = useState<"instruction" | "game" | "result">("instruction");
  const [result, setResult] = useState<any>(null);

  if (screen === "instruction") {
    return <InstructionScreen onStart={() => setScreen("game")} />;
  }

  if (screen === "game") {
    return (
      <GameScreen
        onFinish={(res) => {
          setResult(res);
          setScreen("result");
        }}
      />
    );
  }

  return <ResultScreen data={result} />;
}