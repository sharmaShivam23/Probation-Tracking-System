

import { decodeJwt } from "jose";

interface DecodedToken {
  role: string;
  name: string;
  exp?: number;
  iat?: number;
  id? : string;
}

export function getUserRole(token: string): string | null {
  try {
    const decoded = decodeJwt(token) as DecodedToken;
    return decoded.role || null;
  } catch (error) {
    // console.error("Invalid token", error);
    return null;
  }
}

export function getUserName(token: string): string | null {
  try {
    const decoded = decodeJwt(token) as DecodedToken;
    return decoded.name || null;
  } catch (error) {
    // console.error("Invalid token", error);
    return null;
  }
}

export function getUserId(token: string): string | null {
  try {
    const decoded = decodeJwt(token) as DecodedToken;
    return decoded.id || null;
  } catch (error) {
    // console.error("Invalid token", error);
    return null;
  }
}

export const getTokenExpiration = (token: string): number | null => {
  try {
     const decoded = decodeJwt(token) as DecodedToken;
    return decoded.exp ?? null;
  } catch (error) {
    return null;
  }
};