


// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import Loading from "@/components/Loading2";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";

// interface Task {
//   _id: string;
//   title: string;
//   description: string;
//   category?: string;
//   deadline?: string;
//   score?: number;
//   uploadedBy?: { name?: string; email?: string };
//   createdAt?: string;
//   file?: string;
//   link?: string;
// }

// export default function AllTasks() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [allTasks, setAllTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [activeFilter, setActiveFilter] = useState<string>("All");
//   const router = useRouter();

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const res = await axios.get<{ success: boolean; tasks: Task[] }>(
//           "/api/Dashboard_Admin/uploadTask"
//         );

//         if (res?.data?.success) {
//           setTasks(res.data.tasks || []);
//           setAllTasks(res.data.tasks || []);
//           toast.success("Fetched tasks successfully");
//         } else {
//           toast.error("Failed to fetch tasks");
//         }
//       } catch (error: any) {
//         if (error?.response) {
//           toast.error(error.response.data?.message || "Server error occurred");
//         } else if (error.request) {
//           toast.error("No response from server. Please try again later.");
//         } else {
//           toast.error("An unexpected error occurred");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, []);

  
// function useCountdown(deadline: string) {
//   const [timeLeft, setTimeLeft] = useState("");

//   useEffect(() => {
//     const deadlineDate = new Date(deadline);
//     deadlineDate.setHours(23, 59, 59, 999); 

//     const interval = setInterval(() => {
//       const now = new Date().getTime();
//       const diff = deadlineDate.getTime() - now;

//       if (diff <= 0) {
//         setTimeLeft("Deadline Passed");
//         clearInterval(interval);
//       } else {
//         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//         const hours = Math.floor(
//           (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//         );
//         const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((diff % (1000 * 60)) / 1000);

//         setTimeLeft(
//           `${days}d ${hours}h ${minutes}m ${seconds}s`
//         );
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [deadline]);

//   return timeLeft;
// }

//   function handleFilter(category: string) {
//     setActiveFilter(category);
//     if (category === "All") {
//       setTasks(allTasks);
//     } else {
//       const filtered = allTasks.filter((task) => task.category === category);
//       setTasks(filtered);
//     }
//   }

//   const categoryColors: Record<string, string> = {
//     All: "bg-red-900 text-white",
//     "Frontend Task": "bg-red-900 text-white",
//     "Backend Task": "bg-white/20 text-white",
//     "UI/UX Task": "bg-purple-900 text-white",
//     "Cloud Computing Task": "bg-yellow-900 text-white",
//     "App Development Task": "bg-pink-900 text-white",
//     "Video Editing Task": "bg-indigo-900 text-white",
//     General: "bg-green-500 text-white",
//   };

//   const categories = [
//     "All",
//     "Frontend Task",
//     "Backend Task",
//     "UI/UX Task",
//     "Machine Learning Task",
//     "Cloud Computing Task",
//     "App Development Task",
//     "Video Editing Task",
//   ];

//   return (
//     <div className="sm:p-6 mb-5 max-w-7xl mx-auto">
//       <h1
//         style={{
//           fontFamily: "'Orbitron', sans-serif",
//           WebkitBackgroundClip: "text",
//           textShadow:
//             "0 0 15px rgba(127, 29, 29, 1), 0 0 10px rgba(127, 29, 29, 1)",
//         }}
//         className="text-5xl font-extrabold text-white text-center drop-shadow-lg"
//       >
//         All Tasks
//       </h1>
//       <p className="mt-2 text-center text-gray-300">
//         Check all the tasks here.
//       </p>

//       {/* Filter buttons */}
//       <div className="flex flex-wrap justify-center gap-3 mt-6">
//         {categories.map((value, index) => (
//           <button
//             key={index}
//             onClick={() => handleFilter(value)}
//             className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all duration-300 ${
//               activeFilter === value
//                 ? "bg-gradient-to-r from-red-900 to-red-950 text-white shadow-lg"
//                 : "bg-white/10 text-gray-300 hover:bg-white/20"
//             }`}
//           >
//             {value}
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <div className="mt-8 text-center text-gray-400 animate-pulse">
//           <Loading />
//         </div>
//       ) : tasks.length === 0 ? (
//         <p className="mt-8 text-center text-gray-400">No tasks available.</p>
//       ) : (
//         <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {tasks.map((task, index) => (
//             <div
//               key={index}
//               className="group relative rounded-2xl p-6 bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out"
//             >
//               <div className="relative z-10">
//                 <h2 className="text-xl font-semibold text-white">
//                   {task?.title || "Untitled Task"}
//                 </h2>
//                 <p className="text-sm text-gray-300 mt-1">
//                   By {task?.uploadedBy?.name || "Unknown"} (
//                   {task?.uploadedBy?.email || "No Email"})
//                 </p>

