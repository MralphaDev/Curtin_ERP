"use client";

import { useEffect, useState } from "react";
import { Plus, Package, Trash2, Loader2, Thermometer, Gauge, Circle, Link2, Boxes } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    model_number: "",
    category: "",
    manufacturer: "",
    inner_diameter_mm: "",
    temp_min_c: "",
    temp_max_c: "",
    pressure_min_bar: "",
    pressure_max_bar: "",
    connection: "",
  });

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function load() {
    setLoading(true);
    const res = await fetch("/api/products");
    setProducts(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await res.json();

    if (result.success) {
      setForm({
        model_number: "",
        category: "",
        manufacturer: "",
        inner_diameter_mm: "",
        temp_min_c: "",
        temp_max_c: "",
        pressure_min_bar: "",
        pressure_max_bar: "",
        connection: "",
      });
      load();
    } else {
      alert(result.message);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    load();
  }

  const fields = [
    ["model_number", "Model Number"],
    ["category", "Category"],
    ["manufacturer", "Manufacturer"],
    ["inner_diameter_mm", "Inner Diameter (mm)"],
    ["temp_min_c", "Temp Min (°C)"],
    ["temp_max_c", "Temp Max (°C)"],
    ["pressure_min_bar", "Pressure Min (bar)"],
    ["pressure_max_bar", "Pressure Max (bar)"],
    ["connection", "Connection Type"],
  ];

  return (
<div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-slate-50 relative">

  {/* Background FX */}
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
            Body
          </h1>
          <p className="text-slate-500 text-xs md:text-sm">
            Lightweight valve catalog management system
          </p>
        </div>

      </div>
    </header>

    {/* ================= MAIN GRID ================= */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">

      {/* ================= FORM ================= */}
      <div className="relative">

        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-blue-500/5 rounded-3xl" />

        <div className="relative rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-xl shadow-xl shadow-sky-100/50 p-5 md:p-8">

          {/* Form Header */}
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600">
              <Plus className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 text-sm md:text-base">
                Create Body
              </h2>
              <p className="text-xs text-slate-500">
                Add new product to inventory
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={submit} className="space-y-4 md:space-y-5">

            {/* responsive fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">

              {fields.map(([key, label]) => (
                <div key={key} className="relative">

                  <input
                    type="text"
                    value={form[key]}
                    onChange={(e) => update(key, e.target.value)}
                    placeholder=" "
                    className="
                      peer w-full px-4 pt-6 pb-2 rounded-xl border-2 border-slate-200 bg-white
                      text-sm text-slate-900 placeholder-transparent outline-none
                      focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10
                      transition
                    "
                  />

                  <label className="
                    absolute left-4 top-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                    peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case
                    peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px]
                    peer-focus:text-sky-600 transition-all
                  ">
                    {label}
                  </label>

                </div>
              ))}

            </div>

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
              Create Product
            </button>

          </form>

        </div>
      </div>

      {/* ================= LIST ================= */}
      <div className="relative">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-sky-500/5 rounded-3xl" />

        <div className="relative rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-xl shadow-xl shadow-sky-100/50 p-5 md:p-8">

          {/* List Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">

            <div className="flex items-center gap-3">

              <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500">
                <Package className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 text-sm md:text-base">
                  Product List
                </h2>
                <p className="text-xs text-slate-500">
                  Manage your inventory
                </p>
              </div>

            </div>

            <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-slate-100 border border-slate-200">

              {loading ? (
                <Loader2 className="w-3.5 h-3.5 text-sky-500 animate-spin" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}

              <span className="text-xs font-medium text-slate-600">
                {loading ? "Loading..." : `${products.length} items`}
              </span>

            </div>

          </div>

          {/* LIST */}
          <div className="space-y-4 max-h-[65vh] md:max-h-[70vh] overflow-y-auto pr-1 md:pr-2">

            {loading
              ? [...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 md:p-6 animate-pulse" />
                ))
              : products.map((p) => (
                  <div
                    key={p.id}
                    className="
                      group relative rounded-2xl border-2 border-slate-100 bg-white
                      p-4 md:p-6
                      hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100/50
                      transition
                    "
                  >

                    {/* header */}
                    <div className="flex items-start justify-between mb-4">

                      <div>
                        <h3 className="font-bold text-base md:text-lg text-slate-900 group-hover:text-sky-700">
                          {p.model_number}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-500">
                          {p.manufacturer} | {p.category}
                        </p>
                      </div>

                      <button className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                    {/* mobile-friendly stack instead of strict grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                      <div className="px-3 py-2 rounded-xl bg-sky-50 border border-sky-100 text-sm">
                        Diameter: <b>{p.inner_diameter_mm}</b> mm
                      </div>

                      <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-sm truncate">
                        {p.connection}
                      </div>

                      <div className="px-3 py-2 rounded-xl bg-orange-50 border border-orange-100 text-sm">
                        Temp: {p.temp_min_c} → {p.temp_max_c} °C
                      </div>

                      <div className="px-3 py-2 rounded-xl bg-violet-50 border border-violet-100 text-sm">
                        Pressure: {p.pressure_min_bar} → {p.pressure_max_bar}
                      </div>

                    </div>

                    {/* stock */}
                    <div className="mt-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
                        ● Stock: {p.stock}
                      </span>
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
