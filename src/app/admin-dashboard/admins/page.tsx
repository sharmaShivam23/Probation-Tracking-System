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

export default function UsersDashboard() {
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
        })
        if (res?.data?.success) {
          setAdmins(res.data.admins);
        } else {
          toast.error(res?.data?.message || "Failed to fetch users");
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

  const Table = ({ title, users }: { title: string; users: User[] }) => (
    <div className="overflow-x-auto  m-auto mb-12">
      <Toaster/>
      <h2 className="text-2xl text-white font-bold mb-4 drop-shadow-lg">{title}</h2>
      <motion.table
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full divide-y divide-white/20 backdrop-blur-xl bg-white/10 rounded-2xl"
      >
        <thead>
          <tr className="text-left text-white">
            <th className="px-6 py-3 text-lg">Name</th>
            <th className="px-6 py-3">Email</th>
            {title === "Students" && <th className="px-6 py-3">Roll No</th>}
            {title === "Students" && <th className="px-6 py-3">Probation</th>}
            <th className="px-6 py-3">Tasks Uploaded</th>
            {title === "Students" && <th className="px-6 py-3">GitHub</th>}
            {title === "Students" && <th className="px-6 py-3">Joined</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {users.map((user, idx) => (
            <motion.tr
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="hover:bg-white/20 transition-colors cursor-pointer"
            >
              <td className="px-6 py-4 text-yellow-300 font-semibold">{user?.name}</td>
              <td className="px-6 py-4 text-white/80">{user?.email}</td>
              {title === "Students" && <td className="px-6 py-4 text-white/80">{user?.rollNo || "-"}</td>}
              {title === "Students" && (
                <td className="px-6 py-4 text-white/80">{user?.probationStatus || "-"}</td>
              )}
              <td className="px-6 py-4 text-white/80">{user?.uploadedTasksCount}</td>
              {title === "Students" && (
                <td className="px-6 py-4">
                  {user?.github ? (
                    <a
                      href={user?.github}
                      target="_blank"
                      className="text-blue-400 hover:underline"
                    >
                      Link
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              )}
              {title === "Students" && (
                <td className="px-6 py-4 text-white/80">
                  {user?.joined ? new Date(user?.joined).toLocaleDateString() : "-"}
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-4xl font-bold text-white text-center mb-10 drop-shadow-lg">
        Users Dashboard
      </h1>

      {loading ? (
        <Loading />
      ) : (
        <>
          <Table title="Admins" users={admins} />
        </>
      )}
    </div>
  );
}
