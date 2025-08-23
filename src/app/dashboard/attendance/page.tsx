

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
    <div className="p-6 max-w-7xl mx-auto text-white">
      {/* Heading */}
      <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            WebkitBackgroundClip: "text",
            textShadow:
              "0 0 15px rgba(127, 29, 29, 1), 0 0 30px rgba(127, 29, 29, 1)",
          }}  className="text-3xl font-bold mb-6 text-center  drop-shadow-lg">
        Mark Attendance
      </h1>

      {/* Date Picker & Refresh */}
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

      {/* Table */}
      {loading ? (
        // <p className="text-center text-gray-300">Loading students...</p>
        <Loading/>
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
                  className={`hover:bg-white/10 transition ${
                    i % 2 === 0 ? "bg-white/5" : "bg-transparent"
                  }`}
                >
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.rollNo}</td>
                  <td className="p-3">{s.branch}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      disabled={markingIds.includes(s.id)}
                      onClick={() => markAttendance(s.id, "Present")}
                      className="px-3 py-1 rounded-lg bg-green-500/80 hover:bg-green-500 text-white shadow-md disabled:opacity-50"
                    >
                      Present
                    </button>
                    <button
                      disabled={markingIds.includes(s.id)}
                      onClick={() => markAttendance(s.id, "Absent")}
                      className="px-3 py-1 rounded-lg bg-red-500/80 hover:bg-red-500 text-white shadow-md disabled:opacity-50"
                    >
                      Absent
                    </button>
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
