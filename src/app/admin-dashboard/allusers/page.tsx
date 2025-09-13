"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Loading from "@/components/Loading2";
import {toast,Toaster} from "react-hot-toast";

interface User {
  name: string;
  email: string;
  rollNo?: string;
  domain: string;
  probationStatus?: string;
  github?: string;
  uploadedTasksCount: number;
  joined?: string;
  role?: string; 
}

export default function UsersTable() {
  const [students, setStudents] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Not logged in");
          setLoading(false);
          return;
        }

        const res = await axios.get("/api/Dashboard_Admin/allusers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setStudents(res.data.students);
          setAdmins(res.data.admins);
        } else {
          toast.error(res.data.message || "Failed to fetch users");
        }
      } catch (err: any) {
        // console.error(err);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const allUsers = [...students, ...admins];

  return (
    <div className="min-h-screen rounded-2xl sm:p-6">
      <Toaster/>
      <h1 className="text-4xl font-bold text-white text-center mb-10 drop-shadow-lg">
        Users Dashboard
      </h1>

      {loading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto w-full">
          <motion.table
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-w-full divide-y divide-white/20  backdrop-blur-xl bg-white/10 rounded-2xl"
          >
            <thead>
              <tr className="text-left text-white">
                <th className="px-6 py-3 text-lg">S No.</th>
                <th className="px-6 py-3 text-lg">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Roll No</th>
                <th className="px-6 py-3">Domain</th>
                <th className="px-6 py-3">Probation</th>
                <th className="px-6 py-3">Tasks Uploaded</th>
                <th className="px-6 py-3">GitHub</th>
                <th className="px-6 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {allUsers.map((user, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-green-500 font-semibold">{idx+1}</td>
                  <td className="px-6 py-4 text-yellow-300 font-semibold">{user?.name}</td>
                  <td className="px-6 py-4 text-white/80">{user?.email}</td>
                  <td className="px-6 py-4 text-white/80">{user?.role || "Student"}</td>
                  <td className="px-6 py-4 text-white/80">{user?.rollNo || "-"}</td>
                  <td className="px-6 py-4 text-white/80">{user?.domain}</td>
                  <td className="px-6 py-4 text-white/80">{user?.probationStatus || "-"}</td>
                  <td className="px-6 py-4 text-white/80">{user?.uploadedTasksCount}</td>
                  <td className="px-6 py-4">
                    {user?.github ? (
                      <a
                        href={user.github}
                        target="_blank"
                        className="text-blue-400 hover:underline"
                      >
                        Link
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 text-white/80">
                    {user?.joined ? new Date(user.joined).toLocaleDateString() : "-"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      )}
    </div>
  );
}
