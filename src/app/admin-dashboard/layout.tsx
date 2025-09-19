// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import { useState } from "react";
// import { Menu, X } from "lucide-react";
// import type { Metadata } from "next";
// import Head from "next/head";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
  

//   const links = [
//     { href: "/admin-dashboard/attendance", label: "Attendance" },
//     { href: "/admin-dashboard/projects", label: "Review Projects" },
//     { href: "/admin-dashboard/score", label: "Leadership Board" },
//     { href: "/admin-dashboard/uploadtask", label: "Assign Task" },
//     { href: "/admin-dashboard/alltasks", label: "All Tasks" },
//     { href: "/admin-dashboard/allusers", label: "Students Data" },
//   ];

//   return (
//     <div>
//       <ProtectedRoute>

//          <Head>
//         <title>TaskSphere – Admin Dashboard</title>
//         <meta
//           name="description"
//           content="Track attendance, tasks, and student progress seamlessly."
//         />
//         <link rel="icon" href="/ball2.png" />
//       </Head>
      
//         <div className="flex h-screen text-white backdrop-blur-2xl bg-white/0">
        
//           <aside
//             className={`fixed md:static top-0 left-0 h-full w-64 bg-black/70 sm:bg-white/20 backdrop-blur-md shadow-lg flex flex-col transform transition-transform duration-300 z-40
//             ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
//           >
//             <div className="p-6 text-xl font-bold border-b border-white/10 flex items-center justify-between">
//               My Dashboard
          
//               <button
//                 className="md:hidden text-white"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <X size={24} />
//               </button>
//             </div>
//             <nav className="flex-1 p-4 space-y-2">
//               {links.map((link) => {
//                 const isActive =
//                   pathname === link.href || pathname.startsWith(link.href + "/");

//                 return (
//                   <Link
//                     key={link.href}
//                     href={link.href}
//                     className={`block px-3 py-2 rounded-lg transition ${
//                       isActive
//                         ? "bg-red-900 text-white font-semibold shadow-md"
//                         : "hover:bg-white/10"
//                     }`}
//                     onClick={() => setSidebarOpen(false)} 
//                   >
//                     {link.label}
//                   </Link>
//                 );
//               })}
//             </nav>
//           </aside>

        
//           <main className="flex-1 px-4 py-8 sm:p-8 overflow-y-auto w-full">
          
//             <div className="md:hidden flex items-center mb-4">
//               <button
//                 className="text-white"
//                 onClick={() => setSidebarOpen(true)}
//               >
//                 <Menu size={28} />
//               </button>
//               <h1 className="ml-4 text-lg font-bold">Dashboard</h1>
//             </div>

//             {children}
//           </main>
//         </div>
//       </ProtectedRoute>
//     </div>
//   );
// }


// "use client";

// import { useRouter, usePathname } from "next/navigation";
// import { useState, useEffect } from "react";
// import { Menu, X } from "lucide-react";
// import ProtectedRoute from "@/components/ProtectedRoute";

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const links = [
//     { href: "/admin-dashboard/attendance", label: "Attendance" },
//     { href: "/admin-dashboard/projects", label: "Review Projects" },
//     { href: "/admin-dashboard/score", label: "Leadership Board" },
//     { href: "/admin-dashboard/uploadtask", label: "Assign Task" },
//     { href: "/admin-dashboard/alltasks", label: "All Tasks" },
//     { href: "/admin-dashboard/allusers", label: "Students Data" },
//   ];

//   // Prefetch all links once on mount
//   useEffect(() => {
//     links.forEach((l) => router.prefetch(l.href));
//   }, []);

//   return (
//     <ProtectedRoute>
//       <div className="flex h-screen text-white backdrop-blur-2xl bg-white/0">
//         {/* Sidebar */}
//         <aside
//           className={`fixed md:static top-0 left-0 h-full w-64 bg-black/70 sm:bg-white/20 backdrop-blur-md shadow-lg flex flex-col transform transition-transform duration-300 z-40
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
//         >
//           <div className="p-6 text-xl font-bold border-b border-white/10 flex items-center justify-between">
//             My Dashboard
//             <button className="md:hidden text-white" onClick={() => setSidebarOpen(false)}>
//               <X size={24} />
//             </button>
//           </div>
//           <nav className="flex-1 p-4 cursor-pointer space-y-2">
//             {links.map((link) => {
//               const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
//               return (
//                 <button
//                   key={link.href}
//                   onClick={() => {
//                     setSidebarOpen(false);
//                     router.push(link.href);
//                   }}
//                   className={`w-full cursor-pointer text-left block px-3 py-2 rounded-lg transition ${
//                     isActive
//                       ? "bg-red-900 text-white font-semibold shadow-md"
//                       : "hover:bg-white/10"
//                   }`}
//                 >
//                   {link.label}
//                 </button>
//               );
//             })}
//           </nav>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 px-4 py-8 sm:p-8 overflow-y-auto w-full">
//           <div className="md:hidden flex items-center mb-4">
//             <button className="text-white" onClick={() => setSidebarOpen(true)}>
//               <Menu size={28} />
//             </button>
//             <h1 className="ml-4 text-lg font-bold">Dashboard</h1>
//           </div>

//           {children}
//         </main>
//       </div>
//     </ProtectedRoute>
//   );
// }

"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link"; 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { href: "/admin-dashboard/attendance", label: "Attendance" },
    { href: "/admin-dashboard/projects", label: "Review Projects" },
    { href: "/admin-dashboard/score", label: "Leadership Board" },
    { href: "/admin-dashboard/uploadtask", label: "Assign Task" },
    { href: "/admin-dashboard/alltasks", label: "All Tasks" },
    { href: "/admin-dashboard/allusers", label: "Students Data" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex h-screen text-white backdrop-blur-2xl bg-white/0">
        {/* Sidebar */}
        <aside
          className={`fixed md:static top-0 left-0 h-full w-64 bg-black/70 sm:bg-white/20 backdrop-blur-md shadow-lg flex flex-col transform transition-transform duration-300 z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <div className="p-6 text-xl font-bold border-b border-white/10 flex items-center justify-between">
            My Dashboard
            <button className="md:hidden text-white" onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 p-4 cursor-pointer space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full cursor-pointer text-left block px-3 py-2 rounded-lg transition ${
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
        <main className="flex-1 px-4 py-8 sm:p-8 overflow-y-auto w-full">
          <div className="md:hidden flex items-center mb-4">
            <button className="text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={28} />
            </button>
            <h1 className="ml-4 text-lg font-bold">Dashboard</h1>
          </div>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}