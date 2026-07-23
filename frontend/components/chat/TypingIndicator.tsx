export default function TypingIndicator() {
  return (
    <div className="mb-8 flex justify-start">

      <div className="flex items-center gap-1.5 px-1 py-2">

        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" />

        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400"
          style={{ animationDelay: "0.15s" }}
        />

        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400"
          style={{ animationDelay: "0.3s" }}
        />

      </div>

    </div>
  );
}