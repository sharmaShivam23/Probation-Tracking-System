


// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Loader2, Github, Globe } from "lucide-react"; // icons
// import {toast, Toaster} from "react-hot-toast";
// import { MdDelete } from "react-icons/md";
// import {motion, AnimatePresence} from "framer-motion";

// interface Task {
//   _id: string;
//   title: string;
//   description: string;
//   github?: string;
//   deploy?: string;
//   createdAt: string;
// }

// interface User {
//   name: string;
//   uploadedTasks: Task[];
// }

// export default function UserTasks() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [messageAlert, setMessageAlert] = useState(false);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);


//   useEffect(() => {

//     const fetchUserTasks = async () => {
//       try {
//         const response = await axios.post("/api/Dashboard_Students/uplodedtasks", {}, {
//           withCredentials: true
//         });
//         // console.log(response);


//         if (response?.data?.success) {
//           setUser(response.data.user);
//           toast.success("User tasks fetched successfully ");
//         } else {
//           toast.error(response?.data?.message || "Failed to fetch user tasks ");
//         }
//       } catch (error: any) {
//         toast.error(error.response?.data?.message || "Something went wrong");
//         // console.error("Failed to fetch user tasks:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserTasks();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen text-white">
//         <Loader2 className="animate-spin w-8 h-8 mr-3" />
//         Loading tasks...
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="flex justify-center items-center min-h-screen text-red-400 text-lg font-semibold">
//         No user data found
//       </div>
//     );
//   }


// const handleDelete = async (taskId: string, title: string) => {
//   const toastId = toast.loading("Deleting task...");
//   try {
//     const res = await axios.delete("/api/Dashboard_Students/submittask", {
//       data: { id: taskId },
//       withCredentials: true,
//     });

//     if (res?.data?.success) {
//       toast.success(`Task deleted successfully: ${title}`, { id: toastId });
//       setUser((prev) =>
//         prev
//           ? {
//               ...prev,
//               uploadedTasks: prev.uploadedTasks.filter(
//                 (task) => task._id !== taskId
//               ),
//             }
//           : prev
//       );
//     } else {
//       toast.error(res?.data?.message || "Failed to delete task", {
//         id: toastId,
//       });
//     }
//   } catch (error: any) {
//     toast.error(error?.response?.data?.message || "Something went wrong", {
//       id: toastId,
//     });
//   } finally {
//     setMessageAlert(false);
//     setSelectedTask(null);
//   }
// };


//   return (
//     <>
//     <Toaster/>
//     <div className="min-h-screen sm:p-8">
//       <h1
//         style={{
//           fontFamily: "'Orbitron', sans-serif",
//           WebkitBackgroundClip: "text",
//           textShadow: "0 0 15px rgba(127, 29, 29, 1), 0 0 10px rgba(127, 29, 29, 1)",
//         }}
//         className="text-5xl font-extrabold text-center text-white mb-14 drop-shadow-lg"
//       >
//         {user?.name}&apos;s Uploaded Tasks
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//         {user?.uploadedTasks?.length > 0 ? (
//           user.uploadedTasks.map((task: Task , idx) => (
//             <div
//               key={idx}
//               className="group relative bg-white/5  backdrop-blur-lg p-6 rounded-2xl shadow-[0_0_20px_rgba(255,0,0,0.3)] border border-red-500/30 hover:border-red-400 transition-all duration-300 hover:scale-[1.05]"
//             >
//               <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 blur-2xl transition duration-500"></div>
  
//   <div className="al flex justify-between items-center">
//               <h2 className="text-2xl font-bold text-white mb-3 relative  z-10">{task?.title}</h2>
//               <div  onClick={() => {
//     setMessageAlert(true);
//     setSelectedTask(task);
//   }} className="icon  cursor-pointer z-50 text-2xl mb-3 text-red-500"> <MdDelete /> </div>
//               </div>

//             <p className="text-gray-300 text-sm mb-5 z-10">
//   {task?.description}
// </p>


//               <div className="flex flex-col gap-3 relative z-10">
//                 {task?.github && (
//                   <a
//                     href={task?.github}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 text-red-300 hover:text-red-100 transition-colors"
//                   >
//                     <Github size={18} /> GitHub Repo
//                   </a>
//                 )}
//                 {task.deploy && (
//                   <a
//                     href={task?.deploy}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 text-red-300 hover:text-red-100 transition-colors"
//                   >
//                     <Globe size={18} /> Live Deployment
//                   </a>
//                 )}
//               </div>

//               <p className="text-xs text-gray-400 mt-6 relative z-10">
//                 Uploaded on: {new Date(task.createdAt).toLocaleDateString()}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-400 text-center col-span-full text-lg font-medium">
//             No tasks uploaded yet.
//           </p>
//         )}
//       </div>
//     </div>
// <AnimatePresence>
//   {messageAlert && selectedTask && (
//     <>
//       <motion.div
//         className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={() => setMessageAlert(false)}
//       />
//       <motion.div
//         className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
//                    z-50 mt-20 w-[90%] max-w-sm bg-gradient-to-b from-black 
//                    via-gray-900 to-red-900 border border-red-800 rounded-2xl 
//                    p-6 shadow-2xl text-center"
//         initial={{ scale: 0.8, opacity: 0, y: -30 }}
//         animate={{ scale: 1, opacity: 1, y: 0 }}
//         exit={{ scale: 0.8, opacity: 0, y: -30 }}
//         transition={{ duration: 0.25, ease: "easeOut" }}
//       >
//         <h2 className="text-xl font-bold text-white mb-3">Confirm Delete</h2>
//         <p className="text-gray-200 text-sm mb-6">
//           Are you sure you want to delete{" "}
//           <span className="text-red-300 font-semibold">
//             {selectedTask?.title}
//           </span>
//           ?
//         </p>
//         <div className="flex gap-4 justify-center">
//           <button
//             onClick={() =>
//               handleDelete(selectedTask._id, selectedTask.title)
//             }
//             className="px-5 py-2 rounded-xl cursor-pointer bg-red-700 
//                        hover:bg-red-800 text-white font-semibold shadow-md 
//                        transition"
//           >
//             Delete
//           </button>
//           <button
//             onClick={() => setMessageAlert(false)}
//             className="px-5 py-2 cursor-pointer rounded-xl bg-gray-700 
//                        hover:bg-gray-800 text-gray-100 font-medium shadow-md 
//                        transition"
//           >
//             Cancel
//           </button>
//         </div>
//       </motion.div>
//     </>
//   )}
// </AnimatePresence>

