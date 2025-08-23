"use client";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function UploadTaskForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    github: "",
    deploy: "",
  });

  // handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId"); // 👈 take userId from localStorage
      if (!userId) {
        toast.error("User not logged in!");
        return;
      }

      const response = await axios.post("/api/Dashboard_Students/submittask", {
        ...formData,
        uploadedBy: userId,
      });

      toast.success("Task uploaded successfully!");
      console.log(response.data);

      setFormData({ title: "", description: "", github: "", deploy: "" }); // reset form
    } catch (error) {
      console.error(error);
      toast.error(" Failed to upload task. Try again!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center backdrop-blur-2xl p-6">
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-2xl p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-white/20"
      >
        <h2
          style={{
            fontFamily: "'Orbitron', sans-serif",
            WebkitBackgroundClip: "text",
            textShadow:
              "0 0 15px rgba(127, 29, 29, 1), 0 0 30px rgba(127, 29, 29, 1)",
          }}
          className="text-3xl font-extrabold text-center text-white mb-8"
        >
          Upload Your Task
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-3 mb-5 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-800 transition"
        />

        <textarea
          name="description"
          placeholder="Task Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full p-3 mb-5 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-800 transition"
        ></textarea>

        <input
          type="url"
          name="github"
          placeholder="GitHub Repository Link"
          value={formData.github}
          onChange={handleChange}
          required
          className="w-full p-3 mb-5 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-800 transition"
        />

        <input
          type="url"
          name="deploy"
          placeholder="Deployment Link"
          value={formData.deploy}
          onChange={handleChange}
          required
          className="w-full p-3 mb-8 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-800 transition"
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-red-900/50 transition-all"
        >
          Submit Task
        </button>
      </form>
    </div>
  );
}
