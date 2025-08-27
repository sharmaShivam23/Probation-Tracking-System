
"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const branches = [
  "CSE",
  "CSE(AIML)",
  "CSE(DS)",
  "CSE(Hindi)",
  "CS",
  "IT",
  "CSIT",
  "ECE",
  "Mechanical",
  "Civil",
];

const domains = [
  "Frontend Development",
  "Backend Development",
  "App Development",
  "UI/UX Designing",
  "Cloud Computing",
  "Video Editing",
  "Other",
];



export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"Student" | "Admin" | "">("Student");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    rollNo: "",
    branch: "",
    github: "",
    domain: "",
    password: "",
    code: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRole = (selectedRole: "Student" | "Admin") => {
    setRole(selectedRole);
    setFormData({ ...formData, role: selectedRole });
    setErrors({ ...errors, role: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  function validate() {
    const newErrors: Record<string, string> = {};
    let valid = true;

    // if (!formData.role) {
    //   newErrors.role = "Role is required";
    //   valid = false;
    // }

    if (!formData.role) {
      newErrors.role = "Role is required";
      valid = false;
    } else if (!["Student", "Admin"].includes(formData.role)) {
      newErrors.role = "Invalid role";
      valid = false;
    }

    if (!formData.name) {
      newErrors.name = "Name is required";
      valid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = "Name must contain only alphabets";
      valid = false;
    }
    // if (!formData.email) {
    //   newErrors.email = "Email is required";
    //   valid = false;
    // } else if (!formData.email.endsWith("@akgec.ac.in")) {
    //   newErrors.email = "Email must end with @akgec.ac.in";
    //   valid = false;
    // }

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!formData.email.endsWith("@akgec.ac.in")) {
      newErrors.email = "Email must end with @akgec.ac.in";
      valid = false;
    } else {
      // role-based validation
      if (formData.role === "Admin" && !formData.email.match(/^[a-zA-Z0-9._%+-]+23\d{5,6}@akgec\.ac\.in$/)) {
        newErrors.email = "Admin email must contain 23 batch year";
        valid = false;
      } else if (formData.role === "Student" && !formData.email.match(/^[a-zA-Z0-9._%+-]+24\d{5,6}@akgec\.ac\.in$/)) {
        newErrors.email = "Student email must contain 24 batch year";
        valid = false;
      }
    }


    if (!formData.rollNo) {
      newErrors.rollNo = "Roll number is required";
      valid = false;
    } else if (
      (role === "Admin" && !formData.rollNo.startsWith("23")) ||
      (role === "Student" && !formData.rollNo.startsWith("24"))
    ) {
      newErrors.rollNo =
        role === "Admin"
          ? "Admin roll number must start with 23"
          : "Student roll number must start with 24";
      valid = false;
    }

    if (!formData.branch) {
      newErrors.branch = "Branch is required";
      valid = false;
    }
    if (role === "Student") {
      if (!formData.domain) {
        newErrors.domain = "Domain is required";
        valid = false;
      }
      if (!formData.github) {
        newErrors.github = "GitHub profile is required";
        valid = false;
      }
      else if (!/^https:\/\/github\.com\/[A-Za-z0-9-]{1,39}$/.test(formData.github)) {
        newErrors.github = "Invalid GitHub URL";
        valid = false;
      }
    }

    const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+?])[A-Za-z\d!@#$%^&*()_+?]{7,}$/;
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!passReg.test(formData.password)) {
      newErrors.password =
        "Password must contain at least 7 characters with uppercase, lowercase, number, and special character";
      valid = false;
    }

    if (role === "Admin" && !formData.code) {
      newErrors.code = "Security code is required for admin";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        role === "Student" ? "/api/auth/register" : "/api/auth/registerAdmin";

      const res = await axios.post(endpoint, formData);

      if (res.data.success) {
        toast.success("Registration successful!");
        router.push("/login");
        setFormData({
          role: "",
          name: "",
          email: "",
          rollNo: "",
          branch: "",
          github: "",
          domain: "",
          password: "",
          code: "",
        });
        setRole("");
      } else {
        toast.error(res.data.message || "Registration failed");
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

  return (
    <>
      <div className="flex flex-col overflow-y-hidden relative lg:flex-row min-h-screen bg-gradient-to-b from-gray-900 via-black to-red-900 text-white">
        <Toaster />
        {/* <div className="p absolute top-0 w-full"> */}
        {/* <Particles/> */}
        {/* </div> */}
        {/* Left Section */}


        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className=" w-1/2 mt-20   justify-center"
        >
          <h3 className="text-center text-3xl font-bold">
            Join the millions learning <br /> to code with StudyNotion for free
          </h3>
          <Image
            src="/r.avif"
            width={400}
            height={300}
            className="h m-auto mt-6 w-full bg-cover max-w-md shadow-xl"
            alt="register"
          />
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="flex-1 flex items-center mb-10 justify-center p-6"
        >
          <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-white/20">
            <h1 style={{
              fontFamily: "'Orbitron', sans-serif",
              WebkitBackgroundClip: "text",
              textShadow:
                "0 0 15px rgba(70,15,14,1), 0 0 30px rgba(99,102,241,0.5)",
            }}
              className="text-3xl font-extrabold text-center mb-6 drop-shadow-lg">
              Create your account
            </h1>

            {/* rgba(70, 15, 14, 1) */}


            {/* Role Selector */}
            <div className="flex justify-center mb-2 items-center">
              <div className="flex gap-6 bg-white/10 px-8 py-2 rounded-2xl">
                {["Student", "Admin"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRole(r as "Student" | "Admin")}
                    className={`px-4 cursor-pointer py-1 rounded-xl transition ${role === r
                      ? "bg-[#460F0E] text-white scale-105"
                      : "bg-white/30 text-gray-800 hover:bg-white/40"
                      }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            {errors.role && (
              <p className="text-red-300 text-sm text-center">{errors.role}</p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 h-[45px] rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-300 text-sm">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium">College Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 h-[45px] rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="yourname@akgec.ac.in"
                />
                {errors.email && (
                  <p className="text-red-300 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Roll & Branch */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="sm:w-1/2">
                  <label className="block text-sm font-medium">Roll Number</label>
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 h-[45px] rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="24IT101"
                  />
                  {errors.rollNo && (
                    <p className="text-red-300 text-sm">{errors.rollNo}</p>
                  )}
                </div>

                <div className="sm:w-1/2">
                  <label className="block text-sm font-medium">Branch</label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="mt-1 w-full h-[45px] px-4 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch, idx) => (
                      <option key={idx} value={branch} className="text-black">
                        {branch}
                      </option>
                    ))}
                  </select>
                  {errors.branch && (
                    <p className="text-red-300 text-sm">{errors.branch}</p>
                  )}
                </div>
              </div>

              {/* Domain + GitHub */}
              {role === "Student" && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="sm:w-1/2">
                    <label className="block text-sm font-medium">Domain</label>
                    <select
                      name="domain"
                      value={formData.domain}
                      onChange={handleChange}
                      className="mt-1 w-full h-[45px] px-4 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="">Select Domain</option>
                      {domains.map((domain, idx) => (
                        <option key={idx} value={domain} className="text-black">
                          {domain}
                        </option>
                      ))}
                    </select>
                    {errors.domain && (
                      <p className="text-red-300 text-sm">{errors.domain}</p>
                    )}
                  </div>

                  <div className="sm:w-1/2">
                    <label className="block text-sm font-medium">
                      GitHub Profile
                    </label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 h-[45px] rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="https://github.com/username"
                    />
                    {errors.github && (
                      <p className="text-red-300 text-sm">{errors.github}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 h-[45px] rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="••••••"
                />
                {errors.password && (
                  <p className="text-red-300 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Admin Security Code */}
              {role === "Admin" && (
                <div>
                  <label className="block text-sm font-medium">
                    Security Code
                  </label>
                  <input
                    type="password"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 h-[45px] rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="••••••"
                  />
                  {errors.code && (
                    <p className="text-red-300 text-sm">{errors.code}</p>
                  )}
                </div>
              )}

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl cursor-pointer mt-3 h-[45px] font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:opacity-90 transition disabled:opacity-50 shadow-lg"
              >
                {loading ? "Registering..." : "Register"}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}
