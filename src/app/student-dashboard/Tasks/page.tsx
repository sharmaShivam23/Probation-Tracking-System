"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Github, Globe } from "lucide-react"; // icons
import toast from "react-hot-toast";
interface Task {
  _id: string;
  title: string;
  description: string;
  github?: string;
  deploy?: string;
  createdAt: string;
}

interface User {
  name: string;
  uploadedTasks: Task[];
}

export default function UserTasks() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchUserTasks = async () => {
  //     try {
  //       const userId = localStorage.getItem("userId");
  //       if (!userId) {
  //         console.error("User not logged in");
  //         return;
  //       }

  //       const response = await axios.post(
  //         "/api/Dashboard_Students/uplodedtasks",
  //         { id: userId }
  //       );

  //       if (response?.data?.success) {
  //         setUser(response.data.user);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch user tasks:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserTasks();
  // }, []);

useEffect(() => {
  const fetchUserTasks = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("User not logged in ❌");
        return;
      }

      const response = await axios.post(
        "/api/Dashboard_Students/uplodedtasks",
        { id: userId }
      );

      if (response?.data?.success) {
        setUser(response.data.user);
        toast.success("User tasks fetched successfully ✅");
      } else {
        toast.error(response?.data?.message || "Failed to fetch user tasks ❌");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong 🚨");
      console.error("Failed to fetch user tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUserTasks();
}, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <Loader2 className="animate-spin w-8 h-8 mr-3" />
        Loading tasks...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-400 text-lg font-semibold">
        No user data found 
      </div>
    );
  }

  return (
    <div className="min-h-screen  to-red-950 sm:p-8">
      {/* Title */}
      {/* <h1
        style={{
            fontFamily: "'Orbitron', sans-serif",
            WebkitBackgroundClip: "text",
            textShadow:
              "0 0 15px rgba(127, 29, 29, 1), 0 0 10px rgba(127, 29, 29, 1)",
          }}
        className="text-5xl font-extrabold text-center  text-white mb-14 drop-shadow-lg"
      >
        {user.name}'s Uploaded Tasks
      </h1> */}
<h1
  style={{
    fontFamily: "'Orbitron', sans-serif",
    WebkitBackgroundClip: "text",
    textShadow:
      "0 0 15px rgba(127, 29, 29, 1), 0 0 10px rgba(127, 29, 29, 1)",
  }}
  className="text-5xl font-extrabold text-center  text-white mb-14 drop-shadow-lg"
>
  {user.name}&apos;s Uploaded Tasks
</h1>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {user.uploadedTasks?.length > 0 ? (
          user.uploadedTasks.map((task: Task) => (
            <div
              key={task._id}
              className="group relative bg-white/5 backdrop-blur-lg p-6 rounded-2xl shadow-[0_0_20px_rgba(255,0,0,0.3)] border border-red-500/30 hover:border-red-400 transition-all duration-300 hover:scale-[1.05]"
            >
          
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 blur-2xl transition duration-500"></div>

              <h2 className="text-2xl font-bold text-white mb-3 relative z-10">
                {task.title}
              </h2>

              <p className="text-gray-300 text-sm mb-5 relative z-10">
                {task.description.length > 120
                  ? task.description.slice(0, 120) + "..."
                  : task.description}
              </p>

              <div className="flex flex-col gap-3 relative z-10">
                {task.github && (
                  <a
                    href={task.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-red-300 hover:text-red-100 transition-colors"
                  >
                    <Github size={18} /> GitHub Repo
                  </a>
                )}
                {task.deploy && (
                  <a
                    href={task.deploy}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-red-300 hover:text-red-100 transition-colors"
                  >
                    <Globe size={18} /> Live Deployment
                  </a>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-6 relative z-10">
                Uploaded on: {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-full text-lg font-medium">
            🚀 No tasks uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
}
