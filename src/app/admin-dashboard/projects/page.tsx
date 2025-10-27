// // "use client";

// // import axios from "axios";
// // import { useEffect, useState } from "react";
// // import { motion } from "framer-motion";
// // import { Github, Globe, User, Mail, Briefcase } from "lucide-react";
// // import Loading from "@/components/Loading2";
// // import {toast,Toaster} from "react-hot-toast";
// // interface SubmittedTask {
// //   _id: string;
// //   title: string;
// //   description: string;
// //   github?: string;
// //   deploy?: string;
// //   uploadedBy: {
// //     name: string;
// //     email: string;
// //     domain: string;
// //   };
// //   createdAt: string;
// //   deadline: string; 
// // }

// // export default function ProjectsPage() {
// //   const [submittedTasks, setSubmittedTasks] = useState<SubmittedTask[]>([]);
// //   const [filteredTasks, setFilteredTasks] = useState<SubmittedTask[]>([]);
// //   const [activeCategory, setActiveCategory] = useState<string>("");

// //   const [loading , setLoading] = useState(true)

// //   const categories = [
// //     "Frontend development",
// //     "Backend development",
// //     "App development",
// //     "Machine Learning",
// //     "UI/UX designing",
// //     "Cloud Computing",
// //     "video Editor",
// //     "other",
// //   ];

// //   const handleCat = (cat: string) => {
// //     setActiveCategory(cat);
// //     if (cat === "") {
// //       setFilteredTasks(submittedTasks);
// //     } else {
// //       const filtered = submittedTasks.filter(
// //         (task) => task?.uploadedBy?.domain === cat
// //       );
// //       setFilteredTasks(filtered);
// //     }
// //   };


// //   useEffect(() => {
// //     async function getSubmittedTasks() {
// //       try {
// //         const token = localStorage.getItem("token");
// //       if (!token) {
// //         toast.error("You are not logged in");
// //         setLoading(false);
// //         return;
// //       }
// //         setLoading(true);
// //         const res = await axios.get("/api/Dashboard_Admin/submittedTasks" , {
// //           headers : {
// //             Authorization : `Bearer ${token}`
// //           }
// //         });

// //         // console.log(res);
        

// //         if (res?.data?.success) {
// //           setSubmittedTasks(res.data.Submittedtasks || []);
// //           setFilteredTasks(res.data.Submittedtasks || []);
// //           toast.success("Submitted tasks fetched successfully");
// //         } else {
// //           toast.error(res?.data?.message || "Failed to fetch submitted tasks");
// //         }
// //       } catch (err: any) {
// //         // console.error("Error fetching submitted tasks:", err);
// //         toast.error(err.response?.data?.message || "Something went wrong");
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     getSubmittedTasks();
// //   }, []);

// //   return (
// //   <div className="sm:p-6 min-h-screen text-white">
// //     <Toaster/>
// //     <h1
// //       style={{
// //         fontFamily: "'Orbitron', sans-serif",
// //         WebkitBackgroundClip: "text",
// //         textShadow:
// //           "0 0 15px rgba(127, 29, 29, 1), 0 0 30px rgba(127, 29, 29, 1)",
// //       }}
// //       className="text-4xl font-bold text-center mb-10"
// //     >
// //       Submitted Projects
// //     </h1>

