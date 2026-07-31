export default function GhostMascot() {
  return (
    <svg
      viewBox="0 0 160 160"
      className="h-36 w-36"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ghostBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>

      <style>
        {`
          @keyframes ghost-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          @keyframes ghost-twinkle {
            0%, 100% { opacity: 0.35; transform: scale(0.75); }
            50% { opacity: 1; transform: scale(1.15); }
          }
          .ghost-float-group {
            animation: ghost-float 4s ease-in-out infinite;
            transform-origin: 80px 80px;
          }
          .ghost-sparkle {
            animation: ghost-twinkle 2.2s ease-in-out infinite;
            transform-origin: center;
          }
        `}
      </style>

      {/* Soft glow behind the mascot -- stays put while the body
          gently floats, so the glow doesn't look like it's bobbing
          out of alignment with its own shadow. */}
      <circle cx="80" cy="82" r="58" fill="#ede9fe" />

      <g className="ghost-float-group">

        {/* Body: rounded top, scalloped (wavy) bottom edge */}
        <path
          d="
            M 40 78
            C 40 45, 58 24, 80 24
            C 102 24, 120 45, 120 78
            L 120 108
            C 120 108, 112 100, 104 108
            C 96 116, 88 100, 80 108
            C 72 116, 64 100, 56 108
            C 48 116, 40 108, 40 108
            Z
          "
          fill="url(#ghostBody)"
        />

        {/* Face */}
        <circle cx="66" cy="76" r="4.5" fill="#3b2a6b" />
        <circle cx="94" cy="76" r="4.5" fill="#3b2a6b" />
        <path
          d="M 68 94 Q 80 104 92 94"
          stroke="#3b2a6b"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Little raised arm */}
        <path
          d="M 116 84 C 128 80, 134 68, 130 58"
          stroke="#a78bfa"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />

        {/* Floating heart -- twinkles on its own, slightly offset
            timing from the sparkle dots below for a livelier feel. */}
        <path
          className="ghost-sparkle"
          style={{ animationDelay: "0.3s" }}
          d="
            M 132 40
            C 128 34, 118 36, 118 44
            C 118 51, 132 60, 132 60
            C 132 60, 146 51, 146 44
            C 146 36, 136 34, 132 40
            Z
          "
          fill="#a855f7"
        />

      </g>

      {/* Sparkle dots -- kept outside the floating group so they
          twinkle independently rather than bobbing with the body. */}
      <circle
        className="ghost-sparkle"
        cx="38"
        cy="50"
        r="2.5"
        fill="#c4b5fd"
      />
      <circle
        className="ghost-sparkle"
        style={{ animationDelay: "1.1s" }}
        cx="128"
        cy="96"
        r="2"
        fill="#c4b5fd"
      />
    </svg>
  );
}
