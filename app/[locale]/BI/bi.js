"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import ChatBI from "./chatBI";
import Report from "./Report";
import TopCompany from "./TopCompany";
import TopProduct from "./TopProduct";
import Stats from "./Stats";

/* -----------------------------
   MAIN PAGE
----------------------------- */
export default function BusinessIntelligence() {
  const [view, setView] = useState("chat");

  function renderView() {
    switch (view) {
      case "topCompany":
        return <TopCompany />;
      case "topProduct":
        return <TopProduct />;
      case "stats":
        return <Stats />;
      case "report":
        return <Report />;
      default:
        return <ChatBI />;
    }
  }

  return (
<div className="h-[80vh] w-full flex flex-col md:flex-row bg-gradient-to-br from-white via-sky-50/40 to-white overflow-hidden relative">
  {/* Ambient background effects */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-32 -right-32 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl" />
    <div className="absolute top-1/2 -left-20 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />
    <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-cyan-100/20 rounded-full blur-3xl" />
    {/* Grid overlay */}
    <div 
      className="absolute inset-0 opacity-[0.015]"
      style={{
        backgroundImage: `linear-gradient(rgba(14,165,233,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.5) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }}
    />
  </div>

  {/* Left Navigation */}
  <div className="relative z-10 w-full md:w-[280px] md:h-full bg-white/70 backdrop-blur-2xl border-r border-sky-100/60 p-4 md:p-6 flex md:flex-col flex-row gap-3 md:gap-3 overflow-x-auto md:overflow-visible shadow-xl shadow-sky-100/10">
    {/* Brand */}
    <div className="flex items-center gap-3 mb-0 md:mb-6">
      <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-500 shadow-lg shadow-sky-300/40">
        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <div className="hidden md:block">
        <h1 className="text-lg font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Inventory BI
        </h1>
        <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Intelligence Hub</p>
      </div>
    </div>

    {/* Nav Items */}
    <div className="flex md:flex-col flex-row gap-2 md:gap-1.5 flex-1">
      {[
        { id: "chat", label: "Chat BI", icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )},
        /*{ id: "topCompany", label: "Top Company", icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )},
        { id: "topProduct", label: "Top Product", icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )},
        { id: "stats", label: "Statistics", icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )},*/
        { id: "report", label: "Report/报表", icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )},
      ].map((item, index) => (
        <motion.div
          key={item.id}
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setView(item.id)}
          className={`group relative min-w-[130px] md:min-w-0 flex items-center gap-3 px-4 py-3 text-sm rounded-2xl cursor-pointer transition-all duration-300 ${
            view === item.id
              ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 text-white shadow-lg shadow-sky-300/40'
              : 'bg-white/60 border border-sky-100/60 text-slate-600 hover:bg-sky-50/80 hover:border-sky-200 hover:shadow-md hover:shadow-sky-100/30'
          }`}
        >
          <span className={`transition-transform duration-300 ${view === item.id ? 'text-white' : 'text-sky-500 group-hover:scale-110'}`}>
            {item.icon}
          </span>
          <span className="font-medium whitespace-nowrap">{item.label}</span>
          {view === item.id && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute right-3 w-2 h-2 rounded-full bg-white/80"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.div>
      ))}
    </div>

    {/* Bottom decoration */}
    <div className="hidden md:block mt-auto pt-6 border-t border-sky-100/50">
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-700">AI Powered</p>
          <p className="text-[10px] text-slate-400">Real-time analytics</p>
        </div>
      </div>
    </div>
  </div>

  {/* Main Content Area */}
  <div className="relative z-10 flex-1 overflow-hidden">
    {/* Top bar accent line */}
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
    
    {/* Content wrapper with glass effect */}
    <motion.div 
      key={view}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full w-full bg-white/50 backdrop-blur-xl overflow-auto"
    >
      {renderView()}
    </motion.div>

    {/* Corner accents */}
    <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-sky-200/30 rounded-tr-3xl pointer-events-none" />
    <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-sky-200/30 rounded-bl-3xl pointer-events-none" />
  </div>
</div>
  );
}