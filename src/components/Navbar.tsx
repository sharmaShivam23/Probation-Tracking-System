
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getUserRole, getUserName } from "@/middleware/DecodeToken";
import { CiMenuKebab } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [messageAlert, setMessageAlert] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const checkRole = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setRole(getUserRole(token));
        setUserName(getUserName(token));
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

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setRole(null);
    setMessageAlert(false);
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
      
        <div className="flex justify-center gap-2 items-center">
          <div className="logo flex justify-center items-center">
            <img src="/ball2.png" className="h-12 b-cover" alt="logo" />
          </div>
          <Link href="/" className="text-2xl font-extrabold text-white">
            TaskSphere
          </Link>
        </div>

        
        <div className="hidden md:flex gap-8 text-white">
          <Link href="/" className="relative group transition">
            Home
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-800 transition-all duration-300 group-hover:w-full" />
          </Link>

          <div className="cursor-pointer relative group" onClick={handleDashboard}>
            Dashboard
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-900 transition-all duration-300 group-hover:w-full" />
          </div>

          {!role ? (
            <Link href="/register" className="relative group transition">
              Register
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          ) : (
           <select
  className="bg-red-900 cursor-pointer text-white rounded-md px-2"
  onChange={(e) => {
    if (e.target.value === "profile") {
      router.push("/student-dashboard/profile");
    }
  }}
>
  <option value="username">{userName?.split(" ")[0]}</option>
  <option value="role">{role === "Admin" ? "Admin" : "Student"}</option>
 {role == "Student" &&   <option className="cursor-pointer" value="profile">Profile</option>}
</select>

          )}

          {role ? (
            <div
              className="cursor-pointer relative group"
              onClick={() => setMessageAlert(true)} 
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

      
        <button
          className="md:hidden text-3xl  text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
           <RxCross2/>
          ) : (
           <CiMenuKebab/>
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
           <Link href="/" className="relative group transition">
            Home
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-800 transition-all duration-300 group-hover:w-full" />
          </Link>
            
            {role ? (
              <div
                className="cursor-pointer text-red-500"
                onClick={() => {
                  setIsOpen(false);
                  setMessageAlert(true);
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

            {!role ? (
            <Link href="/register" className="relative group transition">
              Register
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          ) : (
           <select
  className="bg-red-900 cursor-pointer text-white rounded-md h-[40px] px-2"
  onChange={(e) => {
    if (e.target.value === "profile") {
      router.push("/student-dashboard/profile");
    }
  }}
>
  <option value="username">{userName?.split(" ")[0]}</option>
  <option value="role">{role === "Admin" ? "Admin" : "Student"}</option>
 {role == "Student" &&   <option className="cursor-pointer" value="profile">Profile</option>}
</select>

          )}
            <Link href="/Help" onClick={() => setIsOpen(false)}>
              Help
            </Link>
          </div>
        </motion.div>
      )}

      {/* Popup Box */}
      <AnimatePresence>
        {messageAlert && (
          <>
          
            <motion.div
              className="fixed inset-0  bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMessageAlert(false)}
            />

        
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 mt-20 w-[90%] max-w-sm bg-gradient-to-b from-black via-gray-900 to-red-900 border border-red-800 rounded-2xl p-6 shadow-2xl text-center"
              initial={{ scale: 0.8, opacity: 0, y: -30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -30 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <h2 className="text-xl font-bold text-white mb-3">
                Confirm Logout
              </h2>
              <p className="text-gray-200 text-sm mb-6">
                After logout, you will need to log in again to continue using{" "}
                <span className="text-red-300 font-semibold">TaskSphere</span>.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleLogoutConfirm}
                  className="px-5 py-2 rounded-xl cursor-pointer bg-red-700 hover:bg-red-800 text-white font-semibold shadow-md transition"
                >
                  Logout
                </button>
                <button
                  onClick={() => setMessageAlert(false)}
                  className="px-5 py-2 cursor-pointer rounded-xl bg-gray-700 hover:bg-gray-800 text-gray-100 font-medium shadow-md transition"
                >
                  Stay Logged In
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
