"use client";

import Link from "next/link";
import { FaTasks, FaUserCheck, FaFileUpload, FaProjectDiagram } from "react-icons/fa";

export default function StudentDashboardHome() {
  return (
    <div className="min-h-screen text-white p-6">

      {/* Header */}
      <header className="mb-12 text-center">
        <h1
          style={{
            fontFamily: "'Orbitron', sans-serif",
            WebkitBackgroundClip: "text",
            textShadow:
              "0 0 15px rgba(127, 29, 29, 1), 0 0 30px rgba(127, 29, 29, 1)" // blue glow for students
          }}
          className="text-4xl md:text-5xl font-extrabold bg-clip-text animate-text"
        >
          🎓 Student Dashboard
        </h1>
        <p className="mt-4 text-gray-300 max-w-2xl mx-auto text-sm md:text-lg">
          Welcome! Here you can check your attendance, upload tasks, explore tasks assigned to all students,
          and review your own submitted projects. Manage everything in one place.
        </p>
      </header>

      {/* Cards Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* View Attendance */}
        <Link href="/student-dashboard/myattendance">
          <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg hover:scale-105 transition-transform flex flex-col items-center text-center">
            <FaUserCheck className="text-5xl mb-3 bounce2" />
            <h2 className="font-bold text-xl mb-2">My Attendance</h2>
            <p className="text-gray-300 text-sm">
              Check your attendance records, percentages, and ensure you are on track with requirements.
            </p>
          </div>
        </Link>

        {/* Upload Task */}
        <Link href="/student-dashboard/uploadtask">
          <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg hover:scale-105 transition-transform flex flex-col items-center text-center">
            <FaFileUpload className="text-5xl mb-3 bounce2" />
            <h2 className="font-bold text-xl mb-2">Upload My Task</h2>
            <p className="text-gray-300 text-sm">
              Submit your assignments, projects, or tasks easily with files and details.
            </p>
          </div>
        </Link>

        {/* See All Tasks */}
        <Link href="/student-dashboard/alltasks">
          <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg hover:scale-105 transition-transform flex flex-col items-center text-center">
            <FaTasks className="text-5xl mb-3 bounce2" />
            <h2 className="font-bold text-xl mb-2">All Tasks</h2>
            <p className="text-gray-300 text-sm">
              Explore tasks uploaded by admin and students. Stay updated with deadlines and requirements.
            </p>
          </div>
        </Link>

        {/* My Projects */}
        <Link href="/student-dashboard/myprojects">
          <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg hover:scale-105 transition-transform flex flex-col items-center text-center">
            <FaProjectDiagram className="text-5xl mb-3 bounce2" />
            <h2 className="font-bold text-xl mb-2">My Projects</h2>
            <p className="text-gray-300 text-sm">
              View your submitted projects, track their status, and check for feedback or scores.
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
              "0 0 15px rgba(127, 29, 29, 1), 0 0 30px rgba(127, 29, 29, 1)"
          }}
          className="text-3xl font-bold mb-6"
        >
          Dashboard Features Explained
        </h2>

        {/* Feature 1 */}
        <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-semibold mb-2">1. My Attendance</h3>
          <p className="text-gray-300">
            Check your daily attendance records, total classes attended, and keep track of your overall performance.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-semibold mb-2">2. Upload My Task</h3>
          <p className="text-gray-300">
            Upload your assignments, tasks, or projects with necessary details and attachments. Ensure you never miss a deadline.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-semibold mb-2">3. All Tasks</h3>
          <p className="text-gray-300">
            Browse through all tasks assigned by admins or visible to students. Stay updated and collaborate effectively.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-semibold mb-2">4. My Projects</h3>
          <p className="text-gray-300">
            Review your own submitted projects, check feedback, and monitor scores. Keep track of your progress.
          </p>
        </div>
      </section>
    </div>
  );
}
