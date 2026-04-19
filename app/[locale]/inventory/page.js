"use client";

import { useEffect, useState } from "react";
import { INVENTORY_MODES } from "@/lib/constants/inventoryModes";
import { ITEM_TYPES } from "@/lib/constants/itemTypes";

export default function NewInventory() {

  // ================================
  // 📦 DATA STATE (FROM API)
  // ================================
  const [products, setProducts] = useState([]);
  const [coilStd, setCoilStd] = useState([]);
  const [coilIndp, setCoilIndp] = useState([]);
  const [events, setEvents] = useState([]);

  // ================================
  // 🧾 SHARED STATE
  // ================================
  const [mode, setMode] = useState("");
  //  company is shared across IN/OUT submissions in this page
  const [company, setCompany] = useState("");

  // ❌ removed global action (now per-panel)

  // ================================
  // 🟢 IN STATE
  // ================================
  const [inSelectedValve, setInSelectedValve] = useState(null);
  const [inSelectedCoilStd, setInSelectedCoilStd] = useState(null);
  const [inSelectedCoilIndp, setInSelectedCoilIndp] = useState(null);
  const [inQuantity, setInQuantity] = useState(1);

  // ================================
  // 🔴 OUT STATE
  // ================================
  const [outSelectedValve, setOutSelectedValve] = useState(null);
  const [outSelectedCoilStd, setOutSelectedCoilStd] = useState(null);
  const [outSelectedCoilIndp, setOutSelectedCoilIndp] = useState(null);
  const [outQuantity, setOutQuantity] = useState(1);

  // ================================
  // 🌐 FETCH INITIAL DATA
  // ================================
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(setProducts);

    fetch("/api/coil")
      .then(res => res.json())
      .then((data) => {
        console.log("coil api:", data);

        if (data.standard && data.independent) {
          //console.log("Standard coils:", data.standard);
         // console.log("Independent coils:", data.independent);
          setCoilStd(data.standard); //return all standard coils
          setCoilIndp(data.independent); //return all independent coils
        } else if (Array.isArray(data)) {
          setCoilStd(data.filter(c => c.type === "standard"));
          setCoilIndp(data.filter(c => c.type === "independent"));
        }
      });

    fetch("/api/inventory-event")
      .then(res => res.json())
      .then(setEvents);
    
  }, []);

  // ================================
  // 🧠 BUILD ITEMS 
  // ================================
  function buildItems(side) {
    const isIn = side === "IN";

    const selectedValve = isIn ? inSelectedValve : outSelectedValve;
    const selectedCoilStd = isIn ? inSelectedCoilStd : outSelectedCoilStd;
    const selectedCoilIndp = isIn ? inSelectedCoilIndp : outSelectedCoilIndp;
    const quantity = isIn ? inQuantity : outQuantity;

    switch (mode) {

      case INVENTORY_MODES.VALVE_ONLY:
        return [
          {
            item_type: ITEM_TYPES.VALVE_BODY,
            item_id: selectedValve,
            quantity,
          },
        ];

      case INVENTORY_MODES.COIL_STANDARD_ONLY:
        return [
          {
            item_type: ITEM_TYPES.COIL_STANDARD,
            item_id: selectedCoilStd,
            quantity,
          },
        ];

      case INVENTORY_MODES.COIL_INDEPENDENT_ONLY:
        return [
          {
            item_type: ITEM_TYPES.COIL_INDEPENDENT,
            item_id: selectedCoilIndp,
            quantity,
          },
        ];

      case INVENTORY_MODES.VALVE_PLUS_STANDARD:
        return [
          {
            item_type: ITEM_TYPES.VALVE_BODY,
            item_id: selectedValve,
            quantity,
          },
        ];

      case INVENTORY_MODES.VALVE_PLUS_INDEPENDENT:
        return [
          {
            item_type: ITEM_TYPES.VALVE_BODY,
            item_id: selectedValve,
            quantity,
          },
          {
            item_type: ITEM_TYPES.COIL_INDEPENDENT,
            item_id: selectedCoilIndp,
            quantity,
          },
        ];

      default:
        return [];
    }
  }


