export function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center gap-2" aria-label="Loading">
      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-500 [animation-delay:-0.3s]" />
      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-500 [animation-delay:-0.15s]" />
      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-500" />
    </div>
  );
}
