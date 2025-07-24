import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!token || !JWT_SECRET) {
      return false;
    }

    // Verify the JWT token
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    console.error("Authentication check error:", error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!token || !JWT_SECRET) {
      return null;
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