function normalizeCompany(s) {
  return (s || "")
    .toUpperCase()
    .trim()
    .replace(/[-\/.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

  // ================================
  // 🚀 SUBMIT (IN / OUT SPLIT)
  // ================================
  async function submit(side) {
    if (!company || !company.trim()) {
      alert("Company 不能为空");
      return;
    }

    const body = {
      action: side,
      mode,
      company: normalizeCompany(company), // include company in payload
      remark: "from UI",
      items: buildItems(side),
    };

    const res = await fetch("/api/inventory-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Something went wrong");
      return;
    }

    if (data.warnings?.length) {
      alert(data.warnings.join("\n"));
    }

    fetch("/api/inventory-event")
      .then(res => res.json())
      .then(setEvents);

    fetch("/api/coil")
      .then(res => res.json())
      .then((data) => {
        if (data.standard && data.independent) {
          setCoilStd(data.standard);
          setCoilIndp(data.independent);
        } else if (Array.isArray(data)) {
          setCoilStd(data.filter(c => c.type === "standard"));
          setCoilIndp(data.filter(c => c.type === "independent"));
        }
      });

      fetch("/api/products")
        .then(res => res.json())
        .then(setProducts);
        
    
  }

  // ================================
  // 🔍 HELPERS
  // ================================
  function getValve(id) {
   
    return products.find(p => p.id === id)?.model_number_active || "deleted valve id: " + id; //model number active is the model number of the current active standard coil
  
  }

  function getCoilStd(id) {
    //console.log("getCoilStd id:", id, "coilStd:", coilStd);
    return coilStd.find(c => c.id === id)?.unique_key_active || "deleted coil standard id: " + id; //unique key active is the model number of the current active standard coil 
  }

  function getCoilIndp(id) {
    //console.log("getCoilIndp id:", id, "coilIndp:", coilIndp);
    return coilIndp.find(c => c.id === id)?.unique_key_active || "deleted coil independent id: " + id; //unique key active is the model number of the current active independent coil
  }

  function formatEvent(event) {
    let valve = null;
    let coil = null;
    let qty = event.items[0]?.quantity;

    for (const item of event.items) {
      if (item.item_type === "valve_body") {
        valve = getValve(item.item_id);
      }
      if (item.item_type === "coil_standard") {
        coil = getCoilStd(item.item_id);
      }
      if (item.item_type === "coil_independent") {
        coil = getCoilIndp(item.item_id);
      }
    }

    if (valve && coil) return `${valve} + ${coil} (x${qty})`;
    if (valve) return `${valve} (x${qty})`;
    if (coil) return `${coil} (x${qty})`;

    return "Unknown";
  }

async function deleteEvent(id) {
  const confirmDelete = confirm("Are you sure you want to delete this event?");
  if (!confirmDelete) return;

  const res = await fetch(`/api/inventory-event?id=${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Delete failed");
    return;
  }

  // =========================
  // FIX #1: refresh events
  // =========================
  const updatedEvents = await fetch("/api/inventory-event")
    .then(res => res.json());

  setEvents(updatedEvents);

  // =========================
  // 🔥 FIX #2 (MISSING): refresh STOCK
  // =========================
  /*const updatedStock = await fetch("/api/inventory-stock")
    .then(res => res.json());

  // console.log("♻️ updated stock after delete:", updatedStock);*/

  // if you have stock state:
  // setStock(updatedStock);
}

  // ================================
  // 🎨 UI
  // ================================
if (coilStd.length > 0) {
  console.log("coilstandard:", coilStd);
}

if (coilIndp.length > 0) {
  console.log("coilindependent:", coilIndp);
}
return (
<div className="min-h-screen bg-gradient-to-br from-white via-sky-50/30 to-white">
  {/* Ambient background effects */}
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl animate-pulse" />
    <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl" />
    <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-cyan-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
  </div>

  <div className="relative z-10 px-6 lg:px-12 py-10 max-w-7xl mx-auto">
    {/* HEADER */}
    <div className="mb-10">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100/80 text-sky-600 text-xs font-medium mb-4 backdrop-blur-sm border border-sky-200/50">
        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
        Stock Management
      </div>
      <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 bg-clip-text text-transparent">
        Inventory Events
      </h1>
      <p className="text-slate-500 text-base mt-2 max-w-md">
        Seamlessly manage your IN / OUT stock movements with precision
      </p>
    </div>

    {/* TOP CONTROLS */}
    <div className="mb-8 flex flex-wrap items-end gap-6 p-6 rounded-3xl bg-white/60 backdrop-blur-xl border border-sky-100/80 shadow-lg shadow-sky-100/20">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Mode</label>
        <select
          onChange={(e) => setMode(e.target.value)}
          className="min-w-[200px] rounded-2xl border-2 border-sky-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:border-sky-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 focus:outline-none cursor-pointer appearance-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
        >
          <option value="">Select Mode</option>
          {Object.values(INVENTORY_MODES).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 flex-1 max-w-md">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Company</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Enter company name..."
          className="w-full rounded-2xl border-2 border-sky-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:border-sky-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 focus:outline-none placeholder:text-slate-400"
        />
      </div>
    </div>

    {/* MAIN GRID - IN / OUT */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

      {/* ================= IN CARD ================= */}
      <div className="group relative rounded-[2rem] bg-white/70 backdrop-blur-xl border-2 border-emerald-100/80 p-8 shadow-xl shadow-emerald-100/20 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-200/30 hover:border-emerald-200 hover:-translate-y-1">
        {/* Card glow effect */}
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-emerald-50/50 via-transparent to-green-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Header */}
        <div className="relative flex items-center gap-4 mb-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-200/50">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-600">IN</h2>
            <p className="text-sm text-slate-500">Add stock to inventory</p>
          </div>
        </div>

        <div className="relative space-y-4">
          {/* VALVE */}
          {(mode === INVENTORY_MODES.VALVE_ONLY ||
            mode === INVENTORY_MODES.VALVE_PLUS_STANDARD ||
            mode === INVENTORY_MODES.VALVE_PLUS_INDEPENDENT) && (
            <select
              onChange={(e) => setInSelectedValve(Number(e.target.value))}
              className="w-full rounded-2xl border-2 border-emerald-100 bg-white/80 px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:border-emerald-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 focus:outline-none cursor-pointer"
            >
              <option value="">Select Valve</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.model_number_active}</option>
                
              ))}
              
            </select>
          )}

          {/* COIL STD */}
          {mode === INVENTORY_MODES.COIL_STANDARD_ONLY && (
            <select
              onChange={(e) => setInSelectedCoilStd(Number(e.target.value))}
              className="w-full rounded-2xl border-2 border-emerald-100 bg-white/80 px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:border-emerald-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 focus:outline-none cursor-pointer"
            >
              <option value="">Select Coil Standard</option>
              {coilStd.map((c) => (
                <option key={c.id} value={c.id}>{c.unique_key_active}</option>
              ))}
            </select>
          )}

          {/* COIL INDP */}
          {(mode === INVENTORY_MODES.COIL_INDEPENDENT_ONLY ||
            mode === INVENTORY_MODES.VALVE_PLUS_INDEPENDENT) && (
            <select
              onChange={(e) => setInSelectedCoilIndp(Number(e.target.value))}
              className="w-full rounded-2xl border-2 border-emerald-100 bg-white/80 px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:border-emerald-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 focus:outline-none cursor-pointer"
            >
              <option value="">Select Coil Independent</option>
              {coilIndp.map((c) => (
                <option key={c.id} value={c.id}>{c.unique_key_active}</option>
              ))}
            </select>
          )}

          <input
            type="number"
            min={1}
            value={inQuantity}
            onChange={(e) => setInQuantity(Number(e.target.value))}
            className="w-full rounded-2xl border-2 border-emerald-100 bg-white/80 px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:border-emerald-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 focus:outline-none placeholder:text-slate-400"
            placeholder="Enter quantity..."
          />

          <button
            onClick={() => submit("IN")}
            className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 py-4 text-white font-bold text-base shadow-lg shadow-emerald-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-300/50 hover:scale-[1.02] active:scale-[0.98] group/btn"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Submit IN
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>

      {/* ================= OUT CARD ================= */}
      <div className="group relative rounded-[2rem] bg-white/70 backdrop-blur-xl border-2 border-rose-100/80 p-8 shadow-xl shadow-rose-100/20 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-200/30 hover:border-rose-200 hover:-translate-y-1">
        {/* Card glow effect */}
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-rose-50/50 via-transparent to-red-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Header */}
        <div className="relative flex items-center gap-4 mb-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-red-500 shadow-lg shadow-rose-200/50">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-rose-600">OUT</h2>
            <p className="text-sm text-slate-500">Remove stock from inventory</p>
          </div>
        </div>

        <div className="relative space-y-4">
          {/* VALVE */}
          {(mode === INVENTORY_MODES.VALVE_ONLY ||
            mode === INVENTORY_MODES.VALVE_PLUS_STANDARD ||
            mode === INVENTORY_MODES.VALVE_PLUS_INDEPENDENT) && (
            <select
              onChange={(e) => setOutSelectedValve(Number(e.target.value))}
              className="w-full rounded-2xl border-2 border-rose-100 bg-white/80 px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 focus:outline-none cursor-pointer"
            >
              <option value="">Select Valve</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.model_number_active}</option>
              ))}
            </select>
          )}

          {/* COIL STD */}
          {mode === INVENTORY_MODES.COIL_STANDARD_ONLY && (
            <select
              onChange={(e) => setOutSelectedCoilStd(Number(e.target.value))}
              className="w-full rounded-2xl border-2 border-rose-100 bg-white/80 px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 focus:outline-none cursor-pointer"
            >
              <option value="">Select Coil Standard</option>
              {coilStd.map((c) => (
                <option key={c.id} value={c.id}>{c.unique_key_active}</option>
              ))}
            </select>
          )}

          {/* COIL INDP */}
          {(mode === INVENTORY_MODES.COIL_INDEPENDENT_ONLY ||
            mode === INVENTORY_MODES.VALVE_PLUS_INDEPENDENT) && (
            <select
              onChange={(e) => setOutSelectedCoilIndp(Number(e.target.value))}
              className="w-full rounded-2xl border-2 border-rose-100 bg-white/80 px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 focus:outline-none cursor-pointer"
            >
              <option value="">Select Coil Independent</option>
              {coilIndp.map((c) => (
                <option key={c.id} value={c.id}>{c.unique_key_active}</option>
              ))}
            </select>
          )}

          <input
            type="number"
            min={1}
            value={outQuantity}
            onChange={(e) => setOutQuantity(Number(e.target.value))}
            className="w-full rounded-2xl border-2 border-rose-100 bg-white/80 px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 focus:outline-none placeholder:text-slate-400"
            placeholder="Enter quantity..."
          />

          <button
            onClick={() => submit("OUT")}
            className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 py-4 text-white font-bold text-base shadow-lg shadow-rose-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-rose-300/50 hover:scale-[1.02] active:scale-[0.98] group/btn"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Submit OUT
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-rose-400 to-red-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </div>

    {/* ================= HISTORY ================= */}
    <div className="rounded-[2rem] bg-white/60 backdrop-blur-xl border-2 border-sky-100/80 p-4 md:p-8 shadow-xl shadow-sky-100/20">

      {/* HEADER */}
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">

        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-lg shadow-sky-200/50">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">
            Event History
          </h2>
          <p className="text-xs md:text-sm text-slate-500">
            Track all inventory movements
          </p>
        </div>

      </div>

      {/* LIST */}
      <div className="grid gap-3 md:gap-4">

        {events.map((event, index) => (
          <div
            key={event.id}
            className="group relative rounded-2xl border-2 border-slate-100 bg-white/80 p-4 md:p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-sky-200 hover:-translate-y-0.5 overflow-hidden"
            style={{ animationDelay: `${index * 50}ms` }}
          >

            {/* MAIN ROW */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4 min-w-0 w-full">

              {/* LEFT SIDE */}
              <div className="flex items-start gap-3 md:gap-4 min-w-0 w-full">

                {/* ACTION ICON */}
                <div className={`flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl flex-shrink-0 ${
                  event.action === 'IN'
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-rose-100 text-rose-600'
                }`}>
                  {event.action === 'IN' ? (
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex-1 min-w-0 w-full">

                  {/* BADGES */}
                  <div className="flex flex-wrap items-center gap-2 mb-1">

                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                      event.action === 'IN'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {event.action}
                    </span>

                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-sky-100 text-sky-700 text-xs font-semibold">
                      {event.mode}
                    </span>

                  </div>

                  {/* MAIN TEXT (FIXED OVERFLOW) */}
                  <p className="text-sm font-medium text-slate-700 mt-1 md:mt-2 break-words whitespace-normal">
                    {formatEvent(event)}
                  </p>

                  {/* META */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-xs text-slate-500 min-w-0">

                    <span className="flex items-center gap-1 min-w-0">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {event.company}
                    </span>

                    <span className="flex items-center gap-1 min-w-0">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(event.created_at).toLocaleString()}
                    </span>

                  </div>

                </div>
              </div>

              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteEvent(event.id)}
                className="opacity-0 group-hover:opacity-100 md:opacity-0 flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 text-red-500 transition-all duration-300 hover:bg-red-100 hover:scale-110 active:scale-95 self-end md:self-start flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
    
  </div>
</div>
);
}