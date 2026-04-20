/*import { signToken } from "@/lib/auth/jwt";

export function loginUser(username, password) {
  if (username !== "admin" || password !== "123") {
    throw new Error("Invalid credentials");
  }

  return signToken({
    userId: 1,
    role: "tier1",
  });
}*/
import { signToken } from "@/lib/auth/jwt";

const users = [
  {
    username: process.env.USER_1_NAME,
    password: process.env.USER_1_PASS,
    userId: 1,
    role: "user",
  },
  {
    username: process.env.USER_2_NAME,
    password: process.env.USER_2_PASS,
    userId: 2,
    role: "admin",
  },
];

export function loginUser(username, password) {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  return signToken({
    userId: user.userId,
    role: user.role,
    username: user.username,
  });
}