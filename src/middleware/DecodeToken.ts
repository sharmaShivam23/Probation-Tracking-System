import { jwtDecode } from "jwt-decode"; 

interface DecodedToken {
  role: string; // add other fields if needed, e.g. email, id
  exp?: number;
  iat?: number;
}

export function getUserRole(token: string): string | null {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}
