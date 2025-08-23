"use client"
import { useEffect } from "react";
import * as jwtDecode from "jwt-decode";

type TokenPayload = {
  id: string;
  role: "Admin" | "Student";
  exp: number;
};

const decodeToken = jwtDecode as unknown as <T>(token: string) => T;

export function useAuth(requiredRole?: "Admin" | "Student") {
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    const router = require("next/router").useRouter(); // dynamically import router

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const decoded = decodeToken<TokenPayload>(token);
      if (requiredRole && decoded.role !== requiredRole) {
        router.replace("/"); // redirect wrong role
      }
    } catch {
      router.replace("/login"); // invalid token
    }
  }, [requiredRole]);
}
