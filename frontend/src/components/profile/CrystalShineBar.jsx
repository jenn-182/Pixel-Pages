// components/ui/CrystalShineBar.jsx
import React from "react";
import { motion } from "framer-motion";

export default function CrystalShineBar({
  progress = 42,        // 0-100
  height = 16,          // px
  radius = 9999,        // pill by default
  className = "",
}) {
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <div
      className={`relative w-full overflow-hidden border border-pink-300/40 bg-pink-200/10 backdrop-blur-[1px] ${className}`}
      style={{ height, borderRadius: radius, boxShadow: "inset 0 0 12px rgba(255, 182, 193, .15)" }}
    >
      {/* Filled area */}
      <div
        className="h-full relative"
        style={{
          width: `${clamped}%`,
          borderRadius: radius,
          backgroundImage:
            // faceted crystal gradient
            "linear-gradient(90deg, #f9a8d4 0%, #f0abfc 35%, #e879f9 65%, #fb7185 100%)",
          boxShadow:
            "inset 0 0 20px rgba(255,255,255,.25), inset 0 -6px 12px rgba(255, 105, 180, .25)",
          transition: "width 300ms ease",
        }}
      >
        {/* Subtle “facets” pattern */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none mix-blend-screen"
          style={{
            backgroundImage: `
              linear-gradient(135deg, rgba(255,255,255,.15) 0 10%, transparent 10% 50%),
              linear-gradient(45deg, rgba(255,255,255,.08) 0 12%, transparent 12% 50%)
            `,
            backgroundSize: "18px 18px, 22px 22px",
            backgroundPosition: "0 0, 6px 6px",
          }}
        />

        {/* Sweeping shine */}
        <motion.div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            width: 80,
            borderRadius: 12,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.75) 45%, rgba(255,255,255,0) 100%)",
            filter: "blur(2px)",
            transform: "skewX(-20deg)",
          }}
          initial={{ x: "-20%" }}
          animate={{ x: "120%" }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Tiny sparkle line near top edge */}
        <motion.div
          className="absolute left-0 right-0"
          style={{
            top: 2,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent)",
          }}
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
