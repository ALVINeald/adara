interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

const prompts = [
  "I've been feeling anxious lately.",
  "Help me calm my thoughts.",
  "I don't know where to start.",
  "Can we practice a breathing exercise?",
];

export default function SuggestedPrompts({
  onSelect,
}: SuggestedPromptsProps) {
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
            onClick={() => onSelect(prompt)}
            className="rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm text-cyan-700 transition hover:border-cyan-200 hover:bg-cyan-100"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}