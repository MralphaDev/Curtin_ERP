"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { getDictionary } from "@/lib/dictionary";
import LanguageSwitcher from "../langSwitcher";

export default function LoginPage() {
  const router = useRouter();
  const { locale } = useParams();
  const dict = getDictionary(locale);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push(`/${locale}/dashboard`);
      } else {
        setError(dict.loginFailed);
      }
    } catch (err) {
      setError(dict.networkError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <LanguageSwitcher />

      <motion.div
        className="w-full max-w-sm p-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-xl font-bold mb-6 text-center">
          {dict.curtinims}
        </h1>

        <input
          className="w-full mb-3 px-3 py-2 border rounded"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full mb-4 px-3 py-2 border rounded"
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-2 bg-blue-500 text-white rounded"
        >
          {loading ? "Loading..." : dict.login}
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">
            {error}
          </p>
        )}
      </motion.div>
    </div>
  );
}