// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { CheckCircle, XCircle } from "lucide-react";
// import toast from "react-hot-toast";
// type Attendance = {
//   _id: string;
//   date: string;
//   status: "Present" | "Absent";
// };

// export default function MyAttendancePage() {
//   const [attendance, setAttendance] = useState<Attendance[]>([]);
//   const [overallPercentage, setOverallPercentage] = useState<number>(0);

  
//   useEffect(() => {
//     const fetchData = async () => {
//       const userId = localStorage.getItem("userId");
//       if (!userId) {
//         toast.error("User not found, please login again.");
//         return;
//       }

//       try {
//         const res = await fetch("/api/Dashboard_Students/attendance", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ userId }),
//         });

        
//         if (!res.ok) {
//           const errorData = await res.json().catch(() => null);
//           toast.error(
//             errorData?.message || `Failed to fetch attendance (Status ${res.status})`
//           );
//           return;
//         }

//         const data = await res.json();

//         if (data?.success) {
//           setAttendance(data.attendance);

//           const total = data.attendance?.length || 0;
//           const presentCount = data.attendance?.filter(
//             (a: Attendance) => a.status === "Present"
//           ).length;
//           const percentage =
//             total > 0 ? Math.round((presentCount / total) * 100) : 0;

//           setOverallPercentage(percentage);
//           toast.success("Attendance fetched successfully ✅");
//         } else {
//           toast.error(data?.message || "Failed to load attendance");
//         }
//       } catch (error: any) {
//         toast.error(error?.message || "Something went wrong while fetching attendance");
//         console.error("Attendance fetch error:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const total = attendance.length;
//   const presentCount = attendance.filter((a) => a.status === "Present").length;
//   const absentCount = total - presentCount;

  
//   const getCircleColor = () => {
//     if (overallPercentage >= 75) return "rgb(34,197,94)";
//     if (overallPercentage >= 50) return "rgb(234,179,8)"; 
//     return "rgb(239,68,68)"; 
//   };

//   return (
//     <div className="min-h-screen flex flex-col w-full items-center sm:p-6">
//       <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl p-6">
//         <h2 
//          style={{
//             fontFamily: "'Orbitron', sans-serif",
//             WebkitBackgroundClip: "text",
//             textShadow:
//               "0 0 10px rgba(127, 29, 29, 1), 0 0 10px rgba(127, 29, 29, 1)",
//           }}
//         className="text-4xl font-bold text-white mb-6 text-center tracking-wide">
//            My Attendance
//         </h2>

//         {attendance.length === 0 ? (
//           <div className="flex justify-center items-center min-h-[200px] text-white">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
//               Loading attendance...
//             </div>
//           </div>
//         ) : (
//           <>
            
//             <div className="flex flex-col items-center mb-8">
//               <div className="relative w-36 h-36">
//                 <svg className="w-36 h-36 transform -rotate-90">
//                   <circle
//                     cx="72"
//                     cy="72"
//                     r="64"
//                     stroke="rgba(255,255,255,0.2)"
//                     strokeWidth="12"
//                     fill="transparent"
//                   />
//                   <motion.circle
//                     cx="72"
//                     cy="72"
//                     r="64"
//                     stroke={getCircleColor()}
//                     strokeWidth="12"
//                     fill="transparent"
//                     strokeDasharray={2 * Math.PI * 64}
//                     strokeDashoffset={2 * Math.PI * 64 * (1 - overallPercentage / 100)}
//                     strokeLinecap="round"
//                     initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
//                     animate={{ strokeDashoffset: 2 * Math.PI * 64 * (1 - overallPercentage / 100) }}
//                     transition={{ duration: 1.2, ease: "easeInOut" }}
//                     className="drop-shadow-lg"
//                   />
//                 </svg>
//                 <span className="absolute inset-0 flex flex-col items-center justify-center text-lg font-bold text-white">
//                   {overallPercentage}%
//                   <span className="text-xs font-normal text-gray-300">Overall</span>
//                 </span>
//               </div>

            
//               <div className="flex gap-6 mt-4 text-white text-md">
//                 <p className="flex justify-center items-center gap-1">
//                   <CheckCircle className="text-green-400" size={18} /> {presentCount} Present
//                 </p>
//                 <p className="flex items-center gap-1">
//                   <XCircle className="text-red-400" size={18} /> {absentCount} Absent
//                 </p>
//                 <p className="text-white">{total} Total</p>
//               </div>
//             </div>

          
//             <div className="overflow-x-auto hidden md:block">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="bg-white/20 text-white">
//                     <th className="p-3">Date</th>
//                     <th className="p-3">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {attendance.map((a) => (
//                     <motion.tr
//                       key={a._id}
//                       className="border-b border-white/20 hover:bg-white/10 transition"
//                       whileHover={{ scale: 1.02 }}
//                     >
//                       <td className="p-3 text-gray-200">
//                         {new Date(a.date).toLocaleDateString()}
//                       </td>
//                       <td
//                         className={`p-3 font-semibold flex items-center gap-2 ${
//                           a.status === "Present" ? "text-green-400" : "text-red-400"
//                         }`}
//                       >
//                         {a.status === "Present" ? <CheckCircle size={18} /> : <XCircle size={18} />}
//                         {a.status}
//                       </td>
//                     </motion.tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

        
//             <div className="grid gap-4 md:hidden">
//               {attendance.map((a) => (
//                 <motion.div
//                   key={a._id}
//                   className="p-4 flex justify-evenly items-center rounded-xl bg-white/10 border border-white/20 text-white shadow-md hover:scale-[1.03] transition"
//                   whileTap={{ scale: 0.97 }}
//                 >
//                   <p className="text-sm text-gray-300">
//                     {new Date(a.date).toLocaleDateString()}
//                   </p>
//                   <p
//                     className={`flex items-center gap-2 font-bold mt-1 ${
//                       a.status === "Present" ? "text-green-400" : "text-red-400"
//                     }`}
//                   >
//                     {a.status === "Present" ? <CheckCircle size={18} /> : <XCircle size={18} />}
//                     {a.status}
//                   </p>
//                 </motion.div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

