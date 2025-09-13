"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import {
  FaTasks,
  FaUserCheck,
  FaFileUpload,
  FaChartLine,
} from "react-icons/fa";

export default function AdminDashboardHome() {
  return (
    <div className="min-h-screen text-white sm:p-6">
       <Toaster/>
      <header className="mb-12 text-center">
        <h1
          style={{
            fontFamily: "'Orbitron', sans-serif",
            WebkitBackgroundClip: "text",
            textShadow:
              "0 0 15px rgba(127, 29, 29, 1), 0 0 30px rgba(127, 29, 29, 1)",
          }}
          className="text-4xl md:text-5xl font-extrabold bg-clip-text animate-text"
        >
          🛡️ Admin Dashboard
        </h1>
        <p className="mt-4 text-gray-300 max-w-2xl mx-auto text-sm md:text-lg">
          Welcome, Admin! Manage student attendance, upload tasks, review
          submissions, and check scores efficiently. Your control center for
          smooth academic operations.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <Link href="/admin-dashboard/attendance">
          <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg hover:scale-105 transition-transform flex flex-col items-center text-center">
            <FaUserCheck className="text-5xl  mb-3 bounce2" />
            <h2 className="font-bold text-xl mb-2">Mark Attendance</h2>
            <p className="text-gray-300 text-sm">
              Record student attendance daily. Track presence, absences, and
              overall performance efficiently.
            </p>
          </div>
        </Link>

        {/* Upload Task */}
        <Link href="/admin-dashboard/uploadtask">
          <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg hover:scale-105 transition-transform flex flex-col items-center text-center">
            <FaFileUpload className="text-5xl  mb-3 bounce2 bounce" />
            <h2 className="font-bold text-xl mb-2">Upload Task</h2>
            <p className="text-gray-300 text-sm">
              Upload new tasks with descriptions, deadlines, and categories.
            </p>
          </div>
        </Link>

        {/* Review Submitted Tasks */}
        <Link href="/admin-dashboard/projects">
          <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg hover:scale-105 transition-transform flex flex-col items-center text-center">
            <FaTasks className="text-5xl mb-3 bounce2" />
            <h2 className="font-bold text-xl mb-2">Review Tasks</h2>
            <p className="text-gray-300 text-sm">
              Review all submitted tasks, check files, and provide feedback or
              scores to students.
            </p>
          </div>
        </Link>

        {/* Attendance Scores */}
        <Link href="/admin-dashboard/score">
          <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg hover:scale-105 transition-transform flex flex-col items-center text-center">
            <FaChartLine className="text-5xl  mb-3 bounce2" />
            <h2 className="font-bold text-xl mb-2">Attendance Scores</h2>
            <p className="text-gray-300 text-sm">
              View attendance percentages, top performers, and overall student
              statistics in one place.
            </p>
          </div>
        </Link>
      </section>

      {/* Detailed Features Section */}
      <section className="mt-16 max-w-5xl mx-auto mb-5 text-center space-y-10">
        <h2
          style={{
            fontFamily: "'Orbitron', sans-serif",
            WebkitBackgroundClip: "text",
            textShadow:
              "0 0 15px rgba(127, 29, 29, 1), 0 0 30px rgba(127, 29, 29, 1)",
          }}
          className="text-3xl font-bold mb-6"
        >
          Dashboard Features Explained
        </h2>

        {/* Feature 1 */}
        <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-semibold mb-2">1. Mark Attendance</h3>
          <p className="text-gray-300">
            Admins can mark students as present or absent each day. Attendance
            data is tracked automatically and used to calculate performance
            scores.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-semibold mb-2">2. Upload Tasks</h3>
          <p className="text-gray-300">
            Admins can upload new tasks with a detailed description, file
            attachments, deadlines, and categories. Students receive all
            necessary information directly.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-semibold mb-2">
            3. Review Submitted Tasks
          </h3>
          <p className="text-gray-300">
            Easily check all tasks submitted by students, verify files, provide
            grades or feedback, and maintain records of completion.
          </p>
        </div>

        
        <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-semibold mb-2">4. Attendance Scores</h3>
          <p className="text-gray-300">
            See detailed attendance statistics for each student, highlight top
            performers, and track low attendance for intervention.
          </p>
        </div>
      </section>
    </div>
  );
}
