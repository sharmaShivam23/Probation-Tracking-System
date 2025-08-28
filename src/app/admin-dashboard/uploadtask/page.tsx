
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function TaskForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    deadline: "",
    category: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // modal state
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    
    
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

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
    // required validation (link is optional)
    if (
      !formData.title ||
      !formData.description ||
      !formData.deadline ||
      !formData.category ||
      !formData.link
    ) {
      alert("All fields except file are required!");
      return;
    }


    setShowVerifyModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("You must be logged in.");
      return;
    }
    if (!code.trim()) {
      toast.error("Security code is required.");
      return;
    }

     if(code != process.env.NEXT_PUBLIC_SECURITY_CODE_FILE){
      toast.error("Invalid Code");
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("link", formData.link);
      data.append("deadline", formData.deadline);
      data.append("category", formData.category);
      if (file) data.append("file", file);
      data.append("code", code);

      const res = await axios.post("/api/Dashboard_Admin/uploadTask", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Task uploaded successfully!");
      console.log(res.data);

      setFormData({
        title: "",
        description: "",
        link: "",
        deadline: "",
        category: "",
      });
      setFile(null);
      setCode("");
      setShowVerifyModal(false);
    } catch (err) {
      console.error(err);
      alert("Error uploading task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto mt-10 mb-10 p-3 sm:p-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl space-y-5 text-white transition-transform hover:scale-[1.02]"
      >
        <h2 className="text-2xl text-center bg-gradient-to-r text-white font-bold bg-clip-text ">
          Upload Task
        </h2>

        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Task Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        {/* Link (optional) */}
        <input
          type="url"
          name="link"
          placeholder="Reference Link (Optional)"
          value={formData.link}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Category */}
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
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

        {/* Deadline */}
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {/* File Upload */}
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          required
          className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 file:bg-red-900 file:text-white file:rounded-lg file:px-4 file:py-2"
        />

        {/* Verify Button */}
        <button
          type="button"
          onClick={handleVerifyClick}
          disabled={loading}
          className="w-full py-3 rounded-xl cursor-pointer bg-gradient-to-r from-black to-red-900 text-white font-semibold shadow-lg transform transition hover:scale-105 hover:shadow-2xl"
        >
          {loading ? "Processing..." : "Verify"}
        </button>
      </form>

      {/* Popup Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
          <div className="bg-gradient-to-br from-white/20 to-white/5 border border-white/30 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl text-white w-96 transform scale-95 animate-[fadeIn_0.2s_ease-out_forwards]">
            <h3 className="text-2xl font-bold mb-6 text-center">🔒 Verify Task</h3>
            <input
              type="text"
              placeholder="Enter Security Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-3 mb-5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
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
