"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Metadata } from "next";
import Head from "next/head";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  

  const links = [
    { href: "/admin-dashboard/attendance", label: "Mark Attendance" },
    { href: "/admin-dashboard/projects", label: "Review Projects" },
    { href: "/admin-dashboard/score", label: "See Score" },
    { href: "/admin-dashboard/uploadtask", label: "Upload a Task" },
    { href: "/admin-dashboard/alltasks", label: "All Tasks" },
    { href: "/admin-dashboard/allusers", label: "All Students" },
  ];

  return (
    <div>
      <ProtectedRoute>

         <Head>
        <title>TaskSphere – Admin Dashboard</title>
        <meta
          name="description"
          content="Track attendance, tasks, and student progress seamlessly."
        />
        <link rel="icon" href="/ball2.png" />
      </Head>
      
        <div className="flex h-screen text-white backdrop-blur-2xl bg-white/0">
        
          <aside
            className={`fixed md:static top-0 left-0 h-full w-64 bg-black/70 sm:bg-white/20 backdrop-blur-md shadow-lg flex flex-col transform transition-transform duration-300 z-40
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
          >
            <div className="p-6 text-xl font-bold border-b border-white/10 flex items-center justify-between">
              My Dashboard
          
              <button
                className="md:hidden text-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {links.map((link) => {
                const isActive =
                  pathname === link.href || pathname.startsWith(link.href + "/");

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-3 py-2 rounded-lg transition ${
                      isActive
                        ? "bg-red-900 text-white font-semibold shadow-md"
                        : "hover:bg-white/10"
                    }`}
                    onClick={() => setSidebarOpen(false)} 
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

        
          <main className="flex-1 p-8 overflow-y-auto w-full">
          
            <div className="md:hidden flex items-center mb-4">
              <button
                className="text-white"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={28} />
              </button>
              <h1 className="ml-4 text-lg font-bold">Dashboard</h1>
            </div>

            {children}
          </main>
        </div>
      </ProtectedRoute>
    </div>
  );
}
