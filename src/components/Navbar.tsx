// // "use client";

// // import Link from "next/link";
// // import { useState , useEffect } from "react";
// // import { motion } from "framer-motion";
// // import { useRouter } from "next/navigation";
// // import { jwtDecode } from "jwt-decode"; 
// // import { NextResponse } from "next/server";

// // const Navbar = () => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const router = useRouter();

  
// // interface JwtPayload {
// //   role?: string;
// //   exp?: number;
// // }

// //   const token = req.cookies.get("auth_token")?.value;

// //   if (!token) {
// //     return NextResponse.redirect(new URL("/login", req.url));
// //   }

// //   try {
// //     // decode token
// //     const decoded = jwtDecode<JwtPayload>(token);



// //   //  const [token, setToken] = useState<string | null>(null);

// //   // useEffect(() => {
// //   //   const storedToken = localStorage.getItem("token");
// //   //   setToken(storedToken);
// //   // }, []);
// //   const token = localStorage.getItem("token");

// //   const handleLogout = () => {
// //     localStorage.removeItem("token");
// //     localStorage.removeItem("userId");
// //     router.push("/login");
// //   }

// //   return (
// //     <nav className="fixed top-0 left-0 w-full z-50">
// //       {/* Glassy background */}
// //       <div className="backdrop-blur-md bg-white/30 shadow-lg">
// //         <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
// //           {/* Logo */}
// //           <Link href="/" className="text-2xl font-bold text-gray-800">
// //             MyLogo
// //           </Link>

// //           {/* Desktop Menu */}
// //           <div className="hidden md:flex gap-8">
// //             <Link href="/register" className="hover:text-blue-600 transition">
// //               Register
// //             </Link>
// //             {token ? (<div className="cursor-pointer" onClick={handleLogout}>Logout</div>) : 
// //             <Link href="/login" className="hover:text-blue-600 transition">
// //               Login
// //             </Link>
// //          }
// //             <Link href="/contact" className="hover:text-blue-600 transition">
// //               Contact
// //             </Link>
// //             <Link href="/Dashboard" className="hover:text-blue-600 transition">
// //               Dashboard
// //             </Link>
// //           </div>

// //           {/* Mobile Menu Button */}
// //           <button
// //             className="md:hidden text-gray-800 focus:outline-none"
// //             onClick={() => setIsOpen(!isOpen)}
// //           >
// //             {isOpen ? (
// //               // X icon
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 className="w-7 h-7"
// //                 fill="none"
// //                 viewBox="0 0 24 24"
// //                 stroke="currentColor"
// //                 strokeWidth={2}
// //               >
// //                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
// //               </svg>
// //             ) : (
// //               // Menu icon
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 className="w-7 h-7"
// //                 fill="none"
// //                 viewBox="0 0 24 24"
// //                 stroke="currentColor"
// //                 strokeWidth={2}
// //               >
// //                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
// //               </svg>
// //             )}
// //           </button>
// //         </div>

// //         {/* Mobile Menu Dropdown */}
// //         {isOpen && (
// //           <motion.div
// //             initial={{ opacity: 0, y: -20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.3 }}
// //             className="md:hidden bg-white/40 backdrop-blur-md shadow-md"
// //           >
// //             <div className="flex flex-col items-center py-4 space-y-4">
// //               <Link
// //                 href="/register"
// //                 className="hover:text-blue-600"
// //                 onClick={() => setIsOpen(false)}
// //               >
// //                 Register
// //               </Link>
// //               <Link
// //                 href="/login"
// //                 className="hover:text-blue-600"
// //                 onClick={() => setIsOpen(false)}
// //               >
// //                 Login
// //               </Link>
// //               <Link
// //                 href="/contact"
// //                 className="hover:text-blue-600"
// //                 onClick={() => setIsOpen(false)}
// //               >
// //                 Contact
// //               </Link>
// //               <Link
// //                 href="/dashboard"
// //                 className="hover:text-blue-600"
// //                 onClick={() => setIsOpen(false)}
// //               >
// //                 Dashboard
// //               </Link>
// //             </div>
// //           </motion.div>
// //         )}
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navbar;


// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";
// import { jwtDecode } from "jwt-decode";

// interface JwtPayload {
//   role?: string;
//   exp?: number;
// }

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [role, setRole] = useState<string | null>(null);
//   const [loggedIn, setLoggedIn] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
  
//     const match = document.cookie.match(/auth_token=([^;]+)/);
//     const token = match ? match[1] : null;

//     if (token) {
//       try {
//         const decoded = jwtDecode<JwtPayload>(token);
//         if (decoded.exp && Date.now() < decoded.exp * 1000) {
//           setRole(decoded.role || null);
//           setLoggedIn(true);
//         } else {
//           setLoggedIn(false);
//           setRole(null);
//         }
//       } catch (err) {
//         setLoggedIn(false);
//         setRole(null);
//       }
//     }
//   }, []);

