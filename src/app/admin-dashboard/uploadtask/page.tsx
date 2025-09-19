"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";

export default function TaskForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    deadline: "",
    category: "",
    recaptchaValue: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const reset = useRef<ReCAPTCHA | null>(null);


  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const handleRecaptchaChange = (value: string | null) => {
    // console.log(value);
    
    setFormData((prev) => ({ ...prev, recaptchaValue: value || "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerifyClick = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.deadline ||
      !formData.category
    ) {
      toast.error("All fields except file are required!");
      return;
    }
    // if (!formData.recaptchaValue) {
    //   toast.error("Please complete the ReCAPTCHA verification first!");
    //   return;
    // }
    setShowVerifyModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }
    if (!code.trim()) {
      toast.error("Security code is required.");
      return;
    }

    // if (code !== process.env.NEXT_PUBLIC_SECURITY_CODE_FILE) {
    //   toast.error("Invalid Code");
    //   return;
    // }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData?.title);
      data.append("description", formData?.description);
      data.append("link", formData?.link);
      data.append("deadline", formData?.deadline);
      data.append("category", formData?.category);
      if (file) data.append("file", file);
      data.append("code", code);

      
      if (formData?.recaptchaValue) {
        data.append("recaptchaValue", formData.recaptchaValue);
      }

      await axios.post("/api/Dashboard_Admin/uploadTask", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Task uploaded successfully!");

      setFormData({
        title: "",
        description: "",
        link: "",
        deadline: "",
        category: "",
        recaptchaValue: "",
      });
      if (reset.current) reset.current.reset();
      setFile(null);
      setCode("");
      setShowVerifyModal(false);
    } catch (err: any) {
      // console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Error uploading task.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto mt-10 mb-10 p-4  sm:p-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl space-y-5 text-white transition-transform hover:scale-[1.02]"
      >
        <h2
          style={{
            fontFamily: "'Orbitron', sans-serif",
            WebkitBackgroundClip: "text",
            textShadow:
              "0 0 15px rgba(127, 29, 29, 1), 0 0 10px rgba(127, 29, 29, 1)",
          }}
          className="text-2xl text-center bg-gradient-to-r text-white font-bold bg-clip-text "
        >
          Upload Task
        </h2>
        <p className="text-sm text-center">
          You are able to upload only 3 tasks per day
        </p>

        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">
            Task Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            placeholder="Enter task description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Link */}
        <div>
          <label className="block mb-1 font-medium">
            Drive Link <span className="text-red-500">*</span>{" "}
          </label>
          <input
            type="url"
            name="link"
            placeholder="Enter drive link"
            value={formData.link}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/10"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-red-900"
          >
            <option value="" className="text-black">
              -- Select a Category --
            </option>
            <option value="Frontend Task" className="text-black">
              Frontend Task
            </option>
            <option value="Backend Task" className="text-black">
              Backend Task
            </option>
            <option value="UI/UX Task" className="text-black">
              UI/UX Task
            </option>
            <option value="Machine Learning Task" className="text-black">
              Machine Learning Task
            </option>
            <option value="Cloud Computing Task" className="text-black">
              Cloud Computing Task
            </option>
            <option value="App Development Task" className="text-black">
              App Development Task
            </option>
            <option value="Video Editing Task" className="text-black">
              Video Editing Task
            </option>
          </select>
        </div>

        {/* Deadline */}
        <div>
          <label className="block mb-1 font-medium">
            Deadline <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block mb-1 font-medium">Upload File (optional)</label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white file:bg-red-900 file:text-white file:rounded-lg file:px-4 file:py-2"
          />
        </div>

        {/* Verify Button */}
        <button
          type="button"
          onClick={handleVerifyClick}
          disabled={loading}
          className="w-full py-3 rounded-xl border-1 border-white/20 cursor-pointer bg-gradient-to-l from-white/20 via-red-950 to-white/10 text-white font-semibold shadow-lg transform transition hover:scale-105 hover:shadow-2xl"
        >
          {loading ? "Processing..." : "Verify"}
        </button>
      </form>

      {/* Popup Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50">
          <div className="bg-gradient-to-br from-white/20 to-white/5 border border-white/30 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl text-white w-96 transform scale-95 animate-[fadeIn_0.2s_ease-out_forwards]">
            <h3 className="text-2xl font-bold mb-6 text-center">🔒 Verify Task</h3>
            <input
              type="text"
              placeholder="Enter Security Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-3 mb-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <div className="block gap-2 mt-2 mb-2 cursor-pointer w-full">
              <div className="flex justify-center items-center z-50">
                <ReCAPTCHA
                  sitekey="6Le3-QArAAAAADn9ym4vDs6qMQN3DpD0yZe183m-"
                  onChange={handleRecaptchaChange}
                  theme="dark"
                  className="cursor-pointer g-recaptcha"
                  ref={reset}
                />
              </div>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 cursor-pointer rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg transform transition hover:scale-105 hover:shadow-2xl"
            >
              {loading ? "Submitting..." : "Submit Task"}
            </button>
            <button
              type="button"
              onClick={() => setShowVerifyModal(false)}
              className="mt-4 w-full py-2 cursor-pointer rounded-xl bg-gray-700/80 text-white hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
