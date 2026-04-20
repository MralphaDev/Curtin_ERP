"use client";

import { useEffect, useState} from "react";
import { usePathname } from "next/navigation";
import { ITEM_TYPES } from "@/lib/constants/itemTypes";
import { Boxes, Plus, Trash2, Loader2 } from "lucide-react";
import { getDictionary } from "@/lib/dictionary";

export default function CoilStandardPage({user}) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const dict = getDictionary(locale);

  const [products, setProducts] = useState([]);
  const [coils, setCoils] = useState([]);

  const [selectedModel, setSelectedModel] = useState("");
  const [voltageValue, setVoltageValue] = useState("");
  const [voltageType, setVoltageType] = useState("VAC");
  const [manufacturer, setManufacturer] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  async function loadCoils() {
    const res = await fetch("/api/coil");
    const data = await res.json();
    setCoils(data.standard);
  }

  useEffect(() => {
    loadCoils();
  }, []);

  async function submit(e) {
    e.preventDefault();

    const voltage =
      voltageValue !== "" ? `${voltageValue}${voltageType}` : "";

    const body = {
      type: ITEM_TYPES.COIL_STANDARD,
      data: {
        model_number: selectedModel,
        voltage,
        manufacturer,
      },
    };

    const res = await fetch("/api/coil", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await res.json();

    if (result.success) {
      setSelectedModel("");
      setVoltageValue("");
      setVoltageType("VAC");
      setManufacturer("");
      loadCoils();
    } else {
      alert(result.message);
    }
  }

  async function deleteCoil(id, type) {
    if (!confirm("Delete this coil?")) return;

    const res = await fetch(`/api/coil?id=${id}&type=${type}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    loadCoils();
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-slate-50 relative">

  {/* Background blobs */}
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -right-40 w-[500px] md:w-[600px] h-[500px] md:h-[600px] bg-sky-100/60 rounded-full blur-3xl" />
    <div className="absolute -bottom-40 -left-40 w-[400px] md:w-[500px] h-[400px] md:h-[500px] bg-blue-100/50 rounded-full blur-3xl" />
  </div>

  <div className="relative w-full px-4 sm:px-6 lg:px-16 py-8 md:py-10">

    {/* ================= HEADER ================= */}
    <header className="mb-8 md:mb-10">

      <div className="flex items-start md:items-center gap-4">

        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/25">
          <Boxes className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
             {dict.coilStandardTitle}
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            {dict.coilStandardDesc}
          </p>
        </div>

      </div>

    </header>

    {/* ================= GRID ================= */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">

      {/* ================= FORM ================= */}
      <div className="relative">

        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-blue-500/5 rounded-3xl" />

        <div className="relative rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-xl shadow-xl shadow-sky-100/50 p-5 md:p-8">

          {/* FORM HEADER */}
          <div className="flex items-center gap-3 mb-6 md:mb-8">

            <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600">
              <Plus className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 text-sm md:text-base">
              {dict.createCoilTitle}
            </h2>

            <p className="text-xs text-slate-500">
              {dict.createCoilDesc}
            </p>
            </div>

          </div>

          {/* FORM */}
          <form onSubmit={submit} className="space-y-4 md:space-y-5">

            {/* SELECT */}
            <select
              className="
                w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm
                focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition
              "
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="">{dict.selectValveModel}</option>
              {products.map((p) => (
                <option key={p.id} value={p.model_number_active}>
                  {p.model_number_active} - {p.manufacturer}
                </option>
              ))}
            </select>

            <div className="text-xs text-slate-500">
              {dict.selected}: <b>{selectedModel || "-"}</b>
            </div>

            {/* INPUT ROW (RESPONSIVE FIX) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">

              <input
                type="text"
                inputMode="numeric"
                placeholder= {dict.voltageValue}
                className="px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm
                focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition"
                value={voltageValue}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" ||
                    e.key === "Delete" ||
                    e.key === "ArrowLeft" ||
                    e.key === "ArrowRight" ||
                    e.key === "Tab"
                  ) return;

                  if (!/^[0-9]$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => setVoltageValue(e.target.value)}
              />

              <select
                className="px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm
                focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition"
                value={voltageType}
                onChange={(e) => setVoltageType(e.target.value)}
              >
                <option value="VAC">VAC</option>
                <option value="VDC">VDC</option>
              </select>

            </div>

            {/* MANUFACTURER */}
          <select
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm
            focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
          >
            <option value="">{dict.manufacturer}</option>
            <option value="JAKSA">JAKSA</option>
            <option value="CEME">CEME</option>
            <option value="ROTORK">ROTORK</option>
            <option value="GOETVALVE">GOETVALVE</option>
            <option value="SATURN">SATURN</option>
          </select>

            <button
              type="submit"
              className="
                w-full py-3 md:py-4 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-sky-500 to-blue-600 text-white
                hover:from-sky-400 hover:to-blue-500
                active:scale-[0.98] transition
                shadow-lg shadow-sky-500/30
              "
            >
              {dict.createCoilButton}
            </button>

          </form>

        </div>
      </div>

      {/* ================= LIST ================= */}
      <div className="relative">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-sky-500/5 rounded-3xl" />

        <div className="relative rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-xl shadow-xl shadow-sky-100/50 p-5 md:p-8">

          {/* LIST HEADER */}
          <div className="flex items-center justify-between mb-6 md:mb-8">

            <div className="flex items-center gap-3">

              <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500">
                <Boxes className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 text-sm md:text-base">
                  {dict.coilListTitle}
                </h2>

                <p className="text-xs text-slate-500">
                  {dict.coilListDesc}
                </p>
              </div>

            </div>

            <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600">
              {coils.length} {dict.coilListCount}
            </div>

          </div>

          {/* LIST */}
          <div className="space-y-4 max-h-[65vh] md:max-h-[70vh] overflow-y-auto pr-1 md:pr-2">

          {coils.map((c) => (
            <div
              key={c.id}
              className="
                group relative rounded-2xl border-2 border-slate-100 bg-white
                p-4 md:p-6
                hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100/50
                transition
              "
            >

              {/* HEADER */}
              <div className="flex items-start justify-between mb-4">

                {/* LEFT SIDE (DOT + TEXT) */}
                <div className="flex items-start gap-2">

                  {/* 🟢 ACTIVE DOT */}
                  <span className="mt-2 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />

                  <div>
                    <h3 className="font-bold text-base md:text-lg text-slate-900 group-hover:text-sky-700">
                      {c.unique_key_active}
                    </h3>

                    <p className="text-xs md:text-sm text-slate-500">
                      {c.valve_model}
                    </p>
                  </div>

                </div>

                {/* DELETE (Product.js style) */}
                {user.role === "admin" && (
                  <button
                    onClick={() => deleteCoil(c.id, ITEM_TYPES.COIL_STANDARD)}
                    className="
                      p-2 rounded-lg text-slate-400
                      opacity-0 group-hover:opacity-100
                      hover:bg-red-50 hover:text-red-500
                    transition-all duration-200
                  "
                >
                  <Trash2 className="w-4 h-4" />
                </button>)}

              </div>

              {/* SPECS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* ⚡ VOLTAGE */}
                <div className="px-3 py-2 rounded-xl bg-sky-50 border border-sky-100 text-sm">
                  ⚡ {dict.voltageValue}: <b>{c.voltage}</b>
                </div>

                {/* 🏭 MANUFACTURER */}
                <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-sm">
                  🏭 {dict.manufacturerBody}: {c.manufacturer}
                </div>

              </div>

              {/* 📦 STOCK */}
              <div className="mt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  📦 <span className="text-sm font-semibold text-emerald-700">
                    {dict.stock}: {c.stock}
                  </span>
                </div>
              </div>

            </div>
          ))}

          </div>

        </div>
      </div>

    </div>
  </div>
</div>
  );
}