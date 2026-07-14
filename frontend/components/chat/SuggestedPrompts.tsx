const prompts = [
  "I've been feeling anxious lately.",
  "Help me calm my thoughts.",
  "I don't know where to start.",
  "Can we practice a breathing exercise?",
];

export default function SuggestedPrompts() {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-slate-500">
        Try one of these to get started
      </p>

      <div className="flex flex-wrap gap-3">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm text-cyan-700 transition hover:bg-cyan-100 hover:border-cyan-200"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}