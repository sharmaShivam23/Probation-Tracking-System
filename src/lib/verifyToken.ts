import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

interface DecodedUser extends JwtPayload {
  userId: string;
  role?: string;
  id?: string;
}

interface VerifyTokenResult {
  valid: boolean;
  user?: DecodedUser;
  error?: string;
}

export async function verifyToken(): Promise<VerifyTokenResult> {
  try {
    const cookieStore = await cookies();

    const tokenCookie = cookieStore.get("auth_token");
    const token = tokenCookie?.value;
    // const token = localStorage.getItem("token")

    if (!token) {
      return { valid: false, error: "Unauthorized" };
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not set in environment variables");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedUser;

    // Normalize payload to always expose `userId`
    const normalized: DecodedUser = {
      ...decoded,
      userId: decoded.userId || decoded.id || "",
    };

    if (!normalized.userId) {
      return { valid: false, error: "Invalid Token" };
    }

    return { valid: true, user: normalized };
  } catch (err) {
    return { valid: false, error: "Invalid Token" };
  }
}