//     </>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Github, Globe } from "lucide-react"; 
import { toast, Toaster } from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
  _id: string;
  title: string;
  description: string;
  github?: string;
  deploy?: string;
  createdAt: string;
}

interface User {
  _id: string;   
  name: string;
  uploadedTasks: Task[];
}

export default function UserTasks() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageAlert, setMessageAlert] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const response = await axios.post(
          "/api/Dashboard_Students/uplodedtasks",
          {},
          { withCredentials: true }
        );

        if (response?.data?.success) {
          setUser(response.data.user);
          toast.success("User tasks fetched successfully");
        } else {
          toast.error(response?.data?.message || "Failed to fetch user tasks");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Something went wrong");
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

  const handleDelete = async (taskId: string, title: string) => {
    const toastId = toast.loading("Deleting task...");
    try {
      const res = await axios.delete("/api/Dashboard_Students/submittask", {
        data: { id: taskId, password, userId: user._id }, 
        withCredentials: true,
      });

      if (res?.data?.success) {
        toast.success(`Task deleted successfully: ${title}`, { id: toastId });
        setUser((prev) =>
          prev
            ? {
                ...prev,
                uploadedTasks: prev.uploadedTasks.filter(
                  (task) => task._id !== taskId
                ),
              }
            : prev
        );
      } else {
        toast.error(res?.data?.message || "Failed to delete task", {
          id: toastId,
        });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setMessageAlert(false);
      setSelectedTask(null);
      setPassword("");
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen sm:p-8">
        <h1
          style={{
            fontFamily: "'Orbitron', sans-serif",
            WebkitBackgroundClip: "text",
            textShadow:
              "0 0 15px rgba(127, 29, 29, 1), 0 0 10px rgba(127, 29, 29, 1)",
          }}
          className="text-5xl font-extrabold text-center text-white mb-14 drop-shadow-lg"
        >
          {user?.name}&apos;s Uploaded Tasks
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {user?.uploadedTasks?.length > 0 ? (
            user.uploadedTasks.map((task: Task, idx) => (
              <div
                key={idx}
                className="group  relative bg-white/5 backdrop-blur-lg p-6 rounded-2xl 
                           shadow-[0_0_20px_rgba(255,0,0,0.3)] border border-red-500/30 
                           hover:border-red-400 transition-all duration-300 hover:scale-[1.05]"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r 
                                from-red-600/20 to-pink-600/20 opacity-0 
                                group-hover:opacity-100 blur-2xl transition duration-500"></div>

                <div className="al flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white mb-3 relative z-10">
                    {task?.title}
                  </h2>
                  <div
                    onClick={() => {
                      setMessageAlert(true);
                      setSelectedTask(task);
                    }}
                    className="icon cursor-pointer z-50 text-2xl mb-3 text-red-500"
                  >
                    <MdDelete />
                  </div>
                </div>

               <p className="text-gray-300 text-sm mb-5 z-10 max-h-24 overflow-y-auto break-words">
  {task?.description}
</p>



                <div className="flex flex-col gap-3 relative z-10">
                  {task?.github && (
                    <a
                      href={task?.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-red-300 hover:text-red-100 transition-colors"
                    >
                      <Github size={18} /> GitHub Repo
                    </a>
                  )}
                  {task.deploy && (
                    <a
                      href={task?.deploy}
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
              No tasks uploaded yet.
            </p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {messageAlert && selectedTask && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMessageAlert(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                         z-50 mt-20 w-[90%] max-w-sm bg-gradient-to-b from-black 
                         via-gray-900 to-red-900 border border-red-800 rounded-2xl 
                         p-6 shadow-2xl text-center"
              initial={{ scale: 0.8, opacity: 0, y: -30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -30 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <h2 className="text-xl font-bold text-white mb-3">Confirm Delete</h2>
              <p className="text-gray-200 text-sm mb-6">
                Enter your password to confirm deleting{" "}
                <span className="text-red-300 font-semibold">
                  {selectedTask?.title}
                </span>
              </p>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-4 h-[50px] rounded-lg bg-gray-800 text-white border border-red-500 focus:outline-none"
                placeholder="Enter your password"
              />

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() =>
                    handleDelete(selectedTask._id, selectedTask.title)
                  }
                  className="px-5 py-2 rounded-xl cursor-pointer bg-red-700 
                             hover:bg-red-800 text-white font-semibold shadow-md 
                             transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => setMessageAlert(false)}
                  className="px-5 py-2 cursor-pointer rounded-xl bg-gray-700 
                             hover:bg-gray-800 text-gray-100 font-medium shadow-md 
                             transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