// //     <div className="flex flex-wrap justify-center gap-4 mb-8">
// //       {categories.map((cat, index) => (
// //         <button
// //           key={index}
// //           onClick={() => handleCat(cat)}
// //           className={`px-4 py-2 cursor-pointer rounded-xl border ${
// //             activeCategory === cat
// //               ? "bg-red-900 border-red-900"
// //               : "bg-white/10 border-white/20"
// //           } hover:bg-red-900 transition`}
// //         >
// //           {cat}
// //         </button>
// //       ))}
// //       <button
// //         onClick={() => handleCat("")}
// //         className={`px-4 py-2 rounded-xl border ${
// //           activeCategory === ""
// //             ? "bg-red-900 border-red-900"
// //             : "bg-white/10 border-white/20"
// //         } hover:bg-red-900 transition`}
// //       >
// //         All
// //       </button>
// //     </div>

  
// //     {loading ? (
// //       <Loading />
// //     ) : filteredTasks.length === 0 ? (
// //       <p className="text-center text-gray-400 text-lg">
// //         No submitted tasks found.
// //       </p>
// //     ) : (
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //         {filteredTasks.map((task, index) => (
// //           <motion.div
// //             key={task._id}
// //             initial={{ opacity: 0, y: 50 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ delay: index * 0.1 }}
// //             className="relative p-6 rounded-2xl shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:scale-[1.03] transition-transform"
// //           >
// //             <h2 className="text-2xl font-semibold mb-3 text-yellow-300">
// //               {task.title}
// //             </h2>
// //             <p className="text-gray-200 text-sm mb-4">{task?.description}</p>

// //             <div className="space-y-2 text-sm">
// //               <p className="flex items-center gap-2">
// //                 <User size={16} className="text-blue-400" /> {task?.uploadedBy?.name}
// //               </p>
// //               <p className="flex items-center gap-2">
// //                 <Briefcase size={16} className="text-purple-400" />{" "}
// //                 {task?.uploadedBy?.domain}
// //               </p>
// //               <p className="flex items-center gap-2">
// //                 <Mail size={16} className="text-pink-400" /> {task?.uploadedBy?.email}
// //               </p>
// //               <p className="text-gray-400 text-xs">
// //                 Uploaded At: {new Date(task?.createdAt).toLocaleString()}
// //               </p>
// //             </div>

// //             <div className="mt-4 flex gap-4">
// //               {task?.github && (
// //                 <a
// //                   href={task.github}
// //                   target="_blank"
// //                   className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition"
// //                 >
// //                   <Github size={18} /> GitHub
// //                 </a>
// //               )}
// //               {task?.deploy && (
// //                 <a
// //                   href={task.deploy}
// //                   target="_blank"
// //                   className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition"
// //                 >
// //                   <Globe size={18} /> Live
// //                 </a>
// //               )}
// //             </div>
// //           </motion.div>
// //         ))}
// //       </div>
// //     )}
// //   </div>
// // );

// // }


// "use client";

// import axios from "axios";
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Github, Globe, User, Mail, Briefcase, AlertTriangle } from "lucide-react";
// import Loading from "@/components/Loading2";
// import { toast, Toaster } from "react-hot-toast";
// import { Check } from "lucide-react";

// interface SubmittedTask {
//   _id: string;
//   title: string;
//   description: string;
//   github?: string;
//   deploy?: string;
//   uploadedBy: {
//     name: string;
//     email: string;
//     domain: string;
//   };
//   createdAt: string;
//   deadline: string; 
// }

// export default function ProjectsPage() {
//   const [submittedTasks, setSubmittedTasks] = useState<SubmittedTask[]>([]);
//   const [filteredTasks, setFilteredTasks] = useState<SubmittedTask[]>([]);
//   const [activeCategory, setActiveCategory] = useState<string>("");
//     const [rating, setRating] = useState(initialRating || 0);

//   const [loading, setLoading] = useState(true);

//   const categories = [
//     "Frontend development",
//     "Backend development",
//     "App development",
//     "Machine Learning",
//     "UI/UX designing",
//     "Cloud Computing",
//     "video Editor",
//     "other",
//   ];

//   const handleCat = (cat: string) => {
//     setActiveCategory(cat);
//     if (cat === "") {
//       setFilteredTasks(submittedTasks);
//     } else {
//       const filtered = submittedTasks.filter(
//         (task) => task?.uploadedBy?.domain === cat
//       );
//       setFilteredTasks(filtered);
//     }
//   };

//   useEffect(() => {
//     async function getSubmittedTasks() {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("You are not logged in");
//           setLoading(false);
//           return;
//         }
//         setLoading(true);
//         const res = await axios.get("/api/Dashboard_Admin/submittedTasks", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         // console.log(res);
        

