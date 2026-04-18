"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDictionary } from "@/lib/dictionary";

import ProductsPage from "@/app/[locale]/products/page";
import NewInventory from "../inventory/page";
import CoilStandardPage from "../coil_standard/page";
import CoilIndependentPage from "../coil_independent/page";

export default function Dashboard() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const dict = getDictionary(locale);

  const [active, setActive] = useState(null);

  const buttonClass =
    "px-6 py-3 rounded-2xl bg-white/70 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100 hover:-translate-y-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex flex-col items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {!active ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-16"
          >
            {/* =============================== */}
            {/* 🌟 ULTRA MODERN TITLE (FINAL TUNED) */}
            {/* =============================== */}

            <div className="flex items-stretch gap-0">
              {/* LEFT - CURTIN */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
               className="text-8xl md:text-9xl font-black tracking-[-0.06em] leading-[0.8] bg-gradient-to-b from-blue-600 to-sky-400 bg-clip-text text-transparent flex items-center scale-x-90"
              >
                CURTIN
              </motion.div>

              {/* RIGHT SIDE SPLIT */}
              <div className="flex flex-col justify-center min-w-[280px]">
  
              {/* TOP - E.R.P */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-7xl font-black tracking-[0.25em] text-blue-600 leading-none"
              >
                E.R.P.
              </motion.div>

              {/* DIVIDER */}
              <div className="h-[1px] w-full bg-gradient-to-r from-blue-300 to-transparent my-3" />

              {/* BOTTOM */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base md:text-lg text-gray-600 font-medium tracking-wide leading-snug w-full"
              >
                Inventory Management System
              </motion.div>
            </div>
            </div>

            {/* 🔘 BUTTON GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={buttonClass} onClick={() => setActive("products")}>📦 Products</motion.button>

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={buttonClass} onClick={() => setActive("coilStandard")}>⚙️ Coil Standard</motion.button>

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={buttonClass} onClick={() => setActive("coilIndependent")}>🔌 Coil Independent</motion.button>

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={buttonClass} onClick={() => setActive("inventory")}>📊 Inventory</motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-6xl"
          >
            <div className="mb-6">
              <button
                onClick={() => setActive(null)}
                className="px-4 py-2 rounded-xl bg-white shadow hover:shadow-md transition"
              >
                ← Back to Dashboard
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              {active === "products" && <ProductsPage />}
              {active === "coilStandard" && <CoilStandardPage />}
              {active === "coilIndependent" && <CoilIndependentPage />}
              {active === "inventory" && <NewInventory />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
