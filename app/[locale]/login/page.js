"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";

export default function LoginPage() {
  const router = useRouter();
  const { locale } = useParams();

  // 🌍 load correct language file based on locale
  const dict = getDictionary(locale);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "admin",
          password: "123",
        }),
      });

      if (res.ok) {
        // 🌍 redirect using current locale
        router.push(`/${locale}/dashboard`);
      } else {
        // ❌ use translated message
        setError(dict.loginFailed);
      }
    } catch (err) {
      // 🌐 network error translated
      setError(dict.networkError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">

      {/* 🔘 login button text comes from messages */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-black text-white p-2"
      >
        {loading ? dict.loading : dict.login}
      </button>

      {/* ⚠️ error message also translated */}
      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}