//         if (res?.data?.success) {
//           setSubmittedTasks(res.data.Submittedtasks || []);
//           setFilteredTasks(res.data.Submittedtasks || []);
//           toast.success("Submitted tasks fetched successfully");
//         } else {
//           toast.error(res?.data?.message || "Failed to fetch submitted tasks");
//         }
//       } catch (err: any) {
//         toast.error(err.response?.data?.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     }

//     getSubmittedTasks();
//   }, []);

//   return (
//     <div className="sm:p-6 min-h-screen text-white">
//       <Toaster />
//       <h1
//         style={{
//           fontFamily: "'Orbitron', sans-serif",
//           WebkitBackgroundClip: "text",
//           textShadow:
//             "0 0 15px rgba(127, 29, 29, 1), 0 0 30px rgba(127, 29, 29, 1)",
//         }}
//         className="text-4xl font-bold text-center mb-10"
//       >
//         Submitted Projects
//       </h1>

//       {/* Category Buttons */}
//       <div className="flex flex-wrap justify-center gap-4 mb-8">
//         {categories.map((cat, index) => (
//           <button
//             key={index}
//             onClick={() => handleCat(cat)}
//             className={`px-4 py-2 cursor-pointer rounded-xl border ${
//               activeCategory === cat
//                 ? "bg-red-900 border-red-900"
//                 : "bg-white/10 border-white/20"
//             } hover:bg-red-900 transition`}
//           >
//             {cat}
//           </button>
//         ))}
//         <button
//           onClick={() => handleCat("")}
//           className={`px-4 py-2 rounded-xl border ${
//             activeCategory === ""
//               ? "bg-red-900 border-red-900"
//               : "bg-white/10 border-white/20"
//           } hover:bg-red-900 transition`}
//         >
//           All
//         </button>
//       </div>

      
//       {loading ? (
//         <Loading />
//       ) : filteredTasks.length === 0 ? (
//         <p className="text-center text-gray-400 text-lg">
//           No submitted tasks found.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {filteredTasks.map((task, index) => {
//             const isLate =
//               task.deadline && new Date(task.createdAt) > new Date(task.deadline);

//             return (
//               <motion.div
//                 key={task._id}
//                 initial={{ opacity: 0, y: 50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="relative p-6 rounded-2xl shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:scale-[1.03] transition-transform"
//               >
//                 <h2 className="text-2xl font-semibold mb-3 text-yellow-300">
//                   {task.title}
//                 </h2>



//                 {isLate && (
//                   <p className="flex items-center gap-2 text-red-500 font-semibold text-sm mb-2">
//                     <AlertTriangle size={16} /> Late Submission
//                   </p>
//                 )}

//                 <p className="text-gray-200 text-sm mb-4">{task?.description}</p>

//                 <div className="space-y-2 text-sm">
//                   <p className="flex items-center gap-2">
//                     <User size={16} className="text-blue-400" />{" "}
//                     {task?.uploadedBy?.name}
//                   </p>
//                   <p className="flex items-center gap-2">
//                     <Briefcase size={16} className="text-purple-400" />{" "}
//                     {task?.uploadedBy?.domain}
//                   </p>
//                   <p className="flex items-center gap-2">
//                     <Mail size={16} className="text-pink-400" />{" "}
//                     {task?.uploadedBy?.email}
//                   </p>
//                   <p className="text-gray-400 text-xs">
//                     Uploaded At: {new Date(task?.createdAt).toLocaleString()}
//                   </p>
//                 </div>

//                 <div className="mt-4 flex gap-4">
//                   {task?.github && (
//                     <a
//                       href={task.github}
//                       target="_blank"
//                       className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition"
//                     >
//                       <Github size={18} /> GitHub
//                     </a>
//                   )}
//                   {task?.deploy && (
//                     <a
//                       href={task.deploy}
//                       target="_blank"
//                       className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition"
//                     >
//                       <Globe size={18} /> Live
//                     </a>
//                   )}
//                 </div>

