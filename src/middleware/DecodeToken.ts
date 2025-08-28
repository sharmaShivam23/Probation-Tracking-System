// import { jwtDecode } from "jwt-decode"; 

// interface DecodedToken {
//   role: string; // add other fields if needed, e.g. email, id
//   name: string; // add other fields if needed, e.g. email, id
//   exp?: number;
//   iat?: number;
// }

// export function getUserRole(token: string): string | null {
//   try {
//     const decoded: DecodedToken = jwtDecode(token);
//     return decoded.role;
//   } catch (error) {
//     console.error("Invalid token", error);
//     return null;
//   }
// }

// export function getUserName(token: string): string | null {
//   try {
//     const decoded: DecodedToken = jwtDecode(token);
//     return decoded.name;
//   } catch (error) {
//     console.error("Invalid token", error);
//     return null;
//   }
// }

// import  {jwtDecode}  from "jwt-decode";
// import * as jose from "jose";
// interface DecodedToken {
//   role: string;
//   name: string;
//   exp?: number;
//   iat?: number;
// }

// export function getUserRole(token: string): string | null {
//   try {
//     const decoded: DecodedToken = jwtDecode(token);
//     return decoded.role;
//   } catch (error) {
//     console.error("Invalid token", error);
//     return null;
//   }
// }

// export function getUserName(token: string): string | null {
//   try {
//     const decoded: DecodedToken = jwtDecode(token);
//     return decoded.name;
//   } catch (error) {
//     console.error("Invalid token", error);
//     return null;
//   }
// }

import { decodeJwt } from "jose";

interface DecodedToken {
  role: string;
  name: string;
  exp?: number;
  iat?: number;
}

export function getUserRole(token: string): string | null {
  try {
    const decoded = decodeJwt(token) as DecodedToken;
    return decoded.role || null;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}

export function getUserName(token: string): string | null {
  try {
    const decoded = decodeJwt(token) as DecodedToken;
    return decoded.name || null;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}
