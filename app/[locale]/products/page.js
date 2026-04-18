"use client";

import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modelNumber, setModelNumber] = useState("");
  const [category, setCategory] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [innerDiameter, setInnerDiameter] = useState("");
  const [tempMin, setTempMin] = useState("");
  const [tempMax, setTempMax] = useState("");
  const [pressureMin, setPressureMin] = useState("");
  const [pressureMax, setPressureMax] = useState("");
  const [connection, setConnection] = useState("");

  async function loadProducts() {
    setLoading(true);

    const res = await fetch("/api/products");
    const data = await res.json();

    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function submit(e) {
    e.preventDefault();

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model_number: modelNumber,
        category,
        manufacturer,
        inner_diameter_mm: innerDiameter,
        temp_min_c: tempMin,
        temp_max_c: tempMax,
        pressure_min_bar: pressureMin,
        pressure_max_bar: pressureMax,
        connection,
      }),
    });

    const result = await res.json();

    if (result.success) {
      setModelNumber("");
      setCategory("");
      setManufacturer("");
      setInnerDiameter("");
      setTempMin("");
      setTempMax("");
      setPressureMin("");
      setPressureMax("");
      setConnection("");
      loadProducts();
    } else {
      alert(result.message);
    }
  }

  async function deleteProduct(id) {
    const ok = confirm("Delete this valve body?");
    if (!ok) return;

    const res = await fetch(`/api/products?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    loadProducts();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full bg-sky-200/55 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute top-40 right-0 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-100/70 blur-3xl animate-pulse" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 md:px-10">
        <section className="rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50/70 to-blue-100/60 p-8 shadow-[0_20px_60px_-35px_rgba(2,132,199,0.55)]">
          <div className="flex flex-col gap-3">
            <p className="inline-flex w-fit items-center rounded-full border border-sky-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Product Studio
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Build your valve catalog beautifully
            </h1>
            <p className="max-w-2xl text-sm text-slate-600 md:text-base">
              A clean white canvas with cool blue accents, smooth motion, and
              modern cards to manage your product lineup.
            </p>
          </div>
        </section>

        <form
          onSubmit={submit}
          className="grid grid-cols-2 gap-3 rounded-3xl border border-sky-100 bg-white/90 p-6 shadow-[0_16px_55px_-40px_rgba(14,116,144,0.65)] backdrop-blur md:grid-cols-3 md:gap-4"
        >
          {[
            { v: modelNumber, s: setModelNumber, p: "Model Number" },
            { v: category, s: setCategory, p: "Category" },
            { v: manufacturer, s: setManufacturer, p: "Manufacturer" },
            { v: innerDiameter, s: setInnerDiameter, p: "Inner Diameter (mm)" },
            { v: tempMin, s: setTempMin, p: "Temp Min (°C)" },
            { v: tempMax, s: setTempMax, p: "Temp Max (°C)" },
            { v: pressureMin, s: setPressureMin, p: "Pressure Min (bar)" },
            { v: pressureMax, s: setPressureMax, p: "Pressure Max (bar)" },
            { v: connection, s: setConnection, p: "Connection" },
          ].map((f, i) => (
            <input
              key={i}
              className="rounded-xl border border-sky-100 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-100"
              placeholder={f.p}
              value={f.v}
              onChange={(e) => f.s(e.target.value)}
            />
          ))}

          <button
            type="submit"
            className="col-span-2 mt-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-300/40 transition-all hover:-translate-y-0.5 hover:shadow-sky-400/50 md:col-span-3"
          >
            Create Product
          </button>
        </form>

        <section className="grid min-h-[320px] gap-5 md:grid-cols-2">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-36 rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white animate-pulse"
                />
              ))
            : products.map((p) => (
                <article
                  key={p.id}
                  className="group rounded-3xl border border-sky-100 bg-white p-6 shadow-[0_14px_42px_-35px_rgba(14,116,144,0.9)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-30px_rgba(37,99,235,0.55)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-slate-900">
                        {p.model_number}
                      </div>
                      <div className="text-sm text-slate-500">
                        {p.manufacturer} • {p.category}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-500 transition hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 text-sm text-slate-700">
                    <div className="rounded-lg bg-sky-50 px-3 py-2">
                      Ø {p.inner_diameter_mm} mm
                    </div>
                    <div className="rounded-lg bg-sky-50 px-3 py-2">
                      {p.connection}
                    </div>
                    <div className="rounded-lg bg-sky-50 px-3 py-2">
                      {p.temp_min_c}°C → {p.temp_max_c}°C
                    </div>
                    <div className="rounded-lg bg-sky-50 px-3 py-2">
                      {p.pressure_min_bar} → {p.pressure_max_bar} bar
                    </div>
                  </div>

                  <div className="mt-5 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                    Stock: {p.stock}
                  </div>
                </article>
              ))}
        </section>
      </div>
    </div>
  );
}
