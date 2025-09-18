"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { href: "/student-dashboard/Attendance", label: "Attendance" },
    { href: "/student-dashboard/Tasks", label: "My projects" },
    { href: "/student-dashboard/SubmitTask", label: "Submit Task" },
    { href: "/student-dashboard/AllTasks", label: "All Tasks" },
  ];

  return (
    <div>
      <ProtectedRoute>
        <div className="flex h-screen text-white backdrop-blur-2xl bg-white/0">
        {/* <div className="flex min-h-screen text-white backdrop-blur-2xl bg-white/0"> */}
          {/* Sidebar */}
          <aside
            className={`fixed md:static  min-h-screen top-0 left-0 h-full w-64 bg-black/80 sm:bg-white/20 backdrop-blur-md shadow-lg flex flex-col transform transition-transform duration-300 z-40
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
              {links.map((link, index) => {
                const isActive =
                  pathname === link.href || pathname.startsWith(link.href + "/");

                return (
                  <Link
                    key={index}
                    href={link.href}
                    className={`block px-3 py-2 rounded-lg transition ${
                      isActive
                        ? "bg-white/20 backdrop-blur-xl text-white font-semibold shadow-md"
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

      
          <main className="flex-1  p-3 mt-10 sm:p-8 overflow-y-auto">
            {/* Top bar with menu (only for mobile) */}
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
