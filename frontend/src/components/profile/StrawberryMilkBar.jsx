// src/components/ui/StrawberryMilkBar.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";

export default function StrawberryMilkBar({
  progress = 60,
  height = 36,
  radius = 9999,
  bubbles = 22,
  className = "",
}) {
  const clamped = Math.max(0, Math.min(100, progress));
  const bubbleData = useMemo(
    () =>
      Array.from({ length: bubbles }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 3 + Math.random() * 6,
        delay: Math.random() * 1.2,
        dur: 1.6 + Math.random() * 2.2,
      })),
    [bubbles]
  );

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        height,
        borderRadius: radius,
        border: "2px solid rgba(255,170,200,.35)",
        background: "linear-gradient(180deg, rgba(255,255,255,.2), rgba(255,255,255,0))",
        boxShadow: "inset 0 0 18px rgba(255,182,193,.25)",
      }}
    >
      {/* “Glass” highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.45) 0%, rgba(255,255,255,0) 55%)",
        }}
      />

      {/* Liquid fill */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden"
        style={{
          height: "100%",
          borderRadius: radius,
          clipPath: `inset(${100 - clamped}% 0 0 0)`,
        }}
      >
        {/* Milk gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #ffd5e5 0%, #ffc1da 45%, #ff9fc7 100%)",
          }}
        />
        {/* Wavy surface */}
        <motion.div
          className="absolute left-0 right-0"
          style={{ top: -height * 0.15, height: height * 0.5 }}
          animate={{ x: ["0%", "-20%", "0%"] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="100%" height="100%" preserveAspectRatio="none">
            <path
              d="M0,20 C60,0 120,40 180,20 C240,0 300,40 360,20 L360,80 L0,80 Z"
              fill="rgba(255,255,255,.35)"
            />
          </svg>
        </motion.div>

        {/* Bubbles rising */}
        {bubbleData.map((b) => (
          <motion.span
            key={b.id}
            className="absolute rounded-full"
            style={{
              left: `${b.left}%`,
              bottom: 2,
              width: b.size,
              height: b.size,
              background:
                "radial-gradient(circle, rgba(255,255,255,.9) 0%, rgba(255,255,255,0) 70%)",
              filter: "blur(.2px)",
            }}
            initial={{ y: 0, opacity: 0.6 }}
            animate={{ y: -height * 0.9, opacity: [0.6, 1, 0] }}
            transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Percentage overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="font-mono font-bold text-white"
          style={{ textShadow: "0 0 8px rgba(255,105,180,.8), 1px 1px 2px rgba(0,0,0,.8)" }}
        >
          {clamped}%
        </span>
      </div>
    </div>
  );
}