//                 <button>
//                   give marks <input type="number" name="" id="" />
//                 </button>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }



// "use client";

// import axios from "axios";
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   Github,
//   Globe,
//   User,
//   Mail,
//   Briefcase,
//   AlertTriangle,
//   Check,
// } from "lucide-react";
// import Loading from "@/components/Loading2";
// import { toast, Toaster } from "react-hot-toast";

// interface SubmittedTask {
//   _id: string;
//   title: string;
//   description: string;
//   github?: string;
//   deploy?: string;
//   uploadedBy: {
//     name: string;
//     email: string;
//     domain: string;
//   };
//   createdAt: string;
//   deadline: string;
//   rating?: number;
//   taskCategory? : string
// }

// export default function ProjectsPage() {
//   const [submittedTasks, setSubmittedTasks] = useState<SubmittedTask[]>([]);
//   const [filteredTasks, setFilteredTasks] = useState<SubmittedTask[]>([]);
//   const [activeCategory, setActiveCategory] = useState<string>("");
//   const [loading, setLoading] = useState(true);
//   const [loadingRate, setLoadingRate] = useState<Record<string, boolean>>({});
//   const [ratings, setRatings] = useState<Record<string, number>>({});

//   // const categories = [
//   //   "Frontend development",
//   //   "Backend development",
//   //   "App development",
//   //   "Machine Learning",
//   //   "UI/UX designing",
//   //   "Cloud Computing",
//   //   "video Editor",
//   //   "other",
//   // ];

//   const categories = [
//   "Frontend Task",
//   "Backend Task",
//   "UI/UX Task",
//   "Machine Learning Task",
//   "Cloud Computing Task",
//   "App Development Task",
//   "Video Editing Task" 
// ];


//   const handleCat = (cat: string) => {
//     setActiveCategory(cat);
//     if (cat === "") {
//       setFilteredTasks(submittedTasks);
//     } else {
//       const filtered = submittedTasks.filter(
//         (task) => task?.taskCategory === cat
//         // (task) => task?.uploadedBy?.domain === cat
//       );
//       setFilteredTasks(filtered);
//     }
//   };

//   useEffect(() => {
//     async function getSubmittedTasks() {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("You are not logged in");
//           setLoading(false);
//           return;
//         }
//         setLoading(true);
//         const res = await axios.get("/api/Dashboard_Admin/submittedTasks", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         // console.log(res); taskCategory

        
//         if (res?.data?.success) {
//           const tasks = res.data.Submittedtasks || [];
//           setSubmittedTasks(tasks);
//           setFilteredTasks(tasks);

//           // Initialize ratings state from tasks
//           const initialRatings: Record<string, number> = {};
//           tasks.forEach((task: SubmittedTask) => {
//             initialRatings[task._id] = task.rating || 0;
//           });
//           setRatings(initialRatings);

//           toast.success("Submitted tasks fetched successfully");
//         } else {
//           toast.error(res?.data?.message || "Failed to fetch submitted tasks");
//         }
//       } catch (err: any) {
//         toast.error(err.response?.data?.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     }

//     getSubmittedTasks();
//   }, []);

//   async function submitRating(taskId: string) {
//      setLoadingRate((prev) => ({ ...prev, [taskId]: true }));
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("You are not logged in");
//         return;
//       }

//       const rating = ratings[taskId] ?? 0;

//       const res = await axios.post(
//         "/api/Dashboard_Admin/rating",
//         { taskId, rating },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // console.log(res);
      

//       if (res?.data?.success) {
//         toast.success("Rating submitted!");
//         // setLoadingRate(false)
//       } else {
//         toast.error(res.data.message || "Failed to submit rating");
//       }
//     } catch (error: any) {
//       // console.log(errror);
      
//       toast.error(error.response?.data?.message || "Something went wrong");
//     }
//     finally{
//     setLoadingRate((prev) => ({ ...prev, [taskId]: false }));
//     }
//   }

