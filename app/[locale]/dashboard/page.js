"use client";

import { usePathname } from "next/navigation";
import { useState,useEffect} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDictionary } from "@/lib/dictionary";
import LanguageSwitcher from "../langSwitcher";
import ProductsPage from "@/app/[locale]/products/page";
import NewInventory from "../inventory/page";
import CoilStandardPage from "../coil_standard/page";
import CoilIndependentPage from "../coil_independent/page";
import BusinessIntelligence from "../BI/bi";
import UserMenu from "../userMenu";

import {
  Box,
  Cog,
  Plug,
  BarChart3
} from "lucide-react";
import { i } from "framer-motion/client";

export default function Dashboard() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const dict = getDictionary(locale);

  const [active, setActive] = useState(null);
  const [user, setUser] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);

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

  //if (!user) return <div>Loading...</div>;

  const buttonClass =
  "px-6 py-3 rounded-2xl bg-white/70 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100 hover:-translate-y-1 flex items-center gap-3";

const iconWrapper =
  "w-10 h-10 flex items-center justify-center rounded-xl shadow-md";
  return (
<div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100 flex flex-col items-center justify-center p-4 md:p-6">
  {/* DESKTOP ONLY */}
  <div className="hidden md:block">
{/* LEFT TOP - Language */}
<div className="hidden md:block fixed top-6 left-6 z-[9999]">
  <LanguageSwitcher />
</div>

{/* RIGHT TOP - User */}
<div className="hidden md:block fixed top-6 right-6 z-[9999]">
  <UserMenu />
</div>
  </div>

  {/* MOBILE DROPDOWN */}
  <div className="md:hidden fixed top-6 right-4 z-[9999]">
    <div className="relative">
      
      {/* trigger button */}
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="w-10 h-10 rounded-xl bg-white/70 backdrop-blur-md shadow-md flex items-center justify-center"
      >
        ☰
      </button>

      {/* dropdown */}
      {menuOpen && (
        <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white/90 backdrop-blur-2xl shadow-2xl border border-blue-100 overflow-hidden">

          {/* Language section */}
          <div className="flex flex-col px-4 py-3 gap-3">
            
            <div className="text-xs text-gray-400">Language</div>
            
            <div className="flex flex-col gap-2">
              <LanguageSwitcher />
            </div>

          </div>

          <div className="h-px bg-blue-100" />

          {/* User section */}
          <div className="flex flex-col px-4 py-3 gap-3">

            <div className="text-xs text-gray-400">Account</div>

            <div className="flex flex-col gap-2">
              <UserMenu />
            </div>

          </div>

        </div>
      )}

    </div>
  </div>
  <AnimatePresence mode="wait">

    {!active ? (
      <motion.div
        key="home"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-10 md:gap-16 w-full"
      >

        {/* HERO TITLE */}
        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-0 text-center md:text-left">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="
              text-5xl sm:text-6xl md:text-8xl lg:text-9xl
              font-black tracking-[-0.06em] leading-[0.85]
              bg-gradient-to-b from-blue-600 to-sky-400 bg-clip-text text-transparent
              flex items-center justify-center md:scale-x-90
            "
          >
            CURTIN
          </motion.div>

          <div className="flex flex-col justify-center min-w-0 md:min-w-[280px]">

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="
                text-3xl sm:text-4xl md:text-6xl lg:text-7xl
                font-black tracking-[0.2em] text-blue-600 leading-none
              "
            >
              E.R.P.
            </motion.div>

            <div className="h-[1px] w-full bg-gradient-to-r from-blue-300 to-transparent my-3" />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-gray-600 font-medium leading-snug"
            >
              {dict.curtinims}
            </motion.div>

          </div>
        </div>

        {/* MENU */}
        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-2
          gap-4 md:gap-6
          w-full max-w-2xl
        ">

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={buttonClass}
            onClick={() => setActive("products")}
          >
            <span className={`${iconWrapper} bg-gradient-to-br from-sky-400 to-blue-500`}>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Box className="w-5 h-5 text-white" />
              </motion.div>
            </span>
            {dict.body}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={buttonClass}
            onClick={() => setActive("coilStandard")}
          >
            <span className={`${iconWrapper} bg-gradient-to-br from-amber-400 to-orange-500`}>
              <motion.div
                animate={{ rotate: [0, 12, -12, 0] }}
                transition={{ repeat: Infinity, duration: 3.5 }}
                className="text-lg"
                style={{ filter: "brightness(0) invert(1)" }}
              >
                ⚡
              </motion.div>
            </span>
            {dict.coilStandard}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={buttonClass}
            onClick={() => setActive("coilIndependent")}
          >
            <span className={`${iconWrapper} bg-gradient-to-br from-purple-500 to-fuchsia-500`}>
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="text-lg"
                style={{ filter: "brightness(0) invert(1)" }}
              >
                ⚡
              </motion.div>
            </span>
            {dict.coilIndependent}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={buttonClass}
            onClick={() => setActive("inventory")}
          >
            <span className={`${iconWrapper} bg-gradient-to-br from-emerald-400 to-green-500`}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <BarChart3 className="w-5 h-5 text-white" />
              </motion.div>
            </span>
            {dict.inventory}
          </motion.button>

          

           {user?.role =="admin" && (<motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={buttonClass}
            onClick={() => setActive("business-intelligence")}
          >
            <span className={`${iconWrapper} bg-gradient-to-br from-sky-400 to-blue-500`}>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Box className="w-5 h-5 text-white" />
              </motion.div>
            </span>
            {dict.businessIntelligence}
          </motion.button>)}

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
            ← {dict.back}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
          {active === "products" && <ProductsPage user={user} />}
          {active === "coilStandard" && <CoilStandardPage user={user}/>}
          {active === "coilIndependent" && <CoilIndependentPage user={user} />}
          {active === "inventory" && <NewInventory user={user}/>}
          {active === "business-intelligence"  && (<BusinessIntelligence user={user} />)}
        </div>

      </motion.div>
    )}

  </AnimatePresence>

  
</div>
  );
}
