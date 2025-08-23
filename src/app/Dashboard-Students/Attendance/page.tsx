
"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading2";

type Attendance = {
  _id: string;
  date: string;
  status: "Present" | "Absent";
};

export default function MyAttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [overallPercentage, setOverallPercentage] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await fetch("/api/Dashboard_Students/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (data.success) {
        setAttendance(data.attendance);

        const total = data.attendance.length;
        const presentCount = data.attendance.filter(
          (a: Attendance) => a.status === "Present"
        ).length;
        const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;
        setOverallPercentage(percentage);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen  flex flex-col items-center p-6">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-wide">
          My Attendance
        </h2>

        
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="url(#grad)"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 56}
                strokeDashoffset={
                  2 * Math.PI * 56 * (1 - overallPercentage / 100)
                }
                strokeLinecap="round"
                className="transition-all duration-700 ease-in-out"
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(127, 29, 29)" />
                  <stop offset="100%" stopColor="rgb(100, 29, 29)" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
              {overallPercentage}%
            </span>
          </div>
        </div>

        
        <div className="overflow-x-auto">
          <table className="hidden md:table w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/20 text-white">
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a) => (
                <tr
                  key={a._id}
                  className="border-b border-white/20 hover:bg-white/10 transition"
                >
                  <td className="p-3 text-gray-200">
                    {new Date(a.date).toLocaleDateString()}
                  </td>
                  <td
                    className={`p-3 font-semibold ${
                      a.status === "Present" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {a.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card View */}
          <div className="grid gap-4 md:hidden">
            {attendance.map((a) => (
              <div
                key={a._id}
                className="p-4 rounded-xl bg-white/10 border border-white/20 text-white shadow hover:scale-[1.02] transition"
              >
                <p className="text-sm text-gray-300">
                  {new Date(a.date).toLocaleDateString()}
                </p>
                <p
                  className={`font-bold ${
                    a.status === "Present" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {a.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