//   return (
//     <>
//      <Toaster />
//     <div className="sm:p-6 min-h-screen text-white">
     
//       <h1
//         style={{
//           fontFamily: "'Orbitron', sans-serif",
//           WebkitBackgroundClip: "text",
//           textShadow:
//             "0 0 15px rgba(127, 29, 29, 1), 0 0 30px rgba(127, 29, 29, 1)",
//         }}
//         className="text-4xl font-bold text-center mb-10"
//       >
//         Submitted Projects
//       </h1>

//       {/* Category Buttons */}
//       <div className="flex flex-wrap justify-center gap-4 mb-8">
//         {categories.map((cat, index) => (
//           <button
//             key={index}
//             onClick={() => handleCat(cat)}
//             className={`px-4 py-2 cursor-pointer rounded-xl border ${
//               activeCategory === cat
//                 ? "bg-red-900 border-red-900"
//                 : "bg-white/10 border-white/20"
//             } hover:bg-red-900 transition`}
//           >
//             {cat}
//           </button>
//         ))}
//         <button
//           onClick={() => handleCat("")}
//           className={`px-4 py-2 rounded-xl border ${
//             activeCategory === ""
//               ? "bg-red-900 border-red-900"
//               : "bg-white/10 border-white/20"
//           } hover:bg-red-900 transition`}
//         >
//           All
//         </button>
//       </div>

//       {loading ? (
//         <Loading />
//       ) : filteredTasks.length === 0 ? (
//         <p className="text-center text-gray-400 text-lg">
//           No submitted tasks found.
//         </p>
//       ) : (
//         // <div className="flex justify-center items-center flex-wrap gap-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {filteredTasks.map((task, index) => {
//             const isLate =
//               task.deadline && new Date(task.createdAt) > new Date(task.deadline);

//             return (
//               <motion.div
//                 key={task._id}
//                 initial={{ opacity: 0, y: 50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="relative  p-6 rounded-2xl shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:scale-[1.03] transition-transform"
//               >
//                 <h2 className="text-2xl font-semibold  text-yellow-300">
//                   {task.title}
//                 </h2>
//                 <h4 className="text-xs font-semibold mb-3 text-yellow-300">
//                   {task.taskCategory}
//                 </h4>

//                 {isLate && (
//                   <p className="flex items-center gap-2 text-red-500 font-semibold text-sm mb-2">
//                     <AlertTriangle size={16} /> Late Submission
//                   </p>
//                 )}

//                 <p className="text-gray-200 text-sm mb-4">{task?.description}</p>

//                 <div className="space-y-2 text-sm">
//                   <p className="flex items-center gap-2">
//                     <User size={16} className="text-blue-400" />{" "}
//                     {task?.uploadedBy?.name}
//                   </p>
//                   <p className="flex items-center gap-2">
//                     <Briefcase size={16} className="text-purple-400" />{" "}
//                     {task?.uploadedBy?.domain}
//                   </p>
//                   <p className="flex items-center gap-2">
//                     <Mail size={16} className="text-pink-400" />{" "}
//                     {task?.uploadedBy?.email}
//                   </p>
//                   <p className="text-gray-400 text-xs">
//                     Uploaded At: {new Date(task?.createdAt).toLocaleString()}
//                   </p>
//                 </div>

//                 <div className="mt-4 flex gap-4">
//                   {task?.github && (
//                     <a
//                       href={task.github}
//                       target="_blank"
//                       className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition"
//                     >
//                       <Github size={18} /> GitHub
//                     </a>
//                   )}
//                   {task?.deploy && (
//                     <a
//                       href={task.deploy}
//                       target="_blank"
//                       className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition"
//                     >
//                       <Globe size={18} /> Live
//                     </a>
//                   )}
//                 </div>

