export default function TypingIndicator() {
  return (
    <div className="mb-6 flex justify-start">

      <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

        <div className="flex gap-1">

          <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500" />

          <span
            className="h-2 w-2 animate-bounce rounded-full bg-cyan-500"
            style={{ animationDelay: "0.2s" }}
          />

          <span
            className="h-2 w-2 animate-bounce rounded-full bg-cyan-500"
            style={{ animationDelay: "0.4s" }}
          />

        </div>

        <span className="text-sm text-slate-500">
          Adara is thinking...
        </span>

      </div>

    </div>
  );
}