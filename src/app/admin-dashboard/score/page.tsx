
// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast, Toaster } from "react-hot-toast";
// import Loading from "@/components/Loading2";

// type Attendance = {
//   total: number;
//   present: number;
//   percentage: number;
// };

// type Candidate = {
//   _id: string;
//   name: string;
//   email: string;
//   rollNo: string;
//   branch: string;
//   createdAt: string;
//   attendance: Attendance;
// };

// export default function ScorePage() {
//   const [users, setUsers] = useState<Candidate[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get("/api/attendance/students");

//         if (res?.data?.success) {
//           const sorted = res?.data?.students.sort(
//             (a: Candidate, b: Candidate) => {
//               if (b.attendance.percentage === a.attendance.percentage) {
//                 return a.name.localeCompare(b.name);
//               }
//               return b.attendance.percentage - a.attendance.percentage;
//             }
//           );

//           setUsers(sorted);
//           toast.success("Students fetched successfully");
//         } else {
//           toast.error(res?.data?.message || "Failed to fetch students");
//         }
//       } catch (err: any) {
//         toast.error(err?.response?.data?.message || "Error fetching students");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const top3 = users.slice(0, 3);

//   //Function to download CSV
//   const downloadCSV = () => {
//     if (users.length === 0) {
//       toast.error("No data to download");
//       return;
//     }

//     const headers = ["Name", "Student No", "Branch", "Attendance (%)"];
//     const rows = users.map((u) => [
//       u.name,
//       u.rollNo,
//       u.branch,
//       u.attendance.percentage,
//     ]);

//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       [headers, ...rows].map((row) => row.join(",")).join("\n");

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "attendance_report.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="min-h-screen mb-10 sm:p-6 text-white">
//       <Toaster />
//       <h1
//         style={{
//           fontFamily: "'Orbitron', sans-serif",
//           WebkitBackgroundClip: "text",
//           textShadow:
//             "0 0 15px rgba(127, 29, 29, 1), 0 0 30px rgba(127, 29, 29, 1)",
//         }}
//         className="text-3xl font-bold text-center mb-2"
//       >
//         Performance Dashboard
//       </h1>
//       <p className="text-gray-300 text-center mb-6">
//         Track attendance and top performers.
//       </p>

//       {loading && <Loading />}

      
//       {!loading && users.length > 0 && (
//       <div className="flex justify-center md:justify-end mb-6">
//   <button
//     onClick={downloadCSV}
//     className="relative cursor-pointer overflow-hidden group 
//     bg-white/10 backdrop-blur-2xl 
//     text-white px-6 py-2.5 rounded-2xl font-semibold 
//     border border-green-500/60 
//     shadow-[0_0_10px_rgba(34,197,94,0.3)]
//     transition-all duration-300 hover:scale-105
//     hover:shadow-[0_0_20px_#7F1D1D]"
//   >
//     <span className="relative z-10 flex items-center gap-2">
//     Download Attendance
//     </span>

  
//     <span className="absolute inset-0 bg-gradient-to-r from-green-500/70 to-green-700/70 
//     opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></span>


//     <span className="absolute -inset-1 rounded-2xl border border-[#7F1D1D]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
//   </button>
// </div>


//       )}