//                 {/*  Rating Section */}
//                 <div className="mt-5 flex flex-col gap-2">
//                   <div className="flex flex-wrap gap-2 justify-center">
//                     {[...Array(10)].map((_, i) => {
//                       const num = i + 1;
//                       return (
//                         <button
//                           key={num}
//                           className={`px-3 py-1 rounded-lg border ${
//                             ratings[task._id] === num
//                               ? "bg-red-900 text-white border-red-950"
//                               : "bg-white/10 text-white font-semibold cursor-pointer hover:bg-white/20"
//                           }`}
//                           onClick={() =>
//                             setRatings((prev) => ({
//                               ...prev,
//                               [task._id]: num,
//                             }))
//                           }
//                         >
//                           {num}
//                         </button>
//                       );
//                     })}
//                   </div>
//                   <div className="flex items-center gap-2 justify-center">
//                     <input
//                       type="number"
//                       min="0"
//                       max="10"
//                       value={ratings[task._id] ?? 0}
//                       onChange={(e) =>
//                         setRatings((prev) => ({
//                           ...prev,
//                           [task._id]: Math.min(
//                             10,
//                             Math.max(0, Number(e.target.value))
//                           ),
//                         }))
//                       }
//                       className="w-20 text-center border border-gray-300 rounded-lg p-1 font-bold text-white"
//                     />
//                      {loadingRate[task._id] ? (
//     <div className="text-yellow-300 text-sm font-semibold"><svg
//               className="animate-spin h-5 w-5 mr-3 text-white"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8v8H4z"
//               ></path>
//             </svg></div>
//   ) : (
//     <button
//       onClick={() => submitRating(task?._id)}
//       className="p-2 rounded-full cursor-pointer bg-green-500 hover:bg-green-600 text-white transition-all shadow-md"
//     >
//       <Check className="h-5 w-5" />
//     </button>
//   )}
//                   </div>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//     </>
//   );
// }


"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Globe,
  User,
  Mail,
  Briefcase,
  AlertTriangle,
  Check,
  Search,
} from "lucide-react";
import Loading from "@/components/Loading2";
import { toast, Toaster } from "react-hot-toast";

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
  deadline: string;
  rating?: number;
  taskCategory?: string;
}

