"use client";

import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/middleware/DecodeToken";
import { EyeClosed, EyeIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [messagePopup, setMessagePopup] = useState<boolean>(false);
  const [, setRole] = useState<string | null>(null);
  const [showpassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     const userRole = getUserRole(token);
  //     setRole(userRole);
  //   }
  // }, []);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  function validate() {
    const newErrors: Record<string, string> = {};
    let valid = true;

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!formData.email.match(/^[a-zA-Z]{3,15}(24|23)\d{5,6}@akgec\.ac\.in$/)) {
      newErrors.email = "Invalid Email Id";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 4) {
      newErrors.password = "Invalid password";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", formData, { withCredentials: true });


      if (res.status === 403 || res?.data?.message?.includes("inactive")) {
        setMessagePopup(true);
        return;
      }


      if (res?.data?.success) {
        toast.success("Login successful!");

        const token = res.data.token;
        localStorage.setItem("token", token);
        // localStorage.setItem("userId", res.data.payload.id);
        // router.refresh();
        window.dispatchEvent(new Event("tokenChange"));
        const userRole = getUserRole(token);
        setRole(userRole);


        if (userRole === "Admin") {
          router.push("/admin-dashboard");
        } else if (userRole === "Student") {
          router.push("/student-dashboard");
        } else {
          toast.error("Invalid role");
        }

        setFormData({ email: "", password: "" });
      } else {
        toast.error(res?.data?.message || "Login failed");
      }
    } catch (error: unknown) {
      // console.log(error);
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Something went wrong"
        : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("userId");
  //   localStorage.removeItem("role");
  //   setRole(null);
  //   router.push("/login");
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-[#460F0E] text-white p-6">
      <Toaster />

      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/30">
        <h1 style={{
          fontFamily: "'Orbitron', sans-serif",
          WebkitBackgroundClip: "text",
          textShadow:
            "0 0 15px rgba(127, 29, 29, 1), 0 0 10px rgba(127, 29, 29, 1)",
        }} className="text-3xl font-extrabold text-center mb-6 text-white drop-shadow-lg">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white/90">
              College Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full h-[45px] px-4 py-2 rounded-xl bg-white/30 text-white placeholder-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="yourname@akgec.ac.in"
            />
            {errors.email && (
              <p className="text-red-300 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-white/90">
              Password
            </label>

            <div className="relative mt-1">
              <input
                type={showpassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 h-[45px] pr-10 rounded-xl bg-white/30 text-white placeholder-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="••••••"
              />


              <div
                onClick={() => setShowPassword(!showpassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-white/80"
              >
                {showpassword ? <EyeIcon /> : <EyeClosed />}
              </div>
            </div>

            {errors.password && (
              <p className="text-red-300 text-sm">{errors.password}</p>
            )}
            <div onClick={() => router.push("/forgotpassword")} className="p hover:-translate-x-1.5 transition-all ease-in-out duration-200 hover:opacity-45 text-sm cursor-pointer text-white/80 font-semibold w-full flex justify-end">
              Forgot Password
            </div>

          </div>


          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl cursor-pointer font-semibold bg-gradient-to-l from-white/20 via-red-950 to-white/10 border-1 border-white/10 text-white hover:opacity-90 transition disabled:opacity-50 shadow-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Logout button (for testing) */}
        {/* {role && (
          <button
            onClick={handleLogout}
            className="mt-4 w-full py-2 rounded-xl cursor-pointer font-semibold bg-red-500 text-white hover:opacity-90 transition shadow-lg"
          >
            Logout ({role})
          </button>
        )} */}
      </div>


      <AnimatePresence>
        {messagePopup && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 mt-20 w-[90%] max-w-sm bg-gradient-to-b from-black via-gray-900 to-red-900 border border-red-800 rounded-2xl p-6 shadow-2xl text-center"
              initial={{ scale: 0.8, opacity: 0, y: -30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -30 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <h2 className="text-xl font-bold text-white mb-3">Account Inactive</h2>
              <p className="text-gray-200 text-sm mb-6">
                Your probation status is <span className="text-red-400 font-semibold">inactive</span>.
                To reopen your account, please contact the admin.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push("/Help")}
                  className="px-5 py-2 rounded-xl cursor-pointer bg-red-700 hover:bg-red-800 text-white font-semibold shadow-md transition"
                >
                  Contact Admin
                </button>
                <button
                  onClick={() => setMessagePopup(false)}
                  className="px-5 py-2 cursor-pointer rounded-xl bg-gray-700 hover:bg-gray-800 text-gray-100 font-medium shadow-md transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>

          </>
        )}
      </AnimatePresence>
    </div>
  );
}
