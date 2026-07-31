interface MoodFaceIconProps {
  level: number;
  className?: string;
}

// Deliberately not a red-to-green scale for 1 -> 5 -- keeps this
// session's established principle (see moodScale.ts) that a low mood
// day shouldn't read as "alarming." Low levels get calm, cool tones
// instead of anything resembling a warning color; only the positive
// end of the scale gets warm/green.
const FACE_STYLES: Record<
  number,
  { fill: string; mouth: string }
> = {
  1: { fill: "#94a3b8", mouth: "M 11 21 Q 16 18 21 21" }, // slate, gentle downturn
  2: { fill: "#7dd3fc", mouth: "M 11 20 Q 16 19 21 20" }, // soft sky blue, near-flat
  3: { fill: "#fbbf24", mouth: "M 11 19.5 L 21 19.5" }, // amber, flat
  4: { fill: "#6ee7b7", mouth: "M 10 18 Q 16 24 22 18" }, // emerald, smile
  5: { fill: "#34d399", mouth: "M 9 17 Q 16 26 23 17" }, // deeper emerald, big smile
};

export default function MoodFaceIcon({
  level,
  className,
}: MoodFaceIconProps) {
  const style = FACE_STYLES[level] ?? FACE_STYLES[3];

  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="16" fill={style.fill} />
      <circle cx="11.5" cy="13" r="1.6" fill="#1e293b" />
      <circle cx="20.5" cy="13" r="1.6" fill="#1e293b" />
      <path
        d={style.mouth}
        stroke="#1e293b"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