//       {!loading && top3.length > 0 && (
//         <div className="mb-10">
//           <h2 className="text-2xl font-semibold mb-6">🏆 Top Performers</h2>
//           <div className="grid gap-6 md:grid-cols-3">
//             {top3.map((student, index) => (
//               <div
//                 key={index}
//                 className="relative backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20 shadow-lg hover:scale-105 transition transform duration-300"
//               >
//                 <span className="absolute -top-4 -right-4 text-4xl">
//                   {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
//                 </span>
//                 <h3 className="text-xl font-bold">{student?.name}</h3>
//                 <p className="text-gray-300 text-sm">{student?.rollNo}</p>
//                 <p
//                   className={`mt-4 text-3xl font-extrabold ${
//                     index === 0
//                       ? "text-[#FFD700]"
//                       : index === 1
//                       ? "text-[#C0C0C0]"
//                       : "text-[#CD7F32]"
//                   }`}
//                 >
//                   {student?.attendance?.percentage}%
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {!loading && users.length > 0 ? (
//         <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 shadow-xl">
//           <h2 className="text-xl font-semibold mb-4">📋 All Students</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-white/20">
//                   <th className="p-3 text-left">Name</th>
//                   <th className="p-3">Student No</th>
//                   <th className="p-3">Attendance %</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user, idx) => (
//                   <tr
//                     key={idx}
//                     className="hover:bg-white/10 transition duration-200"
//                   >
//                     <td className="p-3">{user?.name}</td>
//                     <td className="p-3 text-center">{user?.rollNo}</td>
//                     <td
//                       className={`p-3 text-center font-bold ${
//                         user?.attendance?.percentage <= 75
//                           ? "text-red-400"
//                           : "text-green-400"
//                       }`}
//                     >
//                       {user?.attendance?.percentage}%
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         !loading && <p className="text-red-400">No users found.</p>
//       )}
//     </div>
//   );
// }



"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Loading from "@/components/Loading2";
import jsPDF from "jspdf";  

type Attendance = {
  total: number;
  present: number;
  percentage: number;
};

type Candidate = {
  _id: string;
  name: string;
  email: string;
  rollNo: string;
  branch: string;
  createdAt: string;
  attendance: Attendance;
};

export default function ScorePage() {
  const [users, setUsers] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/attendance/students");

        if (res?.data?.success) {
          const sorted = res?.data?.students.sort(
            (a: Candidate, b: Candidate) => {
              if (b.attendance.percentage === a.attendance.percentage) {
                return a.name.localeCompare(b.name);
              }
              return b.attendance.percentage - a.attendance.percentage;
            }
          );

          setUsers(sorted);
          toast.success("Students fetched successfully");
        } else {
          toast.error(res?.data?.message || "Failed to fetch students");
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Error fetching students");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const top3 = users.slice(0, 3);

  // Function to download CSV
  const downloadCSV = () => {
    if (users.length === 0) {
      toast.error("No data to download");
      return;
    }

    const headers = ["Name", "Student No", "Branch", "Attendance (%)"];
    const rows = users.map((u) => [
      u.name,
      u.rollNo,
      u.branch,
      u.attendance.percentage,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to download PDF
  const downloadPDF = () => {
    if (users.length === 0) {
      toast.error("No data to download");
      return;
    }

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Attendance Report", 70, 20);

    // Headers
    doc.setFontSize(12);
    let y = 40;
    doc.text("Name", 10, y);
    doc.text("Student No", 60, y);
    doc.text("Branch", 110, y);
    doc.text("Attendance (%)", 160, y);
    y += 10;

    // Data rows
    doc.setFont("helvetica", "normal");
    users.forEach((u) => {
      doc.text(u.name, 10, y);
      doc.text(u.rollNo, 60, y);
      doc.text(u.branch, 110, y);
      doc.text(`${u.attendance.percentage}%`, 160, y);
      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("attendance_report.pdf");
    toast.success("PDF downloaded successfully!");
  };

  return (
    <div className="min-h-screen mb-10 sm:p-6 text-white">
      <Toaster />
      <h1
        style={{
          fontFamily: "'Orbitron', sans-serif",
          WebkitBackgroundClip: "text",
          textShadow:
            "0 0 15px rgba(127, 29, 29, 1), 0 0 30px rgba(127, 29, 29, 1)",
        }}
        className="text-3xl font-bold text-center mb-2"
      >
        Performance Dashboard
      </h1>
      <p className="text-gray-300 text-center mb-6">
        Track attendance and top performers.
      </p>

      {loading && <Loading />}

    
      {!loading && users.length > 0 && (
        <div className="flex flex-wrap justify-center md:justify-end gap-4 mb-6">
          {/* CSV Button */}
          <button
            onClick={downloadCSV}
            className="relative cursor-pointer overflow-hidden group 
            bg-white/10 backdrop-blur-2xl 
            text-white px-6 py-2.5 rounded-2xl font-semibold 
            border border-green-500/60 
            shadow-[0_0_10px_rgba(34,197,94,0.3)]
            transition-all duration-300 hover:scale-105
            hover:shadow-[0_0_20px_#7F1D1D]"
          >
            <span className="relative z-10 flex items-center gap-2">
            Download CSV
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-green-500/70 to-green-700/70 
            opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></span>
            <span className="absolute -inset-1 rounded-2xl border border-[#7F1D1D]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>

          {/* PDF Button */}
          <button
            onClick={downloadPDF}
            className="relative cursor-pointer overflow-hidden group 
            bg-white/10 backdrop-blur-2xl 
            text-white px-6 py-2.5 rounded-2xl font-semibold 
            border border-red-900 
            shadow-[0_0_10px_rgba(59,130,246,0.3)]
            transition-all duration-300 hover:scale-105
            hover:shadow-[0_0_20px_#7F1D1D]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Download PDF
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-red-900 to-red-950 
            opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></span>
            <span className="absolute -inset-1 rounded-2xl border border-[#7F1D1D]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </div>
      )}

  
      {!loading && top3.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">🏆 Top Performers</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {top3.map((student, index) => (
              <div
                key={index}
                className="relative backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20 shadow-lg hover:scale-105 transition transform duration-300"
              >
                <span className="absolute -top-4 -right-4 text-4xl">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </span>
                <h3 className="text-xl font-bold">{student?.name}</h3>
                <p className="text-gray-300 text-sm">{student?.rollNo}</p>
                <p
                  className={`mt-4 text-3xl font-extrabold ${
                    index === 0
                      ? "text-[#FFD700]"
                      : index === 1
                      ? "text-[#C0C0C0]"
                      : "text-[#CD7F32]"
                  }`}
                >
                  {student?.attendance?.percentage}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && users.length > 0 ? (
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">📋 All Students</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/20">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3">Student No</th>
                  <th className="p-3">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-white/10 transition duration-200"
                  >
                    <td className="p-3">{user?.name}</td>
                    <td className="p-3 text-center">{user?.rollNo}</td>
                    <td
                      className={`p-3 text-center font-bold ${
                        user?.attendance?.percentage <= 75
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {user?.attendance?.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading && <p className="text-red-400">No users found.</p>
      )}
    </div>
  );
}
