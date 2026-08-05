// Standing in for the mockup's photo covers -- there's no image_url
// field on the communities table and no image upload system anywhere
// in the app, so a real photo isn't available. This picks a
// consistent, good-looking gradient per community (same category
// always gets the same look) rather than a random one that would
// shift on every reload.

const COVER_GRADIENTS = [
  "from-violet-400 via-purple-400 to-fuchsia-300",
  "from-indigo-500 via-violet-500 to-purple-400",
  "from-emerald-400 via-teal-400 to-cyan-300",
  "from-amber-300 via-orange-300 to-rose-300",
  "from-sky-400 via-blue-400 to-indigo-300",
  "from-rose-400 via-pink-400 to-fuchsia-300",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getCommunityCoverGradient(seed: string): string {
  const index = hashString(seed) % COVER_GRADIENTS.length;
  return COVER_GRADIENTS[index];
}