//                 {/* File Links */}
//                 {task?.file && (
//                   <a
//                     href={task.file}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-block mt-4 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-2xl text-white font-medium shadow-md hover:shadow-lg transition"
//                   >
//                     📄 View PDF
//                   </a>
//                 )}

//                 {task?.link && (
//                   <a
//                     href={task.link}
//                     target="_blank"
//                     className="inline-block mt-4 ml-3 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-2xl text-white font-medium shadow-md hover:shadow-lg transition"
//                   >
//                     🔗 View Link
//                   </a>
//                 )}

//                 <p className="mt-4 text-gray-200 line-clamp-3">
//                   {task?.description || "No description provided."}
//                 </p>

//                 {/* Tags */}
//                 <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
//                   <span
//                     className={`px-3 py-1 rounded-full font-medium ${
//                       categoryColors[task?.category || "General"] ||
//                       categoryColors["General"]
//                     }`}
//                   >
//                     {task?.category || "General"}
//                   </span>
//                   {task.createdAt && (
//                     <span className="text-gray-400">
//                       📅 Uploaded {new Date(task.createdAt).toLocaleDateString()}
//                     </span>
//                   )}
//                   {task.deadline && (
//                     <span className="text-red-400 font-medium">
//                       ⏳ Deadline {new Date(task.deadline).toLocaleDateString()}
//                     </span>
//                   )}
//                 </div>

          
//                 {/* <button
//                   onClick={() => router.push(`/student-dashboard/SubmitTask?taskId=${task?._id}&taskTitle=${encodeURIComponent(task?.title)}&category=${task?.category}`)}
//                   className="mt-5 w-full px-4 py-2 rounded-xl backdrop-blur-2xl cursor-pointer bg-white/20 t font-semibold shadow-lg hover:scale-105 transition-all duration-300"
//                 >
//                   Submit Task
//                 </button> */}
                
//                 {task.deadline && new Date(task.deadline) < new Date() ? (
//   <button
//     disabled
//     className="mt-5 w-full px-4 py-2 rounded-xl backdrop-blur-2xl cursor-not-allowed 
//                bg-gray-700 text-gray-400 font-semibold shadow-lg"
//   >
//     Deadline Passed
//   </button>
// ) : (
//   <button
//     onClick={() =>
//       router.push(
//         `/student-dashboard/SubmitTask?taskId=${task?._id}&taskTitle=${encodeURIComponent(
//           task?.title
//         )}&category=${task?.category}`
//       )
//     }
//     className="mt-5 w-full px-4 py-2 rounded-xl backdrop-blur-2xl cursor-pointer 
//                bg-white/20 text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300"
//   >
//     Submit Task
//   </button>
// )}

//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }





// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import Loading from "@/components/Loading2";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";

// interface Task {
//   _id: string;
//   title: string;
//   description: string;
//   category?: string;
//   deadline?: string;
//   score?: number;
//   uploadedBy?: { name?: string; email?: string };
//   createdAt?: string;
//   file?: string;
//   link?: string;
// }

// // -------------------------
// // Custom Hook: useCountdown
// // -------------------------
// function useCountdown(deadline: string) {
//   const [timeLeft, setTimeLeft] = useState("");

//   useEffect(() => {
//     if (!deadline) return;

//     const deadlineDate = new Date(deadline);
//     deadlineDate.setHours(23, 59, 59, 999); // Always close at 11:59 PM

//     const interval = setInterval(() => {
//       const now = new Date().getTime();
//       const diff = deadlineDate.getTime() - now;

//       if (diff <= 0) {
//         setTimeLeft("Deadline Passed");
//         clearInterval(interval);
//       } else {
//         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//         const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((diff % (1000 * 60)) / 1000);

//         setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [deadline]);

//   return timeLeft;
// }

// // -------------------------
// // Countdown Component
// // -------------------------
// function CountdownTimer({ deadline }: { deadline: string }) {
//   const timeLeft = useCountdown(deadline);
//   return (
//     <span className="text-red-400 font-medium block mt-2">
//       ⏳ {timeLeft}
//     </span>
//   );
// }

