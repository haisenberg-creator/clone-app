"use client";

import { useEffect, useRef, useState } from "react";

type RoundResult = {
    rating: "PERFECT" | "GOOD" | "MISS";
    fill: number;
    error: number;
    duration: number;
};

type GameScreenProps = {
    onFinish: (result: RoundResult) => void;
};

type FillState = "LOW" | "PERFECT" | "OVER";

export default function GameScreen({ onFinish }: GameScreenProps) {
    const target = 75;
    const maxFill = 100;

    const [fill, setFill] = useState(0);
    const [state, setState] = useState<FillState>("LOW");
    const [pulse, setPulse] = useState(false);
    const [feedback, setFeedback] = useState("Tap to fill");
    const [elapsedTime, setElapsedTime] = useState(0);

    const lastTap = useRef(0);
    const fillRef = useRef(0);
    const ended = useRef(false);
    const startTime = useRef(Date.now());
    const inactivityTimer = useRef<any>(null);

    useEffect(() => {
        const timer = window.setInterval(() => {
            if (!ended.current) {
                const elapsed = Date.now() - startTime.current;
                setElapsedTime(elapsed);
            }
        }, 16);

        return () => window.clearInterval(timer);
    }, []);

    function getTapPower(interval: number): number {
        if (interval < 80) return 0.3;
        if (interval < 140) return 0.6;
        if (interval < 220) return 1.0;
        if (interval < 300) return 0.7;
        return 0.4;
    }

    function updateFeedback(currentFill: number) {
        const diff = currentFill - target;
        const absDiff = Math.abs(diff);

        if (absDiff < 3) {
            setState("PERFECT");
            setFeedback("PERFECT!");
        } else if (diff < 0) {
            setState("LOW");
            setFeedback("KEEP TAPPING");
        } else {
            setState("OVER");
            setFeedback("TOO MUCH");
        }
    }

    function handleTap() {
        if (ended.current) return;

        const now = Date.now();
        const interval = lastTap.current ? now - lastTap.current : 180;
        lastTap.current = now;

        const power = getTapPower(interval);
        const resistance = 1 - fillRef.current / maxFill;
        const delta = power * 2.5 * resistance;

        const nextFill = Math.min(maxFill, fillRef.current + delta);
        fillRef.current = nextFill;

        setFill(nextFill);
        updateFeedback(nextFill);

        setPulse(true);
        window.setTimeout(() => setPulse(false), 80);

        if (inactivityTimer.current) {
            window.clearTimeout(inactivityTimer.current);
        }
        inactivityTimer.current = window.setTimeout(() => {
            endGame();
        }, 2000);
    }

    function endGame() {
        if (ended.current) return;
        ended.current = true;

        if (inactivityTimer.current) {
            window.clearTimeout(inactivityTimer.current);
        }

        const finalFill = fillRef.current;
        const error = Math.abs(finalFill - target);
        const duration = Date.now() - startTime.current;

        let rating: RoundResult["rating"] = "MISS";
        if (error < 3) rating = "PERFECT";
        else if (error < 8) rating = "GOOD";

        onFinish({
            rating,
            fill: finalFill,
            error,
            duration,
        });
    }

    const liquidColor =
        state === "PERFECT"
            ? "bg-green-400"
            : state === "OVER"
                ? "bg-red-400"
                : "bg-yellow-500";

    return (
        <div
            className="min-h-screen w-full bg-[#F7F1E5] flex flex-col items-center justify-center px-6 select-none touch-none"
            onPointerDown={handleTap}
            style={{ touchAction: "none" }}
        >
            <div className="w-full max-w-sm">
                <div className="mb-4">
                    <p className="text-center text-sm text-[#6a4b34]">Time: {(elapsedTime / 1000).toFixed(1)}s</p>
                </div>

                <div className="mb-4 text-center">
                    <p className="text-2xl font-bold text-[#4a3728]">{feedback}</p>
                    <p className="mt-1 text-sm text-[#6a4b34]">Fill: {Math.round(fill)}%</p>
                </div>

                <div className={`relative mx-auto h-[420px] w-[190px] ${pulse ? "scale-[1.015]" : "scale-100"} transition-transform duration-75`}>
                    <div className="absolute inset-0 rounded-[2rem] border-[6px] border-[#8b6a4d] bg-white/20 shadow-inner" />
                    <div className="absolute inset-3 overflow-hidden rounded-[1.5rem]">
                        <div
                            className={`absolute bottom-0 left-0 w-full transition-all duration-75 ${liquidColor}`}
                            style={{ height: `${fill}%` }}
                        />
                        <div
                            className="absolute left-0 w-full h-1 bg-green-500/80"
                            style={{ bottom: `${target}%` }}
                        />
                        {state === "PERFECT" && (
                            <div className="absolute inset-0 rounded-[1.5rem] ring-4 ring-green-400/30" />
                        )}
                        {state === "OVER" && (
                            <div className="absolute inset-0 rounded-[1.5rem] ring-4 ring-red-400/30" />
                        )}
                    </div>
                </div>

                <p className="mt-5 text-center text-sm text-[#6a4b34]">
                    Tap rhythm matters. Too fast or too slow gives weaker fill.
                </p>
            </div>
        </div>
    );
}