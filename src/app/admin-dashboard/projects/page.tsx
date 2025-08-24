"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Globe, User, Mail, Briefcase } from "lucide-react";

interface SubmittedTask {
  _id: string;
  title: string;
  description: string;
  github?: string;
  deploy?: string;
  uploadedBy: {
    name: string;
    email: string;
    domain: string;
  };
  createdAt: string;
}

export default function ProjectsPage() {
  const [submittedTasks, setSubmittedTasks] = useState<SubmittedTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<SubmittedTask[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");

  const categories = [
    "Frontend development",
    "Backend development",
    "App development",
    "UI/UX designing",
    "Cloud Computing",
    "video Editor",
    "other",
  ];

  const handleCat = (cat: string) => {
    setActiveCategory(cat);
    if (cat === "") {
      setFilteredTasks(submittedTasks);
    } else {
      const filtered = submittedTasks.filter(
        (task) => task.uploadedBy.domain === cat
      );
      setFilteredTasks(filtered);
    }
  };

  useEffect(() => {
    async function getSubmittedTasks() {
      try {
        const res = await axios.get("/api/Dashboard_Admin/submittedTasks");
        setSubmittedTasks(res?.data?.Submittedtasks || []);
        setFilteredTasks(res?.data?.Submittedtasks || []);
      } catch (err) {
        console.log(err);
      }
    }
    getSubmittedTasks();
  }, []);

  return (
    <div className="p-6 min-h-screen text-white">
      <h1
        style={{
          fontFamily: "'Orbitron', sans-serif",
          WebkitBackgroundClip: "text",
          textShadow:
            "0 0 15px rgba(127, 29, 29, 1), 0 0 30px rgba(127, 29, 29, 1)",
        }}
        className="text-4xl font-bold text-center mb-10"
      >
        Submitted Projects
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((cat, index) => (
          <button
            key={index}
            onClick={() => handleCat(cat)}
            className={`px-4 py-2 rounded-xl border ${activeCategory === cat
                ? "bg-red-900 border-red-900"
                : "bg-white/10 border-white/20"
              } hover:bg-red-900 transition`}
          >
            {cat}
          </button>
        ))}
        <button
          onClick={() => handleCat("")}
          className={`px-4 py-2 rounded-xl border ${activeCategory === ""
              ? "bg-red-900 border-red-900"
              : "bg-white/10 border-white/20"
            } hover:bg-red-900 transition`}
        >
          All
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No submitted tasks found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative p-6 rounded-2xl shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:scale-[1.03] transition-transform"
            >
              <h2 className="text-2xl font-semibold mb-3 text-yellow-300">
                {task.title}
              </h2>
              <p className="text-gray-200 text-sm mb-4">{task.description}</p>

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <User size={16} className="text-blue-400" /> {task.uploadedBy.name}
                </p>
                <p className="flex items-center gap-2">
                  <Briefcase size={16} className="text-purple-400" /> {task.uploadedBy.domain}
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-pink-400" /> {task.uploadedBy.email}
                </p>
                <p className="text-gray-400 text-xs">
                  Uploaded At: {new Date(task.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="mt-4 flex gap-4">
                {task.github && (
                  <a
                    href={task.github}
                    target="_blank"
                    className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition"
                  >
                    <Github size={18} /> GitHub
                  </a>
                )}
                {task.deploy && (
                  <a
                    href={task.deploy}
                    target="_blank"
                    className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition"
                  >
                    <Globe size={18} /> Live
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
