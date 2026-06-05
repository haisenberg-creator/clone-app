"use client";

type InstructionScreenProps = {
    onStart: () => void;
};

export default function InstructionScreen({ onStart }: InstructionScreenProps) {
    return (
        <div className="min-h-screen w-full bg-[#F7F1E5] flex items-center justify-center px-6">
            <div className="w-full max-w-sm rounded-3xl bg-white/70 shadow-lg p-6 text-center">
                <h1 className="text-3xl font-bold text-[#4a3728]">Fill the Milo Glass</h1>
                <p className="mt-4 text-base text-[#6a4b34]">
                    Tap the screen to fill the glass. Keep the rhythm and stop close to the target line.
                </p>

                <div className="mt-6 rounded-2xl bg-[#f3e7d3] p-4 text-sm text-[#6a4b34] text-left">
                    <p>• Tap only</p>
                    <p>• One short round</p>
                    <p>• Real-time feedback</p>
                    <p>• No replay in the same session</p>
                </div>

                <button
                    type="button"
                    onClick={onStart}
                    className="mt-6 w-full rounded-2xl bg-[#7a542b] px-5 py-4 text-lg font-semibold text-white active:scale-[0.99]"
                >
                    Start
                </button>
            </div>
        </div>
    );
}