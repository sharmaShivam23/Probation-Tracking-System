"use client"
import { useEffect } from "react";
import * as jwtDecode from "jwt-decode";
import { useRouter } from "next/navigation";

type TokenPayload = {
  id: string;
  role: "Admin" | "Student";
  exp: number;
};

const decodeToken = jwtDecode as unknown as <T>(token: string) => T;

export function useAuth(requiredRole?: "Admin" | "Student") {
  const router = useRouter();

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

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
  }, [requiredRole, router]);
}
