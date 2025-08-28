// "use client";

// import React, { useEffect, useState } from "react";
// import Loading from "@/components/Loading2";

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
//   const [isPresent , setisPresent] = useState(false)
//   const [date, setDate] = useState<string>(() => {
//     const t = new Date();
//     const yyyy = t.getFullYear();
//     const mm = String(t.getMonth() + 1).padStart(2, "0");
//     const dd = String(t.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   });
//   const [loading, setLoading] = useState(false);
//   const [markingIds, setMarkingIds] = useState<string[]>([]);

//   async function fetchStudents() {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/attendance/students");
//       const data = await res.json();
//       if (data.success) setStudents(data.students);
//       else console.error("Failed to fetch students", data.message);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const token = localStorage.getItem("token") || null;
//   async function markAttendance(
//     candidateId: string,
//     status: "Present" | "Absent"
//   ) {
//     if (!date) {
//       alert("Please pick a date");
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
//       if (data.success) {
//         await fetchStudents();
//         setisPresent(true)
//       } else {
//         alert(data.message || "Failed to mark attendance");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong");
//     } finally {
//       setMarkingIds((s) => s.filter((id) => id !== candidateId));
//     }
//   }

//   return (
//     <div className="sm:p-6 w-full  sm:max-w-7xl mx-auto text-white">
//       {/* Heading */}
//       <h1
//         style={{
//           fontFamily: "'Orbitron', sans-serif",
//           WebkitBackgroundClip: "text",
//           textShadow:
//             "0 0 15px rgba(127, 29, 29, 1), 0 0 30px rgba(127, 29, 29, 1)",
//         }}
//         className="text-3xl font-bold mb-6 text-center  drop-shadow-lg"
//       >
//         Mark Attendance
//       </h1>

//       {/* Date Picker & Refresh */}
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
//       </div>

//       {/* Table */}
//       {loading ? (
//         // <p className="text-center text-gray-300">Loading students...</p>
//         <Loading />
//       ) : (
//         <div className="overflow-x-auto rounded-xl backdrop-blur-lg bg-white/10 shadow-xl border border-white/20">
//           <table className="w-full text-sm sm:text-base">
//             <thead>
//               <tr className="bg-white/20 text-left text-gray-200">
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Roll No</th>
//                 <th className="p-3">Branch</th>
//                 <th className="p-3 text-center">Mark</th>
//                 <th className="p-3 text-center">Attendance %</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((s, i) => (
//                 <tr
//                   key={s.id}
//                   className={`hover:bg-white/10 transition ${
//                     i % 2 === 0 ? "bg-white/5" : "bg-transparent"
//                   }`}
//                 >
//                   <td className="p-3">{s.name}</td>
//                   <td className="p-3">{s.rollNo}</td>
//                   <td className="p-3">{s.branch}</td>
//                   <td className="p-3 text-center flex  space-x-2">
//                     <button
//                       disabled={markingIds.includes(s.id)}
//                       onClick={() => markAttendance(s.id, "Present")}
//                       className={`px-3 ${isPresent ? "bg-green" : "bg-transparent"} cursor-pointer
//                        hidden sm:flex py-1 rounded-lg bg-green-500/80 hover:bg-green-500 text-white shadow-md disabled:opacity-50`}
//                     >
//                       Present
//                     </button>
//                     <button
//                       disabled={markingIds.includes(s.id)}
//                       onClick={() => markAttendance(s.id, "Absent")}
//                       className="px-3  hidden sm:flex py-1 rounded-lg cursor-pointer bg-red-500/80 hover:bg-red-500 text-white shadow-md disabled:opacity-50"
//                     >
//                       Absent
//                     </button>

//                     <div className="flex   sm:hidden gap-2">
//                       <div
                      
//                         onClick={() => markAttendance(s.id, "Present")}
//                         className={`w-10 h-10 flex text-xl items-center justify-center rounded-full  backdrop-blur-md bg-white/20 shadow-md 
//                   border border-white/30 text-green-800 font-bold`}
//                       >
//                         P
//                       </div>
//                       <div
//                         onClick={() => markAttendance(s.id, "Absent")}
//                         className="w-10 h-10 flex text-xl sm:hidden items-center justify-center rounded-full 
//                   backdrop-blur-md bg-white/20 shadow-md 
//                   border border-white/30 text-red-600 font-bold"
//                       >
//                         A
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-3 text-center font-semibold">
//                     {s.attendance.percentage}%
//                     <div className="text-xs text-gray-400">
//                       ({s.attendance.present}/{s.attendance.total})
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


"use client";

import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading2";

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

  // ✅ Track marked status locally (studentId -> "Present"/"Absent")
  const [markedStatus, setMarkedStatus] = useState<Record<string, "Present" | "Absent">>({});

  async function fetchStudents() {
    try {
      setLoading(true);
      const res = await fetch("/api/attendance/students");
      const data = await res.json();
      if (data.success) setStudents(data.students);
      else console.error("Failed to fetch students", data.message);
    } catch (err) {
      console.error(err);
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
      alert("Please pick a date");
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
      if (data.success) {
        await fetchStudents();
        // ✅ Update local highlight
        setMarkedStatus((prev) => ({ ...prev, [candidateId]: status }));
      } else {
        alert(data.message || "Failed to mark attendance");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setMarkingIds((s) => s.filter((id) => id !== candidateId));
    }
  }

  return (
    <div className="sm:p-6 w-full sm:max-w-7xl mx-auto text-white">
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
                <th className="p-3">Branch</th>
                <th className="p-3 text-center">Mark</th>
                <th className="p-3 text-center">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr
                  key={s.id}
                  //  Highlight based on last marked status
                  className={` transition ${
                    markedStatus[s.id] === "Present"
                      ? "bg-green-500/30"
                      : markedStatus[s.id] === "Absent"
                      ? "bg-red-500/30"
                      : i % 2 === 0
                      ? "bg-white/5"
                      : "bg-transparent"
                  }`}
                >
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.rollNo}</td>
                  <td className="p-3">{s.branch}</td>
                  <td className="p-3 text-center flex space-x-2">
                    <button
                      disabled={markingIds.includes(s.id)}
                      onClick={() => markAttendance(s.id, "Present")}
                      className="px-3 hidden cursor-pointer sm:flex py-1 rounded-lg bg-green-500/80 hover:bg-green-500 text-white shadow-md disabled:opacity-50"
                    >
                      Present
                    </button>
                    <button
                      disabled={markingIds.includes(s.id)}
                      onClick={() => markAttendance(s.id, "Absent")}
                      className="px-3 hidden sm:flex py-1 rounded-lg cursor-pointer bg-red-500/80 hover:bg-red-500 text-white shadow-md disabled:opacity-50"
                    >
                      Absent
                    </button>

                    {/* Mobile */}
                    <div className="flex sm:hidden gap-2">
                      <div
                        onClick={() => markAttendance(s.id, "Present")}
                        className="w-10 h-10 flex text-xl items-center justify-center rounded-full backdrop-blur-md bg-white/20 shadow-md border border-white/30 text-green-800 font-bold"
                      >
                        P
                      </div>
                      <div
                        onClick={() => markAttendance(s.id, "Absent")}
                        className="w-10 h-10 flex text-xl items-center justify-center rounded-full backdrop-blur-md bg-white/20 shadow-md border border-white/30 text-red-600 font-bold"
                      >
                        A
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center font-semibold">
                    {s.attendance.percentage}%
                    <div className="text-xs text-gray-400">
                      ({s.attendance.present}/{s.attendance.total})
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
