






"use client";

import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading2";
import {toast,Toaster} from "react-hot-toast";
type StudentUI = {
  id: string;
  name: string;
  rollNo: string;
  branch: string;
  attendance: {
    total: number;
    present: number;
    percentage: number;
  };
};

export default function AttendancePage() {
  const [students, setStudents] = useState<StudentUI[]>([]);
  const [date, setDate] = useState<string>(() => {
    const t = new Date();
    const yyyy = t.getFullYear();
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const dd = String(t.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [loading, setLoading] = useState(false);
  const [markingIds, setMarkingIds] = useState<string[]>([]);

  const [markedStatus, setMarkedStatus] = useState<Record<string, "Present" | "Absent">>({});

  

async function fetchStudents() {
  try {
  
    const res = await fetch("/api/attendance/students");

    if (!res.ok) {
      throw new Error(`Server error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (data?.success) {
      setStudents(data.students);
      toast.success("Students fetched successfully");
    } else {
      toast.error(data?.message || "Failed to fetch students ");
    }
  } catch (err: any) {
    toast.error(err.message || "Something went wrong while fetching students ");
  } finally {
    setLoading(false);
  }
}


  useEffect(() => {
    fetchStudents();
  }, []);

  const token = localStorage.getItem("token") || null;
  async function markAttendance(
    candidateId: string,
    status: "Present" | "Absent"
  ) {
    if (!date) {
      toast.error("Please pick a date");
      return;
    }
    try {
      setMarkingIds((s) => [...s, candidateId]);
      const res = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ candidateId, date, status }),
      });
      const data = await res.json();
      if (data?.success) {
        await fetchStudents();
        //  Update local highlight
        setMarkedStatus((prev) => ({ ...prev, [candidateId]: status }));
      } else {
        toast.error(data?.message || "Failed to mark attendance");
      }
    } catch (err) {
      // console.error(err);
      toast.error("Something went wrong");
    } finally {
      setMarkingIds((s) => s.filter((id) => id !== candidateId));
    }
  }

  return (
    <div className="sm:p-6 w-[100%] sm:max-w-7xl mx-auto text-white">
      <Toaster/>
      <h1
        style={{
          fontFamily: "'Orbitron', sans-serif",
          WebkitBackgroundClip: "text",
          textShadow:
            "0 0 15px rgba(127, 29, 29, 1), 0 0 30px rgba(127, 29, 29, 1)",
        }}
        className="text-3xl font-bold mb-6 text-center drop-shadow-lg"
      >
        Mark Attendance
      </h1>

      {/* Date Picker */}
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <label className="font-medium">Select Date:</label>
        <input
          type="date"
          className="border-none rounded px-4 py-2 bg-white/10 backdrop-blur-md shadow-md focus:ring-2 focus:ring-red-400"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-gradient-to-r from-black to-red-900 border-1 border-white cursor-pointer text-white font-semibold rounded-lg shadow-md hover:scale-105 transition"
          onClick={() => fetchStudents()}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto rounded-xl backdrop-blur-lg bg-white/10 shadow-xl border border-white/20">
          <table className="w-full text-sm sm:text-base">
            <thead>
              <tr className="bg-white/20 text-left text-gray-200">
                <th className="p-3">Name</th>
                <th className="p-3">Roll No</th>
                <th className="p-3 hidden sm:block">Branch</th>
                <th className="p-3 text-center">Mark</th>
                <th className="p-3 hidden sm:flex text-center">Attendance %</th>
                <th className="p-3 flex sm:hidden text-center">%</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr
                  key={s?.id}
                  //  Highlight based on last marked status
                  className={` transition ${
                    markedStatus[s?.id] === "Present"
                      ? "bg-green-500/30"
                      : markedStatus[s?.id] === "Absent"
                      ? "bg-red-500/30"
                      : i % 2 === 0
                      ? "bg-white/5"
                      : "bg-transparent"
                  }`}
                >
                  <td className="p-3">{s?.name}</td>
                  <td className="p-3">{s?.rollNo}</td>
                  <td className="p-3 max-[700px]:hidden">{s?.branch}</td>
                  <td className="p-3 text-center flex space-x-2">
                    <button
                      disabled={markingIds.includes(s?.id)}
                      onClick={() => markAttendance(s?.id, "Present")}
                      className="px-3 hidden cursor-pointer sm:flex py-1 rounded-lg bg-green-500/80 hover:bg-green-500 text-white shadow-md disabled:opacity-50"
                    >
                      Present
                    </button>
                    <button
                      disabled={markingIds.includes(s?.id)}
                      onClick={() => markAttendance(s?.id, "Absent")}
                      className="px-3 hidden sm:flex py-1 rounded-lg cursor-pointer bg-red-500/80 hover:bg-red-500 text-white shadow-md disabled:opacity-50"
                    >
                      Absent
                    </button>

                    {/* Mobile */}
                    <div className="flex sm:hidden gap-2">
                      <div
                        onClick={() => markAttendance(s?.id, "Present")}
                        className="w-10 h-10 flex text-xl items-center justify-center rounded-full backdrop-blur-md bg-white/20 shadow-md border border-white/30 text-green-800 font-bold"
                      >
                        P
                      </div>
                      <div
                        onClick={() => markAttendance(s?.id, "Absent")}
                        className="w-10 h-10 flex text-xl items-center justify-center rounded-full backdrop-blur-md bg-white/20 shadow-md border border-white/30 text-red-600 font-bold"
                      >
                        A
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center font-semibold">
                    {s?.attendance?.percentage}%
                    <div className="text-xs text-gray-400">
                      ({s?.attendance?.present}/{s?.attendance?.total})
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


// "use client";

// import React, { useEffect, useState } from "react";
// import Loading from "@/components/Loading2";
// import { toast, Toaster } from "react-hot-toast";

// type StudentUI = {
//   id: string;
//   name: string;
//   rollNo: string;
//   branch: string;
//   attendance: {
//     total: number;
//     present: number;
//     percentage: number;
//   };
// };

// export default function AttendancePage() {
//   const [students, setStudents] = useState<StudentUI[]>([]);
//   const [date, setDate] = useState<string>(() => {
//     const t = new Date();
//     const yyyy = t.getFullYear();
//     const mm = String(t.getMonth() + 1).padStart(2, "0");
//     const dd = String(t.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   });
//   const [loading, setLoading] = useState(false);
//   const [markingIds, setMarkingIds] = useState<string[]>([]);
//   const [markedStatus, setMarkedStatus] = useState<Record<string, "Present" | "Absent">>({});
//   const [isLocked, setIsLocked] = useState(false);

//   const token = localStorage.getItem("token") || null;

//   async function fetchStudents() {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/attendance/students");
//       if (!res.ok) throw new Error(`Server error: ${res.status} ${res.statusText}`);
//       const data = await res.json();
//       if (data?.success) {
//         setStudents(data.students);
//         toast.success("Students fetched successfully");
//       } else {
//         toast.error(data?.message || "Failed to fetch students ");
//       }
//     } catch (err: any) {
//       toast.error(err.message || "Something went wrong while fetching students ");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Check if the date is locked
//   async function checkLockedStatus(currentDate: string) {
//     try {
//       const res = await fetch(`/api/attendance/lock?date=${currentDate}`);
//       const data = await res.json();
//       setIsLocked(data.locked);
//     } catch (err) {
//       toast.error("Failed to check lock status");
//     }
//   }

//   useEffect(() => {
//     fetchStudents();
//     checkLockedStatus(date);
//   }, [date]);

//   async function markAttendance(candidateId: string, status: "Present" | "Absent") {
//     if (!date) {
//       toast.error("Please pick a date");
//       return;
//     }
//     if (isLocked) {
//       toast.error("Attendance for this date is locked. Cannot make changes.");
//       return;
//     }
//     try {
//       setMarkingIds((s) => [...s, candidateId]);
//       const res = await fetch("/api/attendance/mark", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ candidateId, date, status }),
//       });
//       const data = await res.json();
//       if (data?.success) {
//         await fetchStudents();
//         setMarkedStatus((prev) => ({ ...prev, [candidateId]: status }));
//       } else {
//         toast.error(data?.message || "Failed to mark attendance");
//       }
//     } catch (err) {
//       toast.error("Something went wrong");
//     } finally {
//       setMarkingIds((s) => s.filter((id) => id !== candidateId));
//     }
//   }

//   // Lock attendance for the date
//   async function lockAttendance() {
//     if (!date) return toast.error("Pick a date first");
//     try {
//       const res = await fetch("/api/attendance/lock", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ date }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         toast.success("Attendance locked!");
//         setIsLocked(true);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err) {
//       toast.error("Failed to lock attendance");
//     }
//   }

//   return (
//     <div className="sm:p-6 w-[100%] sm:max-w-7xl mx-auto text-white">
//       <Toaster />
//       <h1
//         style={{
//           fontFamily: "'Orbitron', sans-serif",
//           WebkitBackgroundClip: "text",
//           textShadow: "0 0 15px rgba(127, 29, 29, 1), 0 0 30px rgba(127, 29, 29, 1)",
//         }}
//         className="text-3xl font-bold mb-6 text-center drop-shadow-lg"
//       >
//         Mark Attendance
//       </h1>

//       {/* Date Picker + Lock Button */}
//       <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
//         <label className="font-medium">Select Date:</label>
//         <input
//           type="date"
//           className="border-none rounded px-4 py-2 bg-white/10 backdrop-blur-md shadow-md focus:ring-2 focus:ring-red-400"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//         />
//         <button
//           className="px-4 py-2 bg-gradient-to-r from-black to-red-900 border-1 border-white cursor-pointer text-white font-semibold rounded-lg shadow-md hover:scale-105 transition"
//           onClick={() => fetchStudents()}
//         >
//           Refresh
//         </button>

//         <button
//           disabled={isLocked}
//           onClick={lockAttendance}
//           className="px-4 py-2 bg-red-700 text-white rounded-lg shadow-md hover:bg-red-800 disabled:opacity-50"
//         >
//           {isLocked ? "Locked" : "Lock Attendance"}
//         </button>
//       </div>

//       {loading ? (
//         <Loading />
//       ) : (
//         <div className="overflow-x-auto rounded-xl backdrop-blur-lg bg-white/10 shadow-xl border border-white/20">
//           <table className="w-full text-sm sm:text-base">
//             <thead>
//               <tr className="bg-white/20 text-left text-gray-200">
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Roll No</th>
//                 <th className="p-3 hidden sm:block">Branch</th>
//                 <th className="p-3 text-center">Mark</th>
//                 <th className="p-3 hidden sm:flex text-center">Attendance %</th>
//                 <th className="p-3 flex sm:hidden text-center">%</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((s, i) => (
//                 <tr
//                   key={s?.id}
//                   className={`transition ${
//                     markedStatus[s?.id] === "Present"
//                       ? "bg-green-500/30"
//                       : markedStatus[s?.id] === "Absent"
//                       ? "bg-red-500/30"
//                       : i % 2 === 0
//                       ? "bg-white/5"
//                       : "bg-transparent"
//                   }`}
//                 >
//                   <td className="p-3">{s?.name}</td>
//                   <td className="p-3">{s?.rollNo}</td>
//                   <td className="p-3 max-[700px]:hidden">{s?.branch}</td>
//                   <td className="p-3 text-center flex space-x-2">
//                     <button
//                       disabled={markingIds.includes(s?.id) || isLocked}
//                       onClick={() => markAttendance(s?.id, "Present")}
//                       className="px-3 hidden sm:flex py-1 rounded-lg bg-green-500/80 hover:bg-green-500 text-white shadow-md disabled:opacity-50"
//                     >
//                       Present
//                     </button>
//                     <button
//                       disabled={markingIds.includes(s?.id) || isLocked}
//                       onClick={() => markAttendance(s?.id, "Absent")}
//                       className="px-3 hidden sm:flex py-1 rounded-lg bg-red-500/80 hover:bg-red-500 text-white shadow-md disabled:opacity-50"
//                     >
//                       Absent
//                     </button>

//                     {/* Mobile Buttons */}
//                     <div className="flex sm:hidden gap-2">
//                       <div
//                         onClick={() => markAttendance(s?.id, "Present")}
//                         className={`w-10 h-10 flex text-xl items-center justify-center rounded-full backdrop-blur-md bg-white/20 shadow-md border border-white/30 text-green-800 font-bold ${
//                           isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
//                         }`}
//                       >
//                         P
//                       </div>
//                       <div
//                         onClick={() => markAttendance(s?.id, "Absent")}
//                         className={`w-10 h-10 flex text-xl items-center justify-center rounded-full backdrop-blur-md bg-white/20 shadow-md border border-white/30 text-red-600 font-bold ${
//                           isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
//                         }`}
//                       >
//                         A
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-3 text-center font-semibold">
//                     {s?.attendance?.percentage}%
//                     <div className="text-xs text-gray-400">
//                       ({s?.attendance?.present}/{s?.attendance?.total})
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }
