"use client";

type RoundResult = {
    rating: "PERFECT" | "GOOD" | "MISS";
    fill: number;
    error: number;
    duration: number;
};

type ResultScreenProps = {
    data: RoundResult | null;
    onContinue?: () => void;
    ctaLabel?: string;
};

export default function ResultScreen({
    data,
    onContinue,
    ctaLabel = "Continue",
}: ResultScreenProps) {
    const rating = data?.rating ?? "MISS";
    const fill = data ? Math.round(data.fill) : 0;
    const duration = data ? (data.duration / 1000).toFixed(1) : "0.0";

    return (
        <div className="min-h-screen w-full bg-[#F7F1E5] flex items-center justify-center px-6">
            <div className="w-full max-w-sm rounded-3xl bg-white/70 shadow-lg p-6 text-center">
                <h1 className="text-3xl font-bold text-[#4a3728]">{rating}</h1>
                <p className="mt-3 text-base text-[#6a4b34]">Final fill: {fill}%</p>

                <div className="mt-6 rounded-2xl bg-[#f3e7d3] p-4 text-left text-sm text-[#6a4b34]">
                    <p>Target error: {data ? data.error.toFixed(1) : "0.0"}</p>
                    <p className="mt-1">Time taken: {duration}s</p>
                    <p className="mt-1">
                        {rating === "PERFECT"
                            ? "You hit the target line."
                            : rating === "GOOD"
                                ? "Close enough for a strong result."
                                : "Try to land closer next time."}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onContinue}
                    className="mt-6 w-full rounded-2xl bg-[#7a542b] px-5 py-4 text-lg font-semibold text-white active:scale-[0.99]"
                >
                    {ctaLabel}
                </button>
            </div>
        </div>
    );
}