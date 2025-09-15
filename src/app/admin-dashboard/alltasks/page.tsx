

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading2";
import toast from "react-hot-toast";
interface Task {
  _id: string;
  title: string;
  description: string;
  category?: string;
  deadline?: string;
  score?: number;
  uploadedBy?: { name?: string; email?: string };
  createdAt?: string;
  file?: string;
  link?: string;
}

export default function AllTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>("All"); 

useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get<{ success: boolean; tasks: Task[] }>(
          "/api/Dashboard_Admin/uploadTask"
        );

        if (res?.data?.success) {
          setTasks(res.data.tasks || []);
          setAllTasks(res.data.tasks || []);
          toast.success("Fetched tasks successfully");
        } else {
          toast.error("Failed to fetch tasks");
        }
      } catch (error: any) {
        // console.error("Error fetching tasks:", error);

        
        if (error?.response) {
          
          toast.error(error.response.data?.message || "Server error occurred");
        } else if (error.request) {
          
          toast.error("No response from server. Please try again later.");
        } else {
          
          toast.error("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);
  function handleFilter(category: string) {
    setActiveFilter(category);
    if (category === "All") {
      setTasks(allTasks);
    } else {
      const filtered = allTasks.filter((task) => task.category === category);
      setTasks(filtered);
    }
  }

  const categories = [
    "All",
   
     "Frontend Task",
      "Backend Task",
      "UI/UX Task",
      "Cloud Computing Task",
      "App Development Task",
      "Video Editing Task"
  ];

  return (
    <div className="sm:p-6 mb-5 max-w-7xl mx-auto">
      {/* Heading */}
      <h1 
        style={{
            fontFamily: "'Orbitron', sans-serif",
            WebkitBackgroundClip: "text",
            textShadow:
              "0 0 15px rgba(127, 29, 29, 1), 0 0 10px rgba(127, 29, 29, 1)",
          }}
      className="text-5xl font-extrabold text-white text-center  drop-shadow-lg">
        All Tasks
      </h1>
      <p className="mt-2 text-center text-gray-300">
        Check all the tasks and track your performance score.
      </p>

    
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {categories.map((value, index) => (
          <button
            key={index}
            onClick={() => handleFilter(value)}
            className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all duration-300 ${
              activeFilter === value
                ? "bg-gradient-to-r from-red-900 to-red-950 text-white shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

  
      {loading ? (
        <div className="mt-8 text-center text-gray-400 animate-pulse">
          <Loading />
        </div>
      ) : tasks.length === 0 ? (
        <p className="mt-8 text-center text-gray-400">No tasks available.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task , index) => (
            <div
              key={index}
              className="group relative rounded-2xl p-6 bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg 
                         hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out"
            >
          
              {/* <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-xl transition duration-500"></div> */}

          
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-white">
                  {task?.title || "Untitled Task"}
                </h2>
                <p className="text-sm text-gray-300 mt-1">
                  By {task?.uploadedBy?.name || "Unknown"} (
                  {task?.uploadedBy?.email || "No Email"})
                </p>

        
                {task?.file && (
                  <a
                    href={task.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-2xl text-white font-medium shadow-md hover:shadow-lg transition"
                  >
                    📄 View PDF
                  </a>
                )}
                
                {task?.link && (
                  <a
                    href={task.link}
                    target="_blank"
                    className="inline-block mt-4 ml-3 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-2xl text-white font-medium shadow-md hover:shadow-lg transition"
                  >
                    📄 View  Link
                  </a>
                )}


               <p className="mt-4 text-gray-200 break-words whitespace-pre-line flex-grow">
      {task?.description || "No description provided."}
    </p>


          
                <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
                  <span className="px-3 py-1 rounded-full bg-red-900/10 text-white font-medium">
                    {task?.category || "General"}
                  </span>
                  {task?.createdAt && (
                    <span className="text-gray-400">
                      📅 Uploaded {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  )}
                  {task?.deadline && (
                    <span className="text-red-400 font-medium">
                      ⏳ Deadline {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
