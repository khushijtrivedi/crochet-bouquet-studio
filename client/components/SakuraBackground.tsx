"use client";

/**
 * SakuraBackground.tsx
 * Place at: components/SakuraBackground.tsx
 *
 * Fully self-contained animated background:
 * - Animated blue gradient (pans slowly)
 * - Soft drifting glow orbs
 * - Falling sakura cherry blossom petals (Your Lie in April style)
 */

import { useEffect, useRef } from "react";

interface SakuraBackgroundProps {
  dark: boolean;
}

/* ── Keyframe styles injected once ── */
const STYLES = `
  @keyframes sakura-fall {
    0%   { transform: translateY(-60px) translateX(0px) rotate(0deg) scale(1);   opacity: 0; }
    8%   { opacity: 0.85; }
    85%  { opacity: 0.6; }
    100% { transform: translateY(110vh) translateX(80px) rotate(720deg) scale(0.7); opacity: 0; }
  }
  @keyframes sakura-sway {
    0%, 100% { margin-left: 0px; }
    25%       { margin-left: 18px; }
    75%       { margin-left: -14px; }
  }
  @keyframes orb-drift-a {
    0%, 100% { transform: translate(0px, 0px) scale(1); }
    33%       { transform: translate(40px, -30px) scale(1.05); }
    66%       { transform: translate(-25px, 15px) scale(0.97); }
  }
  @keyframes orb-drift-b {
    0%, 100% { transform: translate(0px, 0px) scale(1); }
    33%       { transform: translate(-35px, 20px) scale(1.03); }
    66%       { transform: translate(30px, -25px) scale(0.98); }
  }
  @keyframes orb-drift-c {
    0%, 100% { transform: translate(0px, 0px); }
    50%       { transform: translate(20px, -15px); }
  }
  @keyframes bg-pan {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .sakura-petal-wrap {
    position: absolute;
    top: -60px;
    animation: sakura-fall linear infinite, sakura-sway ease-in-out infinite;
  }
`;

/* ── Single sakura petal SVG (5-petal cherry blossom) ── */
function SakuraPetal({ size, color }: { size: number; color: string }) {
  // 5 petals arranged in a circle, each a rounded ellipse
  const petals = Array.from({ length: 5 }, (_, i) => {
    const angle = (i * 360) / 5;
    return (
      <g key={i} transform={`rotate(${angle}, 12, 12)`}>
        <ellipse
          cx="12"
          cy="5"
          rx="4"
          ry="7"
          fill={color}
          opacity="0.88"
        />
      </g>
    );
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {petals}
      {/* Center */}
      <circle cx="12" cy="12" r="2.5" fill="#fde68a" opacity="0.9" />
    </svg>
  );
}

/* ── Petal config ── */
const PETAL_CONFIG = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${(i * 4.7 + 1.5) % 100}%`,
  fallDelay: `${((i * 1.9) % 9).toFixed(1)}s`,
  fallDuration: `${(9 + (i * 2.1) % 9).toFixed(1)}s`,
  swayDelay: `${((i * 0.7) % 3).toFixed(1)}s`,
  swayDuration: `${(3 + (i * 0.8) % 3).toFixed(1)}s`,
  size: 14 + (i * 2.3) % 14,
  rotate: (i * 53) % 360,
}));

export function SakuraBackground({ dark }: SakuraBackgroundProps) {
  const stylesInjected = useRef(false);

  useEffect(() => {
    if (stylesInjected.current) return;
    stylesInjected.current = true;
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => { el.remove(); };
  }, []);

  const petalColors = dark
    ? ["#fbcfe8", "#f9a8d4", "#f472b6", "#fce7f3", "#fda4af"]
    : ["#fce7f3", "#fbcfe8", "#f9a8d4", "#fecdd3", "#ffe4e6"];

  return (
    <>
      {/* Animated gradient background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: dark
            ? "linear-gradient(135deg, #0f172a 0%, #1e3a5f 30%, #0c1a2e 55%, #1a2744 80%, #0f172a 100%)"
            : "linear-gradient(135deg, #fdf2f8 0%, #dbeafe 25%, #eff6ff 50%, #fce7f3 70%, #f0f9ff 100%)",
          backgroundSize: "300% 300%",
          animation: "bg-pan 18s ease infinite",
          transition: "background-image 0.6s ease",
        }}
      />

      {/* Glow orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            width: "650px", height: "650px",
            top: "5%", left: "3%",
            borderRadius: "50%",
            filter: "blur(80px)",
            background: dark
              ? "radial-gradient(circle, rgba(59,130,246,0.13) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(251,207,232,0.55) 0%, transparent 70%)",
            animation: "orb-drift-a 20s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "500px", height: "500px",
            bottom: "8%", right: "6%",
            borderRadius: "50%",
            filter: "blur(70px)",
            background: dark
              ? "radial-gradient(circle, rgba(99,102,241,0.11) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(196,181,253,0.35) 0%, transparent 70%)",
            animation: "orb-drift-b 24s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "350px", height: "350px",
            top: "40%", left: "45%",
            borderRadius: "50%",
            filter: "blur(60px)",
            background: dark
              ? "radial-gradient(circle, rgba(244,63,138,0.08) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(253,186,116,0.25) 0%, transparent 70%)",
            animation: "orb-drift-c 16s ease-in-out infinite 3s",
          }}
        />
      </div>

      {/* Falling sakura petals */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {PETAL_CONFIG.map((p) => {
          const color = petalColors[p.id % petalColors.length];
          return (
            <div
              key={p.id}
              className="sakura-petal-wrap"
              style={{
                left: p.left,
                animationName: "sakura-fall, sakura-sway",
                animationDuration: `${p.fallDuration}, ${p.swayDuration}`,
                animationDelay: `${p.fallDelay}, ${p.swayDelay}`,
                animationTimingFunction: "linear, ease-in-out",
                animationIterationCount: "infinite, infinite",
              }}
            >
              <div style={{ transform: `rotate(${p.rotate}deg)` }}>
                <SakuraPetal size={p.size} color={color} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}