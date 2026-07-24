export function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getTimeOfDayPhrase(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "this morning";
  if (hour < 17) return "this afternoon";
  return "this evening";
}