type Attendance = {
  _id: string;
  date: string;
  status: "Present" | "Absent";
};

export default function MyAttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [overallPercentage, setOverallPercentage] = useState<number>(0);
  const [loading, setLoading] = useState(true); // 👈 new state

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("User not found, please login again.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/Dashboard_Students/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          toast.error(
            errorData?.message || `Failed to fetch attendance (Status ${res.status})`
          );
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (data?.success) {
          setAttendance(data.attendance || []);

          const total = data.attendance?.length || 0;
          const presentCount = data.attendance?.filter(
            (a: Attendance) => a.status === "Present"
          ).length;
          const percentage =
            total > 0 ? Math.round((presentCount / total) * 100) : 0;

          setOverallPercentage(percentage);
          toast.success("Attendance fetched successfully ✅");
        } else {
          toast.error(data?.message || "Failed to load attendance");
        }
      } catch (error: any) {
        toast.error(error?.message || "Something went wrong while fetching attendance");
        console.error("Attendance fetch error:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  const total = attendance.length;
  const presentCount = attendance.filter((a) => a.status === "Present").length;
  const absentCount = total - presentCount;

  const getCircleColor = () => {
    if (overallPercentage >= 75) return "rgb(34,197,94)";
    if (overallPercentage >= 50) return "rgb(234,179,8)";
    return "rgb(239,68,68)";
  };

  return (
    <div className="min-h-screen flex flex-col w-full items-center sm:p-6">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl p-6">
        <h2
          style={{
            fontFamily: "'Orbitron', sans-serif",
            WebkitBackgroundClip: "text",
            textShadow:
              "0 0 10px rgba(127, 29, 29, 1), 0 0 10px rgba(127, 29, 29, 1)",
          }}
          className="text-4xl font-bold text-white mb-6 text-center tracking-wide"
        >
          My Attendance
        </h2>

        {loading ? (
          // Loading spinner
          <div className="flex justify-center items-center min-h-[200px] text-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              Loading attendance...
            </div>
          </div>
        ) : attendance.length === 0 ? (
          // No records found
          <div className="flex justify-center items-center min-h-[200px] text-white">
            <p className="text-lg font-semibold">No attendance found</p>
          </div>
        ) : (
          // Your existing UI (unchanged)
          <>
            {/* Circle progress and summary */}
            <div className="flex flex-col items-center mb-8">
               <div className="relative w-36 h-36">
                 <svg className="w-36 h-36 transform -rotate-90">
                   <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke={getCircleColor()}
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 64}
                    strokeDashoffset={2 * Math.PI * 64 * (1 - overallPercentage / 100)}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 64 * (1 - overallPercentage / 100) }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="drop-shadow-lg"
                  />
                </svg>
                <span className="absolute inset-0 flex flex-col items-center justify-center text-lg font-bold text-white">
                  {overallPercentage}%
                  <span className="text-xs font-normal text-gray-300">Overall</span>
                </span>
              </div>

            
              <div className="flex gap-6 mt-4 text-white text-md">
                <p className="flex justify-center items-center gap-1">
                  <CheckCircle className="text-green-400" size={18} /> {presentCount} Present
                </p>
                <p className="flex items-center gap-1">
                  <XCircle className="text-red-400" size={18} /> {absentCount} Absent
                </p>
                <p className="text-white">{total} Total</p>
              </div>
            </div>

          
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/20 text-white">
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a) => (
                    <motion.tr
                      key={a._id}
                      className="border-b border-white/20 hover:bg-white/10 transition"
                      whileHover={{ scale: 1.02 }}
                    >
                      <td className="p-3 text-gray-200">
                        {new Date(a.date).toLocaleDateString()}
                      </td>
                      <td
                        className={`p-3 font-semibold flex items-center gap-2 ${
                          a.status === "Present" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {a.status === "Present" ? <CheckCircle size={18} /> : <XCircle size={18} />}
                        {a.status}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

        
            <div className="grid gap-4 md:hidden">
              {attendance.map((a) => (
                <motion.div
                  key={a._id}
                  className="p-4 flex justify-evenly items-center rounded-xl bg-white/10 border border-white/20 text-white shadow-md hover:scale-[1.03] transition"
                  whileTap={{ scale: 0.97 }}
                >
                  <p className="text-sm text-gray-300">
                    {new Date(a.date).toLocaleDateString()}
                  </p>
                  <p
                    className={`flex items-center gap-2 font-bold mt-1 ${
                      a.status === "Present" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {a.status === "Present" ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {a.status}
                  </p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
