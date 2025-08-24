// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";

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
//         if (res.data.success) {
//           // sort descending based on attendance %
//           const sorted = res.data.students.sort(
//             (a: Candidate, b: Candidate) =>
//               b.attendance.percentage - a.attendance.percentage
//           );
//           setUsers(sorted);
//         } else {
//           console.error("Failed to fetch users:", res.data.message);
//         }
//       } catch (err) {
//         console.error("Error fetching users:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const top3 = users.slice(0, 3); // Top 3 students

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold">See Score</h1>
//       <p className="mt-2 text-gray-600">
//         Here you can check all registered candidates.
//       </p>

//       {/* Loading */}
//       {loading && <p className="mt-4 text-blue-600">Loading users...</p>}

//       {/* ⭐ Top 3 Students */}
//       {!loading && top3.length > 0 && (
//         <div className="mt-6">
//           <h2 className="text-xl font-bold text-green-700 mb-4">
//             🏆 Top Performers
//           </h2>
//           <div className="grid md:grid-cols-3 gap-4">
//             {top3.map((student, index) => (
//               <div
//                 key={index}
//                 className="bg-white shadow-lg rounded-2xl p-4 border relative"
//               >
//                 <span className="absolute top-2 right-2 text-2xl">
//                   {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
//                 </span>
//                 <h3 className="text-lg font-semibold">{student.name}</h3>
//                 <p className="text-gray-600">{student.rollNo}</p>
//                 <p className="text-blue-600 font-bold mt-2">
//                   {student.attendance.percentage}%
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* 📋 Full Users Table */}
//       {!loading && users.length > 0 ? (
//         <div className="mt-10 overflow-x-auto">
//           <h2 className="text-lg font-semibold mb-2">📋 All Students</h2>
//           <table className="w-full border border-gray-200 rounded-lg">
//             <thead className="bg-gray-100 text-left">
//               <tr>
//                 <th className="p-3 border">Name</th>
//                 <th className="p-3 border">Roll No</th>
//                 <th className="p-3 border">Attendance %</th>
//                 {/* <th className="p-3 border">Joined On</th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="p-3 border">{user.name}</td>
//                   <td className="p-3 border">{user.rollNo}</td>
//                   <td className={`p-3 border font-semibold ${user.attendance.percentage <= 75 ? "text-red-500" : "text-green-700"} `}>
//                     {user.attendance.percentage}%
//                   </td>
                 
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         !loading && (
//           <p className="mt-4 text-red-500">No users found.</p>
//         )
//       )}
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading2";

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
        if (res.data.success) {
          // Sort by percentage first, then by name if same percentage
          const sorted = res.data.students.sort(
            (a: Candidate, b: Candidate) => {
              if (b.attendance.percentage === a.attendance.percentage) {
                return a.name.localeCompare(b.name);
              }
              return b.attendance.percentage - a.attendance.percentage;
            }
          );
          setUsers(sorted);
        } else {
          console.error("Failed to fetch users:", res.data.message);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const top3 = users.slice(0, 3);

  return (
    <div className="min-h-screen  sm:p-6 text-white">
      <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            WebkitBackgroundClip: "text",
            textShadow:
              "0 0 15px rgba(127, 29, 29, 1), 0 0 30px rgba(127, 29, 29, 1)",
          }}  className="text-3xl font-bold text-center mb-2">Performance Dashboard</h1>
      <p className="text-gray-300 text-center mb-6">Track attendance and top performers.</p>

      {/* Loading */}
      {loading && <Loading/>}

    
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
                <h3 className="text-xl font-bold">{student.name}</h3>
                <p className="text-gray-300 text-sm">{student.rollNo}</p>
                <p
                  className={`mt-4 text-3xl font-extrabold ${
                    index === 0
                      ? "text-green-500"
                      : index === 1
                      ? "text-amber-600"
                      : "text-white"
                  }`}
                >
                  {student.attendance.percentage}%
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
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-white/10 transition duration-200"
                  >
                    <td className="p-3">{user.name}</td>
                    <td className="p-3 text-center">{user.rollNo}</td>
                    <td
                      className={`p-3 text-center font-bold ${
                        user.attendance.percentage <= 75
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {user.attendance.percentage}%
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