// // -------------------------
// // Main Component
// // -------------------------
// export default function AllTasks() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [allTasks, setAllTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [activeFilter, setActiveFilter] = useState<string>("All");
//   const router = useRouter();

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const res = await axios.get<{ success: boolean; tasks: Task[] }>(
//           "/api/Dashboard_Admin/uploadTask"
//         );

//         if (res?.data?.success) {
//           setTasks(res.data.tasks || []);
//           setAllTasks(res.data.tasks || []);
//           toast.success("Fetched tasks successfully");
//         } else {
//           toast.error("Failed to fetch tasks");
//         }
//       } catch (error: any) {
//         if (error?.response) {
//           toast.error(error.response.data?.message || "Server error occurred");
//         } else if (error.request) {
//           toast.error("No response from server. Please try again later.");
//         } else {
//           toast.error("An unexpected error occurred");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, []);

//   function handleFilter(category: string) {
//     setActiveFilter(category);
//     if (category === "All") {
//       setTasks(allTasks);
//     } else {
//       const filtered = allTasks.filter((task) => task.category === category);
//       setTasks(filtered);
//     }
//   }

//   const categories = [
//     "All",
//     "Frontend Task",
//     "Backend Task",
//     "UI/UX Task",
//     "Machine Learning Task",
//     "Cloud Computing Task",
//     "App Development Task",
//     "Video Editing Task",
//   ];

//   const categoryColors: Record<string, string> = {
//     All: "bg-red-900 text-white",
//     "Frontend Task": "bg-red-900 text-white",
//     "Backend Task": "bg-white/20 text-white",
//     "UI/UX Task": "bg-purple-900 text-white",
//     "Cloud Computing Task": "bg-yellow-900 text-white",
//     "App Development Task": "bg-pink-900 text-white",
//     "Video Editing Task": "bg-indigo-900 text-white",
//     General: "bg-green-500 text-white",
//   };

//   return (
//     <div className="sm:p-6 mb-5 max-w-7xl mx-auto">
//       <h1
//         style={{
//           fontFamily: "'Orbitron', sans-serif",
//           WebkitBackgroundClip: "text",
//           textShadow:
//             "0 0 15px rgba(127, 29, 29, 1), 0 0 10px rgba(127, 29, 29, 1)",
//         }}
//         className="text-5xl font-extrabold text-white text-center drop-shadow-lg"
//       >
//         All Tasks
//       </h1>
//       <p className="mt-2 text-center text-gray-300">
//         Check all the tasks here.
//       </p>

//       {/* Filter buttons */}
//       <div className="flex flex-wrap justify-center gap-3 mt-6">
//         {categories.map((value, index) => (
//           <button
//             key={index}
//             onClick={() => handleFilter(value)}
//             className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all duration-300 ${
//               activeFilter === value
//                 ? "bg-gradient-to-r from-red-900 to-red-950 text-white shadow-lg"
//                 : "bg-white/10 text-gray-300 hover:bg-white/20"
//             }`}
//           >
//             {value}
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <div className="mt-8 text-center text-gray-400 animate-pulse">
//           <Loading />
//         </div>
//       ) : tasks.length === 0 ? (
//         <p className="mt-8 text-center text-gray-400">No tasks available.</p>
//       ) : (
//         <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {tasks.map((task, index) => (
//             <div
//               key={index}
//               className="group relative rounded-2xl p-6 bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out"
//             >
//               <div className="relative z-10">
//                 <h2 className="text-xl font-semibold text-white">
//                   {task?.title || "Untitled Task"}
//                 </h2>
//                 <p className="text-sm text-gray-300 mt-1">
//                   By {task?.uploadedBy?.name || "Unknown"} (
//                   {task?.uploadedBy?.email || "No Email"})
//                 </p>

//                 {/* File Links */}
//                 {task?.file && (
//                   <a
//                     href={task.file}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-block mt-4 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-2xl text-white font-medium shadow-md hover:shadow-lg transition"
//                   >
//                     📄 View PDF
//                   </a>
//                 )}
//                 {task?.link && (
//                   <a
//                     href={task.link}
//                     target="_blank"
//                     className="inline-block mt-4 ml-3 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-2xl text-white font-medium shadow-md hover:shadow-lg transition"
//                   >
//                     🔗 View Link
//                   </a>
//                 )}

//                 <p className="mt-4 text-gray-200 line-clamp-3">
//                   {task?.description || "No description provided."}
//                 </p>

//                 {/* Tags */}
//                 <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
//                   <span
//                     className={`px-3 py-1 rounded-full font-medium ${
//                       categoryColors[task?.category || "General"] ||
//                       categoryColors["General"]
//                     }`}
//                   >
//                     {task?.category || "General"}
//                   </span>
//                   {task.createdAt && (
//                     <span className="text-green-500">
//                       📅 Uploaded {new Date(task.createdAt).toLocaleDateString()}
//                     </span>
//                   )}
//                   {task.deadline && (
//                     <>
//                       <span className="text-white">
//                         📅 Deadline {new Date(task.deadline).toLocaleDateString()}
//                       </span>
//                       <CountdownTimer deadline={task.deadline} />
//                     </>
//                   )}
//                 </div>

//                 {/* Submit Button */}
//                 {task.deadline && new Date(task?.deadline) < new Date() ? (
//                   <button
//                     disabled
//                     className="mt-5 w-full px-4 py-2 rounded-xl mb-2 backdrop-blur-2xl cursor-not-allowed 
//                                bg-gray-700 text-gray-400 font-semibold shadow-lg"
//                   >
//                     Deadline Passed
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() =>
//                       router.push(
//                         `/student-dashboard/SubmitTask?taskId=${task?._id}&taskTitle=${encodeURIComponent(
//                           task?.title
//                         )}&category=${task?.category}`
//                       )
//                     }
//                     className="mt-5 w-full px-4 py-2 rounded-xl backdrop-blur-2xl cursor-pointer 
//                                bg-white/20 text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300"
//                   >
//                     Submit Task
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading2";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
  const [countdowns, setCountdowns] = useState<Record<string, { timeLeft: string; passed: boolean }>>({});
  const router = useRouter();

  // Fetch tasks
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

  // Countdown updater
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns: Record<string, { timeLeft: string; passed: boolean }> = {};

      tasks.forEach((task) => {
        if (task.deadline) {
          const deadlineDate = new Date(task.deadline);
          deadlineDate.setHours(23, 59, 59, 999); // end of day
          const now = new Date().getTime();
          const diff = deadlineDate.getTime() - now;

          if (diff <= 0) {
            newCountdowns[task._id] = { timeLeft: "Deadline Passed", passed: true };
          } else {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            newCountdowns[task._id] = {
              timeLeft: `${days}d ${hours}h ${minutes}m ${seconds}s`,
              passed: false,
            };
          }
        }
      });

      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

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
    "Machine Learning Task",
    "Cloud Computing Task",
    "App Development Task",
    "Video Editing Task",
  ];

  const categoryColors: Record<string, string> = {
    All: "bg-red-900 text-white",
    "Frontend Task": "bg-red-900 text-white",
    "Backend Task": "bg-white/20 text-white",
    "UI/UX Task": "bg-purple-900 text-white",
    "Cloud Computing Task": "bg-yellow-900 text-white",
    "App Development Task": "bg-pink-900 text-white",
    "Video Editing Task": "bg-indigo-900 text-white",
    General: "bg-green-500 text-white",
  };

  return (
    <div className="sm:p-6 mb-5 max-w-7xl mx-auto">
      <h1
        style={{
          fontFamily: "'Orbitron', sans-serif",
          WebkitBackgroundClip: "text",
          textShadow: "0 0 15px rgba(127, 29, 29, 1), 0 0 10px rgba(127, 29, 29, 1)",
        }}
        className="text-5xl font-extrabold text-white text-center drop-shadow-lg"
      >
        All Tasks
      </h1>
      <p className="mt-2 text-center text-gray-300">Check all the tasks here.</p>

      {/* Filter buttons */}
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
          {tasks.map((task, index) => {
            const countdown = countdowns[task._id];

            return (
              <div
                key={index}
                className="group relative rounded-2xl p-6 bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out"
              >
                <div className="relative z-10">
                  <h2 className="text-xl font-semibold text-white">
                    {task?.title || "Untitled Task"}
                  </h2>
                  <p className="text-sm text-gray-300 mt-1">
                    By {task?.uploadedBy?.name || "Unknown"} ({task?.uploadedBy?.email || "No Email"})
                  </p>

                  {/* File Links */}
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
                      🔗 View Link
                    </a>
                  )}

                  <p className="mt-4 text-gray-200 line-clamp-3">
                    {task?.description || "No description provided."}
                  </p>

                  {/* Tags */}
                  <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full font-medium ${
                        categoryColors[task?.category || "General"] || categoryColors["General"]
                      }`}
                    >
                      {task?.category || "General"}
                    </span>
                    {task.createdAt && (
                      <span className="text-green-500">
                        📅 Uploaded {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    )}
                    {task.deadline && (
                      <>
                        <span className="text-white">
                          📅 Deadline {new Date(task.deadline).toLocaleDateString()}
                        </span>
                        <span className="text-red-400 font-medium block mt-2">
                          ⏳ {countdown ? countdown.timeLeft : "Loading..."}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Submit Button */}
                  {countdown?.passed ? (
                    <button
                      disabled
                      className="mt-5 w-full px-4 py-2 rounded-xl mb-2 backdrop-blur-2xl cursor-not-allowed 
                                 bg-gray-700 text-gray-400 font-semibold shadow-lg"
                    >
                      Deadline Passed
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        router.push(
                          `/student-dashboard/SubmitTask?taskId=${
                            task?._id
                          }&taskTitle=${encodeURIComponent(task?.title)}&category=${task?.category}`
                        )
                      }
                      className="mt-5 w-full px-4 py-2 rounded-xl backdrop-blur-2xl cursor-pointer 
                                 bg-white/20 text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Submit Task
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
