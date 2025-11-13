"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; 
import TaskSphereSplash from "@/components/splash";

function Button({
  children,
  variant = "default",
  className = "",
  ...props
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "px-6 py-3 rounded-2xl font-semibold transition-colors duration-200";
  const variants = {
    default: "bg-red-900 text-white hover:bg-red-700",
    outline:
      "border border-red-900 text-red-900 hover:bg-red-900 hover:text-white",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true); 

  return (
    <div className="min-h-screen flex flex-col">
      
      {showSplash && (
      
        <TaskSphereSplash duration={3000} onFinish={() => setShowSplash(false)} />
      )}

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-grow text-center px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold leading-tight text-white drop-shadow-sm"
        >
          Smart <span className="text-white/80">Task</span> &{" "}
          <span className="text-white/80">Attendance</span> Manager
        </motion.h2>
        <p className="mt-6 max-w-2xl text-lg text-white">
          A modern system for students and admins to manage tasks, submissions,
          and attendance built for simplicity and speed.
        </p>
        <div className="mt-8 flex cursor-pointer gap-4 flex-wrap justify-center">
          {/* <Button onClick={() => router.push("/register")}>Register as Admin</Button> */}
          <Button className="cursor-pointer"  onClick={() => router.push("/register")}>
            Register as Student
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20">
        <h3 className="text-3xl font-bold text-center mb-12 text-white">
          Key Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl shadow-lg bg-white/10 backdrop-blur-md border border-white/40 flex flex-col items-center text-center"
          >
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-900 text-3xl mb-4">
              📋
            </div>
            <h4 className="font-semibold text-lg">Task Management</h4>
            <p className="text-white mt-2">
              Admins upload tasks, students submit with deadline tracking.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl shadow-lg bg-white/10 backdrop-blur-md border border-white/40 flex flex-col items-center text-center"
          >
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-900 text-3xl mb-4">
              📊
            </div>
            <h4 className="font-semibold text-lg">Attendance Tracking</h4>
            <p className="text-white mt-2">
              Simple attendance marking with instant visibility for students.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl shadow-lg bg-white/10 backdrop-blur-md border border-white/40 flex flex-col items-center text-center"
          >
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-900 text-3xl mb-4">
              🎓
            </div>
            <h4 className="font-semibold text-lg">Student Dashboard</h4>
            <p className="text-white mt-2">
              Personalized student view with tasks & attendance insights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-6 py-6 backdrop-blur-md border-t text-center text-white text-sm">
        © {new Date().getFullYear()} Task & Attendance Manager · Built with ❤️
      </footer>
    </div>
  );
}
