"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/middleware/DecodeToken";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userRole = getUserRole(token);
      setRole(userRole);
    }
  }, []);

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
    } else if (!formData.email.endsWith("@akgec.ac.in")) {
      newErrors.email = "Email must end with @akgec.ac.in";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      const res = await axios.post("/api/auth/login", formData);

      if (res?.data?.success) {
        toast.success("Login successful!");

        const token = res.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", res.data.payload.id);

        const userRole = getUserRole(token);
        setRole(userRole);


        if (userRole === "Admin") {
          router.push("/Dashboard");
        } else if (userRole === "Student") {
          router.push("/Dashboard-Students");
        } else {
          toast.error("Invalid role");
        }

        setFormData({ email: "", password: "" });
      } else {
        toast.error(res?.data?.message || "Login failed");
      }
    } catch (error: unknown) {
      console.log(error);
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as any).response?.data?.message
        : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout clears token & role
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setRole(null);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-[#460F0E] text-white p-6">
      <Toaster />

      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/30">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-white drop-shadow-lg">
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
              className="mt-1 w-full px-4 py-2 rounded-xl bg-white/30 text-white placeholder-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl bg-white/30 text-white placeholder-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="••••••"
            />
            {errors.password && (
              <p className="text-red-300 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:opacity-90 transition disabled:opacity-50 shadow-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Logout button (for testing) */}
        {role && (
          <button
            onClick={handleLogout}
            className="mt-4 w-full py-2 rounded-xl font-semibold bg-red-500 text-white hover:opacity-90 transition shadow-lg"
          >
            Logout ({role})
          </button>
        )}
      </div>
    </div>
  );
}
