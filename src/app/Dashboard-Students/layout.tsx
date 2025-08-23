// // import Link from "next/link";
// // import { usePathname } from "next/navigation";
// // export default function DashboardLayout({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // })
// //  {
// //   return (
// //     <div className="flex h-screen text-black ">
// //       {/* Sidebar */}
// //       <aside className="w-64 bg-white shadow-lg flex flex-col">
// //         <div className="p-6 text-xl font-bold border-b">My Dashboard</div>
// //         <nav className="flex-1 p-4 space-y-2">
// //           <Link
// //             href="/Dashboard-Students/Attendance"
// //             className="block px-3 py-2 rounded-lg hover:bg-gray-200 transition"
// //           >
// //             Attendance
// //           </Link>
// //           <Link
// //             href="/Dashboard-Students/AllTasks"
// //             className="block px-3 py-2 rounded-lg hover:bg-gray-200 transition"
// //           >
// //             Task
// //           </Link>
// //           <Link
// //             href="/Dashboard-Students/SubmitTask"
// //             className="block px-3 py-2 rounded-lg hover:bg-gray-200 transition"
// //           >
// //             Submit Task
// //           </Link>
// //           <Link
// //             href="/Dashboard-Students/AllTasks"
// //             className="block px-3 py-2 rounded-lg hover:bg-gray-200 transition"
// //           >
// //             All Tasks
// //           </Link>
// //         </nav>
// //       </aside>

// //       {/* Main Content */}
// //       <main className="flex-1 p-8 overflow-y-auto">{children}</main>
// //     </div>
// //   );
// // }


// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();

//   const links = [
//     { href: "/Dashboard-Students/Attendance", label: "Attendance" },
//     { href: "/Dashboard-Students/AllTasks", label: "Task" },
//     { href: "/Dashboard-Students/SubmitTask", label: "Submit Task" },
//     { href: "/Dashboard-Students/AllTasks", label: "All Tasks" },
//   ];

//   return (
//     <div className="flex h-screen text-black">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-lg flex flex-col">
//         <div className="p-6 text-xl font-bold border-b">My Dashboard</div>
//         <nav className="flex-1 p-4 space-y-2">
//           {links.map((link, index) => {
//             const isActive = pathname === link.href;

//             return (
//               <Link
//                 key={index}
//                 href={link.href}
//                 className={`block px-3 py-2 rounded-lg transition ${
//                   isActive
//                     ? "bg-blue-600 text-white font-semibold shadow-md"
//                     : "hover:bg-gray-200"
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             );
//           })}
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-8 overflow-y-auto">{children}</main>
//     </div>
//   );
// }



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
    { href: "/Dashboard-Students/Attendance", label: "Attendance" },
    { href: "/Dashboard-Students/Tasks", label: "Task" },
    { href: "/Dashboard-Students/SubmitTask", label: "Submit Task" },
    { href: "/Dashboard-Students/AllTasks", label: "All Tasks" },
  ];

  return (
    <div className="p">
      <ProtectedRoute>
        <div className="hidden md:flex h-screen text-white backdrop-blur-2xl bg-white/0">
          {/* Sidebar */}
          <aside className="w-64 bg-white/20 backdrop-blur-md shadow-lg flex flex-col">
            <div className="p-6 text-xl font-bold border-b border-white/10">
              My Dashboard
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {links.map((link , index) => {
                const isActive =
                  pathname === link.href || pathname.startsWith(link.href + "/");

                return (
                  <Link
                    key={index}
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