//   const handleLogout = () => {
//     document.cookie =
//       "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
//     setLoggedIn(false);
//     setRole(null);
//     router.push("/login");
//   };

//   const handleDashboard = () => {
//     if (role === "Admin") router.push("/Admin");
//     else if (role === "Student") router.push("/Dashboard-Students");
//     else router.push("/Dashboard");
//   };

//   return (
//     <nav className="fixed top-0 backdrop-blur-2xl text-white font-bold bg-white/10  left-0 w-full z-50">
//       <div className=" shadow-lg">
//         <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
//           {/* Logo */}
//           <Link href="/" className="text-2xl font-bold text-gray-800">
//             MyLogo
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex gap-8">
//             <Link href="/register" className="hover:text-blue-600 transition">
//               Register
//             </Link>
//             {loggedIn ? (
//               <div className="cursor-pointer" onClick={handleLogout}>
//                 Logout
//               </div>
//             ) : (
//               <Link href="/login" className="hover:text-blue-600 transition">
//                 Login
//               </Link>
//             )}
//             <Link href="/contact" className="hover:text-blue-600 transition">
//               Contact
//             </Link>
//             <div
//               className="cursor-pointer hover:text-blue-600 transition"
//               onClick={handleDashboard}
//             >
//               Dashboard
//             </div>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden text-gray-800 focus:outline-none"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             {isOpen ? (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-7 h-7"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-7 h-7"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//             )}
//           </button>
//         </div>

//         {/* Mobile Menu Dropdown */}
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             className="md:hidden bg-white/10 backdrop-blur-md shadow-md"
//           >
//             <div className="flex flex-col items-center py-4 space-y-4">
//               <Link
//                 href="/register"
//                 className="hover:text-blue-600"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Register
//               </Link>
//               {loggedIn ? (
//                 <div
//                   className="cursor-pointer hover:text-blue-600"
//                   onClick={() => {
//                     setIsOpen(false);
//                     handleLogout();
//                   }}
//                 >
//                   Logout
//                 </div>
//               ) : (
//                 <Link
//                   href="/login"
//                   className="hover:text-blue-600"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Login
//                 </Link>
//               )}
//               <Link
//                 href="/contact"
//                 className="hover:text-blue-600"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Contact
//               </Link>
//               <div
//                 className="cursor-pointer hover:text-blue-600"
//                 onClick={() => {
//                   setIsOpen(false);
//                   handleDashboard();
//                 }}
//               >
//                 Dashboard
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role?: string;
  exp?: number;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const match = document.cookie.match(/auth_token=([^;]+)/);
    const token = match ? match[1] : null;

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp && Date.now() < decoded.exp * 1000) {
          setRole(decoded.role || null);
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
          setRole(null);
        }
      } catch (err) {
        setLoggedIn(false);
        setRole(null);
      }
    }
  }, []);

  const handleLogout = () => {
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    setLoggedIn(false);
    setRole(null);
    router.push("/login");
  };

  const handleDashboard = () => {
    if (role === "Admin") router.push("/Admin");
    else if (role === "Student") router.push("/Dashboard-Students");
    else router.push("/Dashboard");
  };

  return (
    <nav className="fixed top-0 left-0 text-white w-full z-50 bg-gradient-to-r from-red-400 via-black to-gray-900 
 backdrop-blur-xl
 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent"
        >
          MyLogo
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-white dark:text-gray-200">
          <Link
            href="/register"
            className="relative group transition"
          >
            Register
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
          </Link>
          {loggedIn ? (
            <div
              className="cursor-pointer relative group"
              onClick={handleLogout}
            >
              Logout
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full" />
            </div>
          ) : (
            <Link
              href="/login"
              className="relative group transition"
            >
              Login
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          )}
          <Link
            href="/contact"
            className="relative group transition"
          >
            Contact
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full" />
          </Link>
          <div
            className="cursor-pointer relative group"
            onClick={handleDashboard}
          >
            Dashboard
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800 dark:text-gray-200 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white/80 dark:bg-gray-900/90 backdrop-blur-md shadow-lg"
        >
          <div className="flex flex-col items-center py-6 space-y-6 text-lg font-semibold text-gray-800 dark:text-gray-200">
            <Link href="/register" onClick={() => setIsOpen(false)}>Register</Link>
            {loggedIn ? (
              <div
                className="cursor-pointer text-red-500"
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
            )}
            <Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
            <div
              className="cursor-pointer text-blue-600"
              onClick={() => {
                setIsOpen(false);
                handleDashboard();
              }}
            >
              Dashboard
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
