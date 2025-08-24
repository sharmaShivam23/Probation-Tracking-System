"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/Dashboard/attendance", label: "Mark Attendance" },
    { href: "/Dashboard/projects", label: "Review Projects" },
    { href: "/Dashboard/score", label: "See Score" },
    { href: "/Dashboard/uploadtask", label: "Upload a Task" },
    { href: "/Dashboard/alltasks", label: "All Tasks" },
  ];

  return (
    <div className="p">
      <ProtectedRoute>
        <div className="hi md:flex h-screen text-white backdrop-blur-2xl bg-white/0">
          {/* Sidebar */}
          <aside className="w-64 bg-white/20 backdrop-blur-md shadow-lg flex flex-col">
            <div className="p-6 text-xl font-bold border-b border-white/10">
              My Dashboard
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
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8 overflow-y-auto">{children}</main>
        </div>
      </ProtectedRoute>
    </div>
  );
}
