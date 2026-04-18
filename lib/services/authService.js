import { signToken } from "@/lib/auth/jwt";

export function loginUser(username, password) {
  if (username !== "admin" || password !== "123") {
    throw new Error("Invalid credentials");
  }

  return signToken({
    userId: 1,
    role: "tier1",
  });
}