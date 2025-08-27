"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Meteors } from "@/components/magicui/meteors";

export default function NotFound() {
  return (
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-b from-gray-900 via-black to-red-900 overflow-hidden">
      <Meteors/>
      <Meteors/>
      {/* Blurry background blobs */}
      <motion.div
        className="absolute w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ x: [0, 100, -100, 0], y: [0, -100, 100, 0] }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ x: [100, -100, 0, 100], y: [-100, 100, 0, -100] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      />

      {/* Glassmorphism Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center p-10 rounded-2xl backdrop-blur-lg bg-white/10 shadow-2xl border border-white/20"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-8xl font-extrabold text-white tracking-widest drop-shadow-lg"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-4 text-lg text-gray-300 text-center"
        >
          Oops! The page you’re looking for doesn’t exist.
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6"
        >
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-900 to-black text-white font-semibold shadow-lg hover:shadow-2xl transition-all"
          >
            Go Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
