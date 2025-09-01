
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/middleware/DecodeToken";
import { getUserName } from "@/middleware/DecodeToken";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [userName , setUserName] = useState<string | null>(null);

  
  useEffect(() => {
  const checkRole = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setRole(getUserRole(token));
      setUserName(getUserName(token))
    } else {
      setRole(null);
    }
  };

  checkRole(); 
  window.addEventListener("storage", checkRole);

  window.addEventListener("tokenChange", checkRole);

  return () => {
    window.removeEventListener("storage", checkRole);
    window.removeEventListener("tokenChange", checkRole);
  };
}, []);


  const handleDashboard = () => {
    if (!role) {
      router.push("/login");
      return;
    }
    if (role === "Admin") router.push("/admin-dashboard");
    else router.push("/student-dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setRole(null);
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-red-400 via-black to-gray-900 backdrop-blur-xl shadow-lg text-white">
      <div
        className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          WebkitBackgroundClip: "text",
          textShadow:
            "0 0 15px rgba(70,15,14,1), 0 0 30px rgba(99,102,241,0.5)",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-white bg-clip-text"
        >
          EduPortal
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-white">
          <Link href="/" className="relative group transition">
            Home
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-800 transition-all duration-300 group-hover:w-full" />
          </Link>

          <div
            className="cursor-pointer relative group"
            onClick={handleDashboard}
          >
            Dashboard
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-900 transition-all duration-300 group-hover:w-full" />
          </div>

          {!role ? (
            <Link href="/register" className="relative group transition">
              Register
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          ) : (
            <div
              className="relative group text-white cursor-pointer"
              onClick={handleDashboard}
            >
              <select className="bg-red-900 cursor-pointer text-white">
                <option className="cursor-pointer" value="">{userName?.split(" ")[0]}</option>
                <option className="cursor-pointer" value=""> {role === "Admin" ? "admin" : "Student"}</option>
              </select>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
            </div>
          )}

          {role ? (
            <div
              className="cursor-pointer relative group"
              onClick={handleLogout}
            >
              Logout
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full" />
            </div>
          ) : (
            <Link href="/login" className="relative group transition">
              Login
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-800 transition-all duration-300 group-hover:w-full" />
            </Link>
          )}

          <Link href="/Help" className="relative group transition">
            Help
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-800 transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white/20 backdrop-blur-md shadow-lg text-white"
        >
          <div className="flex flex-col items-center py-6 space-y-6 text-lg font-semibold">
            {!role && (
              <Link href="/register" onClick={() => setIsOpen(false)}>
                Register
              </Link>
            )}
            {role ? (
              <div
                className="cursor-pointer text-red-500"
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            )}
            <div
              className="cursor-pointer"
              onClick={() => {
                setIsOpen(false);
                handleDashboard();
              }}
            >
              Dashboard
            </div>
            <Link href="/Help" onClick={() => setIsOpen(false)}>
              Help
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
