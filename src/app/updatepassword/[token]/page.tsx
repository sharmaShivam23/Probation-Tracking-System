"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaCheckCircle, FaLongArrowAltLeft } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

// Password validation rules
const validationRules = [
  "one lowercase character",
  "one uppercase character",
  "one number",
  "one special character",
  "8 character minimum",
];

interface PageProps {
  params: Promise<{ token: string }>; // Next.js 14+ App Router params is a Promise
}

const UpdatePassword: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const [token, setToken] = useState<string>("");

  // Unwrap params promise
  useEffect(() => {
    (async () => {
      const p = await params;
      setToken(p.token);
    })();
  }, [params]);

  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation helpers
  const hasLower = (pw: string) => /[a-z]/.test(pw);
  const hasUpper = (pw: string) => /[A-Z]/.test(pw);
  const hasNumber = (pw: string) => /[0-9]/.test(pw);
  const hasSpecial = (pw: string) => /[!@#$%^&*]/.test(pw);
  const isLongEnough = (pw: string) => /^.{8,}$/.test(pw);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const allValidationsPassed =
    hasLower(formData.password) &&
    hasUpper(formData.password) &&
    hasNumber(formData.password) &&
    hasSpecial(formData.password) &&
    isLongEnough(formData.password) &&
    formData.password === formData.confirmPassword;

  const handleForm = async (e: FormEvent) => {
    e.preventDefault();
    if (!allValidationsPassed) {
      toast.error("Please fix validation errors");
      return;
    }
    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Resetting your password...");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: formData.password, confirmPassword: formData.confirmPassword, hashedToken: token }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || "Password reset successfully!", { id: toastId });
        router.push("/login");
      } else {
        toast.error(data.message || "Reset failed", { id: toastId });
      }
    } catch {
      // console.error(err);
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-red-900 flex items-center justify-center p-3 mt-5 mb-5 sm:p-6">
      <Toaster />
      <motion.form
        onSubmit={handleForm}
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-7 sm:p-10 flex flex-col gap-6 border border-white/20"
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}

          style={{
            fontFamily: "'Orbitron', sans-serif",
            WebkitBackgroundClip: "text",
            textShadow:
              "0 0 15px rgba(127, 29, 29, 1), 0 0 10px rgba(127, 29, 29, 1)",
          }}
          className="sm:text-2xl text-xl font-extrabold text-center text-white drop-shadow-lg"
        >
          Choose New Password
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-300 font-medium text-md"
        >
          Almost done. Enter your new password and you&apos;re all set.
        </motion.p>

        {/* Password */}
        <div className="flex flex-col gap-2">
          {/* <label className="text-md font-semibold text-white">Create Password</label> */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="w-full h-[50px] bg-white/20 text-white placeholder-white/70 rounded-xl pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          {/* <label className="text-md font-semibold text-white">Confirm Password</label> */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full h-[50px] bg-white/20 text-white placeholder-white/70 rounded-xl pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>


        <div className="flex flex-wrap gap-2 mt-2">
          {validationRules.map((rule, i) => {
            let isValid = false;
            if (rule === "one lowercase character") isValid = hasLower(formData.password);
            else if (rule === "one uppercase character") isValid = hasUpper(formData.password);
            else if (rule === "one number") isValid = hasNumber(formData.password);
            else if (rule === "one special character") isValid = hasSpecial(formData.password);
            else if (rule === "8 character minimum") isValid = isLongEnough(formData.password);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-2 text-sm ${isValid ? "text-green-500" : formData.password ? "text-red-500" : "text-white/70"
                  }`}
              >
                <FaCheckCircle />
                <span>{rule}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={!allValidationsPassed || loading}
          whileHover={{ scale: allValidationsPassed ? 1.03 : 1 }}
          whileTap={{ scale: allValidationsPassed ? 0.97 : 1 }}
          className={`w-full flex justify-center items-center py-3 mt-3 rounded-xl font-semibold transition-all ${allValidationsPassed
            ? "bg-red-700 hover:bg-red-600 text-white cursor-pointer"
            : "bg-red-900/50 text-white cursor-not-allowed"
            }`}
        >
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3-3 3h4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
              ></path>
            </svg>
          )}
          {loading ? "Resetting..." : "Reset Password"}
        </motion.button>

        {/* Back to Login */}
        <motion.div
          onClick={() => router.push("/login")}
          whileHover={{ x: -5 }}
          className="mt-3 flex items-center gap-3 cursor-pointer text-white hover:text-gray-300 transition-all select-none"
        >
          <FaLongArrowAltLeft /> Back to Login
        </motion.div>
      </motion.form>
    </div>
  );
};

export default UpdatePassword;
