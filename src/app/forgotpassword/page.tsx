"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaLongArrowAltLeft } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [loading , setLoading] = useState<boolean>(false);

  const emailRegex = /^[a-z]{3,15}(24|23)\d{5,6}@akgec\.ac\.in$/;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setEmailError("Email is required");
    } else if (!emailRegex.test(value)) {
      setEmailError(
        "Enter a valid college email (e.g., shivam2311155@akgec.ac.in)"
      );
    } else {
      setEmailError("");
    }
  };

  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  async function handleForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email || emailError) {
      toast.error("Please enter a valid college email");
      return;
    }
   setLoading(true);
    const toastId = toast.loading("Sending reset link...");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data: { success?: boolean; message?: string } = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Email sent successfully", { id: toastId });
        setLoading(false);
        setEmailSent(true);
        setResendTimer(120); 
      } else {
        toast.error(data.message || "Something went wrong", { id: toastId });
      }
    } catch (err) {
      // console.error("Forgot password error:", err);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-[#460F0E] text-white p-6">
      <Toaster />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/30"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            fontFamily: "'Orbitron', sans-serif",
            textShadow:
              "0 0 15px rgba(127, 29, 29, 1), 0 0 10px rgba(127, 29, 29, 1)",
          }}
          className="text-3xl font-extrabold text-center mb-6 text-white drop-shadow-lg"
        >
          {!emailSent ? "Reset Password" : "Check Your Email"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="sm:text-md text-sm font-medium text-center text-gray-300 mb-6"
        >
          {!emailSent
            ? "We’ll email you instructions to reset your password. If you don’t have access to your email, we can try account recovery."
            : `We’ve sent the reset link to ${email}`}
        </motion.p>

        <form
          onSubmit={handleForm}
          className="space-y-5 flex flex-col items-center w-full"
        >
          {!emailSent && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full"
            >
              <label className="block text-sm font-medium text-white/90 mb-1">
                College Email
              </label>
              <input
                type="email"
                id="email1"
                value={email}
                onChange={handleEmailChange}
                placeholder="yourname@akgec.ac.in"
                className={`w-full h-[50px] px-4 py-2 rounded-xl bg-white/30 text-white placeholder-white/70 border ${
                  emailError
                    ? "border-red-500 focus:ring-red-600"
                    : "border-white/40 focus:ring-red-700"
                } focus:outline-none focus:ring-2`}
              />
              {emailError && (
                <p className="text-red-400 text-sm mt-1">{emailError}</p>
              )}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full"
          >
            <button
              type="submit"
              disabled={!!emailError || !email || (emailSent && resendTimer > 0)}
              className={`w-full py-3 rounded-xl font-semibold cursor-pointer bg-gradient-to-l from-white/20 via-red-950 to-white/10 border border-white/10 text-white shadow-lg transition-all ${
                !!emailError || !email || (emailSent && resendTimer > 0)
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90 hover:scale-95"
              }`}
            >
              {loading ? 
              <div className="loading flex justify-center items-center w-full">
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
            </div>
            : (
              !emailSent
                ? "Send Reset Link"
                : resendTimer > 0
                ? `Resend Email (${resendTimer}s)`
                : "Resend Email"
                )}
            </button>
          </motion.div>

          <motion.div
            onClick={() => router.push("/login")}
            whileHover={{ x: -5 }}
            className="mt-4 flex items-center gap-3 cursor-pointer text-white hover:text-gray-300 transition-all"
          >
            <FaLongArrowAltLeft className="text-2xl" /> Back to Login
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
