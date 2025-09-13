"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

type Props = {
  duration?: number; // total splash duration in ms
  onFinish?: () => void; // callback when splash ends
  showText?: boolean; // show TaskSphere text
};

export default function TaskSphereSplash({
  duration = 2800,
  onFinish,
  showText = true,
}: Props) {
  const controls = useAnimation();

  useEffect(() => {
    async function play() {
      // Fade in + scale up
      await controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" },
      });

      // Wait duration then fade out
      setTimeout(async () => {
        await controls.start({
          opacity: 0,
          scale: 0.9,
          transition: { duration: 0.45, ease: "easeIn" },
        });
        onFinish && onFinish();
      }, duration);
    }

    play();
  }, [controls, duration, onFinish]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-red-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={controls}
        className="relative flex flex-col items-center justify-center w-full h-full"
      >
        {/* Particle layer */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="particle particle-1" />
          <div className="particle particle-2" />
          <div className="particle particle-3" />
          <div className="particle particle-4" />
        </div>

        {/* Rotating Sphere */}
        <motion.div
          className="relative flex items-center justify-center"
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
        >
          <img
            src="/ball2.png"
            alt="TaskSphere Logo"
            style={{ width: 220, height: 220 }}
          />
          {/* Outer Glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: "0 12px 60px rgba(127,29,29,0.45)",
            }}
          />
        </motion.div>

        {/* Title + Subtitle (NOT rotating) */}
        {showText && (
          <div className="mt-6 text-center">
            <motion.h1
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                textShadow: "0 6px 18px rgba(0,0,0,0.6)",
              }}
            >
              TaskSphere
            </motion.h1>

            <motion.p
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-2 text-sm text-gray-200/90"
            >
              Powered by Cloud Computing Cell
            </motion.p>
          </div>
        )}

        {/* Styles */}
        <style jsx>{`
          .particle {
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.18);
            box-shadow: 0 0 12px rgba(255, 120, 120, 0.25);
            transform: translate3d(0, 0, 0);
            animation: float 6s ease-in-out infinite;
            will-change: transform, opacity;
            opacity: 0.85;
          }

          .particle-1 {
            left: 12%;
            top: 22%;
            animation-duration: 7s;
          }
          .particle-2 {
            right: 14%;
            top: 28%;
            animation-duration: 5.5s;
            animation-delay: 0.5s;
          }
          .particle-3 {
            left: 20%;
            bottom: 18%;
            animation-duration: 8.5s;
            animation-delay: 1s;
          }
          .particle-4 {
            right: 10%;
            bottom: 26%;
            animation-duration: 6.2s;
            animation-delay: 0.3s;
          }

          @keyframes float {
            0% {
              transform: translateY(0) translateX(0) scale(1);
              opacity: 0.8;
            }
            25% {
              transform: translateY(-18px) translateX(6px) scale(1.05);
              opacity: 1;
            }
            50% {
              transform: translateY(0px) translateX(-8px) scale(0.95);
              opacity: 0.8;
            }
            75% {
              transform: translateY(12px) translateX(4px) scale(1.02);
              opacity: 0.9;
            }
            100% {
              transform: translateY(0) translateX(0) scale(1);
              opacity: 0.8;
            }
          }

          @media (max-width: 640px) {
            img {
              width: 170px !important;
              height: 170px !important;
            }
          }
        `}</style>
      </motion.div>
    </div>
  );
}
