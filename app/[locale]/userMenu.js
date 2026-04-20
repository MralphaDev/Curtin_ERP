"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function UserMenu({params}) {
    const pathname = usePathname();
    const locale = pathname.split("/")[1];
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  // load user
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (data.ok) {
        setUser(data.user);
      }
    }
    load();
  }, []);

async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });

  // 强制跳转 login
  router.replace(`/${locale}/login`);
  router.refresh(); //  非常关键
}

  if (!user) return null;

  const initial = user.username?.[0]?.toUpperCase();

  return (
    <div
      className="fixed top-4 left-4 z-50"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* MAIN BUTTON */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center gap-3 px-4 py-2 bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl cursor-pointer"
      >
        {/* avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 text-white flex items-center justify-center font-bold">
          {initial}
        </div>

        {/* text */}
        <div className="text-sm">
          <div className="font-medium">Welcome</div>
          <div className="text-gray-600">{user.username}</div>
        </div>
      </motion.div>

      {/* DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="mt-2 w-full"
          >
            <button
              onClick={logout}
              className="w-full px-4 py-2 text-left text-red-500 bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg rounded-xl hover:bg-red-50 transition"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}