export default function ProjectsPage() {
  const [submittedTasks, setSubmittedTasks] = useState<SubmittedTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<SubmittedTask[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadingRate, setLoadingRate] = useState<Record<string, boolean>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");

  const categories = [
    "Frontend Task",
    "Backend Task",
    "UI/UX Task",
    "Machine Learning Task",
    "Cloud Computing Task",
    "App Development Task",
    "Video Editing Task",
    "Full Stack Task"
  ];

  const handleCat = (cat: string) => {
    setActiveCategory(cat);
    filterTasks(cat, searchTerm);
  };

  const filterTasks = (category: string, search: string) => {
    let filtered = submittedTasks;

    if (category) {
      filtered = filtered.filter((task) => task?.taskCategory === category);
    }

    if (search.trim() !== "") {
      filtered = filtered.filter((task) =>
        task.uploadedBy.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  useEffect(() => {
    filterTasks(activeCategory, searchTerm);
  }, [searchTerm, activeCategory, submittedTasks]);

  useEffect(() => {
    async function getSubmittedTasks() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You are not logged in");
          setLoading(false);
          return;
        }
        setLoading(true);
        const res = await axios.get("/api/Dashboard_Admin/submittedTasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res?.data?.success) {
          const tasks = res.data.Submittedtasks || [];
          setSubmittedTasks(tasks);
          setFilteredTasks(tasks);

          const initialRatings: Record<string, number> = {};
          tasks.forEach((task: SubmittedTask) => {
            initialRatings[task._id] = task.rating || 0;
          });
          setRatings(initialRatings);

          toast.success("Submitted tasks fetched successfully");
        } else {
          toast.error(res?.data?.message || "Failed to fetch submitted tasks");
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    getSubmittedTasks();
  }, []);

  async function submitRating(taskId: string) {
    setLoadingRate((prev) => ({ ...prev, [taskId]: true }));
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not logged in");
        return;
      }

      const rating = ratings[taskId] ?? 0;

      const res = await axios.post(
        "/api/Dashboard_Admin/rating",
        { taskId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res?.data?.success) {
        toast.success("Rating submitted!");
      } else {
        toast.error(res.data.message || "Failed to submit rating");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingRate((prev) => ({ ...prev, [taskId]: false }));
    }
  }

  return (
    <>
      <Toaster />
      <div className="sm:p-6 min-h-screen text-white">
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

        {/* Search Input */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by candidate name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-900"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
          </div>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => handleCat(cat)}
              className={`px-4 py-2 cursor-pointer rounded-xl border ${
                activeCategory === cat
                  ? "bg-red-900 border-red-900"
                  : "bg-white/10 border-white/20"
              } hover:bg-red-900 transition`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => handleCat("")}
            className={`px-4 py-2 rounded-xl border ${
              activeCategory === ""
                ? "bg-red-900 border-red-900"
                : "bg-white/10 border-white/20"
            } hover:bg-red-900 transition`}
          >
            All
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : filteredTasks.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            No submitted tasks found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTasks.map((task, index) => {
              const isLate =
                task.deadline && new Date(task.createdAt) > new Date(task.deadline);

              return (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative p-6 rounded-2xl shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:scale-[1.03] transition-transform"
                >
                  <h2 className="text-2xl font-semibold text-yellow-300">
                    {task.title}
                  </h2>
                  <h4 className="text-xs font-semibold mb-3 text-yellow-300">
                    {task.taskCategory}
                  </h4>

                  {isLate && (
                    <p className="flex items-center gap-2 text-red-500 font-semibold text-sm mb-2">
                      <AlertTriangle size={16} /> Late Submission
                    </p>
                  )}

                  <p className="text-gray-200 max-h-24 overflow-y-auto break-words text-sm mb-4">
                    {task?.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <User size={16} className="text-blue-400" />{" "}
                      {task?.uploadedBy?.name}
                    </p>
                    <p className="flex items-center gap-2">
                      <Briefcase size={16} className="text-purple-400" />{" "}
                      {task?.uploadedBy?.domain}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail size={16} className="text-pink-400" />{" "}
                      {task?.uploadedBy?.email}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Uploaded At: {new Date(task?.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-4">
                    {task?.github && (
                      <a
                        href={task.github}
                        target="_blank"
                        className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition"
                      >
                        <Github size={18} /> GitHub
                      </a>
                    )}
                    {task?.deploy && (
                      <a
                        href={task.deploy}
                        target="_blank"
                        className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition"
                      >
                        <Globe size={18} /> Live
                      </a>
                    )}
                  </div>

                  {/* Rating Section */}
                  <div className="mt-5 flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[...Array(10)].map((_, i) => {
                        const num = i + 1;
                        return (
                          <button
                            key={num}
                            className={`px-3 py-1 rounded-lg border ${
                              ratings[task._id] === num
                                ? "bg-red-900 text-white border-red-950"
                                : "bg-white/10 text-white font-semibold cursor-pointer hover:bg-white/20"
                            }`}
                            onClick={() =>
                              setRatings((prev) => ({
                                ...prev,
                                [task._id]: num,
                              }))
                            }
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={ratings[task._id] ?? 0}
                        onChange={(e) =>
                          setRatings((prev) => ({
                            ...prev,
                            [task._id]: Math.min(
                              10,
                              Math.max(0, Number(e.target.value))
                            ),
                          }))
                        }
                        className="w-20 text-center border border-gray-300 rounded-lg p-1 font-bold text-white"
                      />
                      {loadingRate[task._id] ? (
                        <div className="text-yellow-300 text-sm font-semibold">
                          <svg
                            className="animate-spin h-5 w-5 mr-3 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                          </svg>
                        </div>
                      ) : (
                        <button
                          onClick={() => submitRating(task?._id)}
                          className="p-2 rounded-full cursor-pointer bg-green-500 hover:bg-green-600 text-white transition-all shadow-md"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
