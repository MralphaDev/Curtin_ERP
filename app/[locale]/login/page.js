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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: "123" }),
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 relative overflow-hidden">
      <LanguageSwitcher />
      {/* 🌈 BACKGROUND BLOBS */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-blue-300 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-sky-300 rounded-full blur-3xl opacity-30 animate-pulse" />

      {/* 🔐 LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm p-8 rounded-3xl bg-white/70 backdrop-blur-xl shadow-2xl border border-white/40"
      >
        {/* 🏷 TITLE */}
        <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent">
          {dict.curtinims}
        </h1>

        {/* 🔘 LOGIN BUTTON */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-sky-400 text-white font-medium shadow-md hover:shadow-lg transition"
        >
          {loading ? dict.loading : dict.login}
        </motion.button>

        {/* ⚠️ ERROR */}
        {error && (
          <p className="text-red-500 text-sm text-center mt-4">
            {error}
          </p>
        )}
      </motion.div>
    </div>
  );
}
