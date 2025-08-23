"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex justify-center min-h-screen">
      <motion.div
        className="relative w-16 h-16 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      >
    
        <motion.div
          className="absolute w-full h-full rounded-full border-4 border-red-800"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          style={{
            boxShadow:
              "0 0 15px rgba(127,29,29,1), 0 0 30px rgba(99,102,241,0.6)",
          }}
        />

        {/* Inner dot */}
        <motion.div
          className="w-4 h-4 rounded-full bg-red-800"
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          style={{
            boxShadow:
              "0 0 10px rgba(127,29,29,1), 0 0 20px rgba(99,102,241,0.7)",
          }}
        />
      </motion.div>
    </div>
  );
}
