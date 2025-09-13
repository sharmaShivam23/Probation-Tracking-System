// "use client";
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { getUserRole, getUserName } from "@/middleware/DecodeToken";

// type User = {
//   name: string;
//   role: string;
// };

// type AuthContextType = {
//   user: User | null;
//   login: (token: string) => void;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);

//   // ✅ login function
//   const login = (token: string) => {
//     localStorage.setItem("token", token);
//     const role = getUserRole(token);
//     const name = getUserName(token);

//     if (role && name) {
//       setUser({ role, name });
//     } else {
//       setUser(null);
//     }
//   };

//   // ✅ logout function
//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   // ✅ load token from localStorage on mount
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const role = getUserRole(token);
//       const name = getUserName(token);
//       if (role && name) {
//         setUser({ role, name });
//       }
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // ✅ custom hook for easy usage
// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// };


"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type User = {
  id: string;
  name: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
};

// 1. Create Context with proper type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          id: decoded.id,
          name: decoded.name,
          role: decoded.role,
        });
        setRole(decoded.role);
      } catch (error) {
        // console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded: any = jwtDecode(token);
    setUser({
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    });
    setRole(decoded.role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 2. Create Hook with proper type-checking
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
